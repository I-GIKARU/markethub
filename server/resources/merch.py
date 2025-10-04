from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import db, Merchandise
from resources.auth.decorators import role_required
from utils.digitalocean_storage import upload_file_to_digitalocean, upload_multiple_files, delete_file_from_digitalocean
import json
import logging

logger = logging.getLogger(__name__)

class MerchandiseList(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            in_stock_filter = request.args.get('in_stock', '')  # Optional filter
            
            # Start with all merchandise
            query = Merchandise.query
            
            # Filter by stock status if specified
            if in_stock_filter.lower() == 'true':
                query = query.filter(Merchandise.quantity > 0)
            elif in_stock_filter.lower() == 'false':
                query = query.filter(Merchandise.quantity <= 0)
            
            merchandise = query.paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            return {
                'merchandise': [item.to_dict() for item in merchandise.items],
                'total': merchandise.total,
                'pages': merchandise.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

    @jwt_required()
    @role_required('admin')  # Only admins can create merchandise
    def post(self):
        try:
            # Handle both JSON and form data
            if request.content_type and 'application/json' in request.content_type:
                data = request.get_json()
            else:
                # Form data (multipart/form-data for file uploads)
                data = request.form.to_dict()
            
            # Validate required fields
            required_fields = ['name', 'price']
            for field in required_fields:
                if field not in data or data[field] is None:
                    return {'error': f'{field} is required'}, 400
            
            # Create new merchandise
            merchandise = Merchandise(
                name=data['name'],
                description=data.get('description', ''),
                price=float(data['price']),
                quantity=int(data.get('quantity', 0)),
                image_url=data.get('image_url', '')
            )
            
            db.session.add(merchandise)
            db.session.flush()  # Get the merchandise ID
            
            # Handle file uploads if present
            uploaded_files = {}
            if request.files:
                # Create folder path
                folder_path = f"merchandise/{merchandise.id}"
                
                # Upload thumbnail/image
                thumbnail = request.files.get('thumbnail') or request.files.get('image')
                if thumbnail and thumbnail.filename:
                    success, result = upload_file_to_digitalocean(thumbnail, folder_path, "image")
                    if success:
                        merchandise.image_url = result['url']
                        uploaded_files['image'] = result
            
            db.session.commit()
            
            return {
                'message': 'Merchandise created successfully',
                'merchandise': merchandise.to_dict(),
                'uploaded_files': uploaded_files if uploaded_files else None
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class MerchandiseDetail(Resource):
    def get(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            return {'merchandise': merchandise.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')  # Only admins can update merchandise
    def put(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            data = request.get_json()
            
            # Update merchandise fields
            if 'name' in data:
                merchandise.name = data['name']
            if 'description' in data:
                merchandise.description = data['description']
            if 'price' in data:
                merchandise.price = data['price']
            if 'quantity' in data:
                merchandise.quantity = data['quantity']
            if 'image_url' in data:
                merchandise.image_url = data['image_url']
            
            db.session.commit()
            
            return {
                'message': 'Merchandise updated successfully',
                'merchandise': merchandise.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')  # Only admins can delete merchandise
    def delete(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            db.session.delete(merchandise)
            db.session.commit()
            
            return {'message': 'Merchandise deleted successfully'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

def setup_routes(api):
    api.add_resource(MerchandiseList, '/api/merchandise')
    api.add_resource(MerchandiseDetail, '/api/merchandise/<int:id>')
