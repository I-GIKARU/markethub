// # # app.py
// # from flask import Flask, jsonify, request, send_from_directory, Blueprint
// # from flask_restful import Api, Resource
// # from models import db, User, Role, Project, UsersProject, Review, Merchandise, Order, OrderItem
// # import os
// # import json
// # from flask_cors import CORS
// # from dotenv import load_dotenv
// # from sqlalchemy.exc import IntegrityError
// # from datetime import timedelta, datetime
// # from werkzeug.utils import secure_filename
// # from flask_migrate import Migrate
// # from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity


// # # --- Configuration ---
// # basedir = os.path.abspath(os.path.dirname(__file__))
// # dotenv_path = os.path.join(basedir, '.env')

// # print(f"DEBUG: Attempting to load .env from: {dotenv_path}")
// # load_dotenv(dotenv_path)

// # jwt_secret_key_from_env = os.getenv("JWT_SECRET_KEY")
// # if jwt_secret_key_from_env:
// #     print(f"DEBUG: JWT_SECRET_KEY loaded from .env: {jwt_secret_key_from_env[:5]}...{jwt_secret_key_from_env[-5:]}")
// # else:
// #     print("DEBUG: JWT_SECRET_KEY NOT loaded from .env. Using fallback.")

// # app = Flask(__name__)

// # # --- App Configurations ---
// # app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///moringa_marketplace.db")
// # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

// # app.config["JWT_SECRET_KEY"] = jwt_secret_key_from_env or "your_fallback_jwt_secret_key"
// # app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

// # print(f"DEBUG: app.config['JWT_SECRET_KEY'] is set to: {app.config['JWT_SECRET_KEY'][:5]}...{app.config['JWT_SECRET_KEY'][-5:]}")

// # UPLOAD_FOLDER = os.path.join(basedir, "uploads")
// # if not os.path.exists(UPLOAD_FOLDER):
// #     os.makedirs(UPLOAD_FOLDER)
// # app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
// # app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

// # ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'zip'}

// # # CORS(app, resources={r"/api/*": {
// # #     "origins": "*",
// # #     "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
// # #     "headers": ["Content-Type", "Authorization"],
// # #     "supports_credentials": True
// # # }})
// # CORS(app, resources={r"/api/*": {"origins": "http://localhost:5174"}})

// # db.init_app(app)
// # migrate = Migrate(app, db)
// # jwt = JWTManager(app)

// # api_bp = Blueprint('api', __name__, url_prefix='/api')
// # api = Api(api_bp)


// # # --- Helper Functions ---
// # def allowed_file(filename):
// #     """Checks if a file's extension is allowed for upload."""
// #     return '.' in filename and \
// #            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

// # def admin_required():
// #     """Decorator to ensure only admin users can access a route."""
// #     def wrapper(fn):
// #         @jwt_required()
// #         def decorator(*args, **kwargs):
// #             current_user_id = get_jwt_identity()
// #             current_user = User.get_by_id(current_user_id)
// #             if not current_user or (current_user.role and current_user.role.name != 'admin'):
// #                 return {"msg": "Administration rights required"}, 403
// #             return fn(*args, **kwargs)
// #         return decorator
// #     return wrapper

// # # --- Static File Serving ---
// # @app.route('/uploads/<filename>')
// # def uploaded_file(filename):
// #     """Serves uploaded files from the UPLOAD_FOLDER."""
// #     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

// # # --- Basic API Home Route ---
// # @api_bp.route('/')
// # def home():
// #     """Home route for the API blueprint."""
// #     return {"message": "Welcome To Moringa MarketPlace API"}

// # # --- Resources (API Endpoints) ---

// # class AuthRegister(Resource):
// #     """Handles user registration."""
// #     def post(self):
// #         data = request.get_json()
// #         email = data.get('email')
// #         password = data.get('password')
// #         username = data.get('username')
// #         first_name = data.get('first_name')
// #         last_name = data.get('last_name')

// #         github = data.get('github')
// #         linkedin = data.get('linkedin')
// #         skills = data.get('skills')
// #         bio = data.get('bio')
// #         profile_pic = data.get('profile_pic')

// #         if not all([email, password, username, first_name, last_name]):
// #             return {"msg": "Email, password, username, first name, and last name are required"}, 400

// #         try:
// #             if User.get_by_email(email):
// #                 return {"msg": "Email already registered"}, 409
// #             if User.get_by_username(username):
// #                 return {"msg": "Username already taken"}, 409

// #             role_name = "user"
// #             if email == "samtomashi@moringaschool.com":
// #                 role_name = "admin"
// #             elif email and "@student.moringaschool.com" in email:
// #                 role_name = "student"

// #             role = Role.get_by_name(role_name)
// #             if not role:
// #                 role = Role.create(name=role_name)

// #             new_user = User.create(
// #                 username=username,
// #                 first_name=first_name,
// #                 last_name=last_name,
// #                 email=email,
// #                 password=password,
// #                 role_id=role.id,
// #                 bio=bio,
// #                 profile_pic=profile_pic,
// #                 github=github,
// #                 linkedin=linkedin,
// #                 skills=skills
// #             )
// #             response_data = new_user.serialize()
// #             return response_data, 201

// #         except IntegrityError as e:
// #             db.session.rollback()
// #             print(f"Database Integrity Error during registration: {e}")
// #             if "UNIQUE constraint failed" in str(e):
// #                 return {"msg": "A user with this email or username already exists."}, 409
// #             return {"msg": "Database error during registration. Please try again."}, 500
// #         except Exception as e:
// #             db.session.rollback()
// #             print(f"Unexpected error during registration: {e}")
// #             return {"msg": "An unexpected server error occurred during registration."}, 500


// # class AuthLogin(Resource):
// #     """Handles user login and JWT token generation."""
// #     def post(self):
// #         data = request.get_json()
// #         email = data.get('email')
// #         password = data.get('password')

// #         if not all([email, password]):
// #             return {"msg": "Email and password are required"}, 400

// #         user = User.get_by_email(email)
// #         if user and user.check_password(password):
// #             access_token = create_access_token(identity=str(user.id))
// #             refresh_token = create_refresh_token(identity=str(user.id))
// #             return {"access_token": access_token, "refresh_token": refresh_token, "role": user.role.name if user.role else "user"}, 200
// #         return {"msg": "Invalid credentials"}, 401


// # class UserProfile(Resource):
// #     """Manages the currently authenticated user's profile."""
// #     @jwt_required()
// #     def get(self):
// #         current_user_id = get_jwt_identity()
// #         try:
// #             user = User.get_by_id(current_user_id)
// #             if not user:
// #                 return {"msg": "User profile not found"}, 404
            
// #             return {
// #                 "id": user.id,
// #                 "username": user.username,
// #                 "email": user.email,
// #                 "first_name": user.first_name,
// #                 "last_name": user.last_name,
// #                 "role": user.role.name if user.role else "user",
// #                 "bio": user.bio,
// #                 "profile_pic": user.profile_pic,
// #                 "github": user.github,
// #                 "linkedin": user.linkedin,
// #                 "skills": user.skills
// #             }, 200
// #         except Exception as e:
// #             db.session.rollback()
// #             print(f"Error fetching user profile for ID {current_user_id}: {e}")
// #             return {"msg": "An unexpected error occurred while fetching user profile."}, 500

// #     @jwt_required()
// #     def patch(self):
// #         current_user_id = get_jwt_identity()
// #         user = User.get_by_id(current_user_id)
// #         if not user:
// #             return {"msg": "User profile not found"}, 404

// #         data = request.get_json()
// #         user.update(
// #             username=data.get('username', user.username),
// #             first_name=data.get('first_name', user.first_name),
// #             last_name=data.get('last_name', user.last_name),
// #             email=data.get('email', user.email),
// #             bio=data.get('bio', user.bio),
// #             profile_pic=data.get('profile_pic', user.profile_pic),
// #             github=data.get('github', user.github),
// #             linkedin=data.get('linkedin', user.linkedin),
// #             skills=data.get('skills', user.skills)
// #         )
// #         return user.serialize(), 200


// # class UserProject(Resource):
// #     """Manages projects uploaded by the current user."""
// #     @jwt_required()
// #     def get(self):
// #         current_user_id = get_jwt_identity()
// #         current_user = User.get_by_id(current_user_id)
// #         if not current_user:
// #             return {"msg": "User not found"}, 404
// #         projects = Project.query.filter_by(uploaded_by=current_user.username).all()
// #         return [project.serialize() for project in projects], 200

// #     @jwt_required()
// #     def delete(self):
// #         current_user_id = get_jwt_identity()
// #         current_user = User.get_by_id(current_user_id)
// #         if not current_user:
// #             return {"msg": "User not found"}, 404
// #         project_id = request.args.get('project_id')
// #         project = Project.get_by_id(project_id)
// #         if not project:
// #             return {"msg": "Project not found"}, 404
// #         if project.uploaded_by != current_user.username:
// #             return {"msg": "You are not authorized to delete this project"}, 403
// #         project.delete()
// #         return {"msg": "Project deleted successfully"}, 204

// #     @jwt_required()
// #     def patch(self):
// #         current_user_id = get_jwt_identity()
// #         current_user = User.get_by_id(current_user_id)
// #         if not current_user:
// #             return {"msg": "User not found"}, 404
// #         project_id = request.args.get('project_id')
// #         project = Project.get_by_id(project_id)
// #         if not project:
// #             return {"msg": "Project not found"}, 404
// #         if project.uploaded_by != current_user.username:
// #             return {"msg": "You are not authorized to update this project"}, 403
// #         data = request.get_json()
// #         project.update(
// #             title=data.get('title', project.title),
// #             category=data.get('category', project.category),
// #             description=data.get('description', project.description),
// #             tech_stack=data.get('tech_stack', project.tech_stack),
// #             github_link=data.get('github_link', project.github_link),
// #             live_preview_url=data.get('live_preview_url', project.live_preview_url),
// #             image_url=data.get('image_url', project.image_url),
// #             isForSale=data.get('isForSale', project.isForSale),
// #             price=data.get('price', project.price),
// #         )
// #         return project.serialize(), 200


// # class ProjectUpload(Resource):
// #     """Handles uploading new projects."""
// #     @jwt_required()
// #     def post(self):
// #         current_user_id = get_jwt_identity()
// #         current_user = User.get_by_id(current_user_id)

// #         if not current_user:
// #             return {"msg": "User not found"}, 404

// #         title = request.form.get('title')
        
// #         # --- MODIFICATION START ---
// #         # Parse collaborators from JSON string
// #         collaborators_str = request.form.get('collaborators')
// #         try:
// #             # Load the JSON string into a Python list of dictionaries
// #             collaborators = json.loads(collaborators_str) if collaborators_str else []
// #             # Ensure collaborators is a list, even if an empty string or single object was sent
// #             if not isinstance(collaborators, list):
// #                 collaborators = [collaborators] # Wrap single object in a list if it somehow gets through
// #         except json.JSONDecodeError:
// #             return {"msg": "Collaborators data is not valid JSON."}, 400
// #         # --- MODIFICATION END ---

// #         category = request.form.get('category', 'web')
// #         description = request.form.get('description')
// #         tech_stack = request.form.get('tech_stack', '')
// #         github_link = request.form.get('github_link')
// #         live_preview_url = request.form.get('live_preview_url', '')
// #         image_url = request.form.get('image_url', '')
// #         isForSale = request.form.get('isForSale', 'false').lower() == 'true'
// #         price = float(request.form.get('price', 0))

// #         file_url = None
// #         if 'file' in request.files:
// #             file = request.files['file']
// #             if file.filename != '':
// #                 if file and allowed_file(file.filename):
// #                     filename = secure_filename(file.filename)
// #                     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
// #                     file.save(file_path)
// #                     file_url = f"/uploads/{filename}"

// #         if not all([title, description, github_link]):
// #             return {"msg": "Missing required fields (title, description, github_link)"}, 400

// #         new_project = Project.create(
// #             title=title,
// #             category=category,
// #             description=description,
// #             tech_stack=tech_stack,
// #             github_link=github_link,
// #             live_preview_url=live_preview_url,
// #             image_url=image_url,
// #             isForSale=isForSale,
// #             collaborators = collaborators, # This will now be a list of dicts
// #             price=price,
// #             uploaded_by=current_user.username,
// #             isApproved=False,
// #             status_changed_by=None,
// #             file=file_url
// #         )

// #         UsersProject.create(
// #             user_id=current_user_id,
// #             project_id=new_project.id,
// #             action='uploading'
// #         )

// #         additional_actions_data = request.form.get('additional_actions_json')
// #         if additional_actions_data:
// #             try:
// #                 actions_list = json.loads(additional_actions_data)
// #                 for action_info in actions_list:
// #                     member_user_id = action_info.get('user_id')
// #                     action_type = action_info.get('action')

// #                     if member_user_id and action_type:
// #                         target_user = User.get_by_id(member_user_id)
// #                         if target_user:
// #                             UsersProject.create(
// #                                 user_id=member_user_id,
// #                                 project_id=new_project.id,
// #                                 action=action_type
// #                             )
// #             except json.JSONDecodeError:
// #                 app.logger.warning("Could not parse additional_actions_json")

// #         return new_project.serialize(), 201


// # class PublicProjects(Resource):
// #     """Provides a catalog of public (approved) projects."""
// #     def get(self):
// #         query = request.args.get('query')
// #         category = request.args.get('category')
// #         tech_stack = request.args.get('tech_stack')
// #         uploaded_by_username = request.args.get('uploaded_by_username')
// #         projects = Project.search_and_filter(
// #             query=query,
// #             category=category,
// #             tech_stack=tech_stack,
// #             uploaded_by=uploaded_by_username,
// #             isApproved=True
// #         )
// #         return [project.serialize() for project in projects], 200


// # class SingleProject(Resource):
// #     """Retrieves details for a single project."""
// #     def get(self, project_id):
// #         project = Project.get_by_id(project_id)
// #         if not project:
// #             return {"msg": "Project not found"}, 404
// #         return project.serialize(), 200


// # class AdminUserManagement(Resource):
// #     """Allows admin to manage user accounts."""
// #     @admin_required()
// #     def get(self):
// #         users = User.query.all()
// #         return [user.serialize() for user in users], 200

// #     @admin_required()
// #     def patch(self, user_id):
// #         user = User.get_by_id(user_id)
// #         if not user:
// #             return {"msg": "User not found"}, 404

// #         data = request.get_json()
// #         # Prevent changing role to admin if not already admin
// #         if 'role_id' in data:
// #             new_role_id = data['role_id']
// #             new_role = Role.get_by_id(new_role_id)
// #             if new_role and new_role.name == 'admin' and user.role.name != 'admin':
// #                 return {"msg": "Cannot directly change role to admin. Only existing admins can assign admin role."}, 403
        
// #         user.update(**data)
// #         return user.serialize(), 200

// #     @admin_required()
// #     def delete(self, user_id):
// #         user = User.get_by_id(user_id)
// #         if not user:
// #             return {"msg": "User not found"}, 404
// #         # Prevent deleting the last admin
// #         if user.role and user.role.name == 'admin':
// #             admin_count = User.query.filter(User.role.has(name='admin')).count()
// #             if admin_count <= 1:
// #                 return {"msg": "Cannot delete the last admin user."}, 403
        
// #         user.delete()
// #         return {"msg": "User deleted successfully"}, 204


// # class AdminProjectManagement(Resource):
// #     """Allows admin to manage all projects (approve/reject)."""
// #     @admin_required()
// #     def get(self):
// #         projects = Project.get_all()
// #         return [project.serialize() for project in projects], 200

// #     @admin_required()
// #     def patch(self, project_id):
// #         project = Project.get_by_id(project_id)
// #         if not project:
// #             return {"msg": "Project not found"}, 404

// #         data = request.get_json()
        
// #         # Capture the admin performing the action
// #         current_user_id = get_jwt_identity()
// #         admin_user = User.get_by_id(current_user_id)
// #         if not admin_user:
// #             return {"msg": "Admin user not found"}, 404
        
// #         data['status_changed_by'] = admin_user.username # Record which admin made the change

// #         project.update(**data)
// #         return project.serialize(), 200

// #     @admin_required()
// #     def delete(self, project_id):
// #         project = Project.get_by_id(project_id)
// #         if not project:
// #             return {"msg": "Project not found"}, 404
// #         project.delete()
// #         return {"msg": "Project deleted successfully"}, 204


// # class AdminMerchandiseManagement(Resource):
// #     """Allows admin to manage merchandise."""
// #     @admin_required()
// #     def get(self):
// #         merchandise_items = Merchandise.get_all()
// #         return [item.serialize() for item in merchandise_items], 200

// #     @admin_required()
// #     def post(self):
// #         data = request.get_json()
// #         name = data.get('name')
// #         description = data.get('description')
// #         price = data.get('price')
// #         image_url = data.get('image_url')
// #         stock_quantity = data.get('stock_quantity', 0)
// #         category = data.get('category')

// #         if not all([name, price is not None, category]):
// #             return {"msg": "Name, price, and category are required"}, 400

// #         allowed_categories = [
// #             'electronics', 'accessories', 'footwear', 'clothing', 'home', 'health', 'defense'
// #         ]
// #         if category.lower() not in allowed_categories:
// #             return {"msg": f"Invalid category. Allowed categories: {', '.join(allowed_categories)}"}, 400

// #         new_merchandise = Merchandise.create(
// #             name=name,
// #             description=description,
// #             price=price,
// #             image_url=image_url,
// #             stock_quantity=stock_quantity,
// #             category=category.lower()
// #         )
// #         return new_merchandise.serialize(), 201

// #     @admin_required()
// #     def patch(self, merchandise_id):
// #         merchandise = Merchandise.get_by_id(merchandise_id)
// #         if not merchandise:
// #             return {"msg": "Merchandise item not found"}, 404

// #         data = request.get_json()
// #         if 'category' in data:
// #             allowed_categories = [
// #                 'electronics', 'accessories', 'footwear', 'clothing', 'home', 'health', 'defense'
// #             ]
// #             if data['category'].lower() not in allowed_categories:
// #                 return {"msg": f"Invalid category. Allowed categories: {', '.join(allowed_categories)}"}, 400
// #             data['category'] = data['category'].lower()

// #         merchandise.update(
// #             name=data.get('name', merchandise.name),
// #             description=data.get('description', merchandise.description),
// #             price=data.get('price', merchandise.price),
// #             image_url=data.get('image_url', merchandise.image_url),
// #             stock_quantity=data.get('stock_quantity', merchandise.stock_quantity),
// #             category=data.get('category', merchandise.category)
// #         )
// #         return merchandise.serialize(), 200

// #     @admin_required()
// #     def delete(self, merchandise_id):
// #         merchandise = Merchandise.get_by_id(merchandise_id)
// #         if not merchandise:
// #             return {"msg": "Merchandise item not found"}, 404
// #         merchandise.delete()
// #         return {"msg": "Merchandise item deleted successfully"}, 204


// # class AdminProjectStats(Resource):
// #     """Provides statistics for admin dashboard."""
// #     @admin_required()
// #     def get(self):
// #         total_projects = Project.query.count()
// #         approved_projects = Project.query.filter_by(isApproved=True).count()
// #         pending_projects = Project.query.filter_by(isApproved=False, review_reason=None).count()
// #         rejected_projects = Project.query.filter(Project.review_reason.isnot(None)).filter_by(isApproved=False).count()

// #         # Assuming Review model exists and has a 'rating' column and a relationship to Project or UsersProject
// #         # For average rating, we need to join Reviews with Projects.
// #         # This is a simplified example; adjust based on your actual Review model structure.
// #         # If Review directly links to Project:
// #         # avg_rating_query = db.session.query(db.func.avg(Review.rating)).scalar()

// #         # For top projects by reviews, you'd need a join and group by.
// #         # This is a placeholder for actual implementation
// #         top_projects_by_reviews = [
// #             # Example data
// #             {"title": "Project Alpha", "review_count": 15},
// #             {"title": "Project Beta", "review_count": 12},
// #             {"title": "Project Gamma", "review_count": 10},
// #         ]
        
// #         return {
// #             "total_projects": total_projects,
// #             "approved_projects": approved_projects,
// #             "pending_projects": pending_projects,
// #             "rejected_projects": rejected_projects,
// #             "average_review_rating": "N/A", # Placeholder until Review logic is refined
// #             "top_projects_by_reviews": top_projects_by_reviews # Placeholder
// #         }, 200


// # class MerchandiseCatalog(Resource):
// #     """Provides a catalog of available merchandise."""
// #     def get(self):
// #         merchandise_items = Merchandise.query.filter(Merchandise.stock_quantity > 0).all()
// #         return [item.serialize() for item in merchandise_items], 200


// # class UserCart(Resource):
// #     """Manages user's shopping cart."""
// #     @jwt_required()
// #     def get(self):
// #         current_user_id = get_jwt_identity()
// #         cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
// #         if not cart:
// #             return {"items": [], "total_amount": 0.0}, 200 # Empty cart

// #         cart_items = [item.serialize() for item in cart.order_items]
// #         return {"items": cart_items, "total_amount": cart.total_amount}, 200

// #     @jwt_required()
// #     def post(self):
// #         current_user_id = get_jwt_identity()
// #         data = request.get_json()
// #         merchandise_id = data.get('merchandise_id')
// #         quantity = data.get('quantity', 1)

// #         if not all([merchandise_id, quantity]):
// #             return {"msg": "Merchandise ID and quantity are required"}, 400

// #         merchandise = Merchandise.get_by_id(merchandise_id)
// #         if not merchandise:
// #             return {"msg": "Merchandise item not found"}, 404

// #         if merchandise.stock_quantity < quantity:
// #             return {"msg": f"Not enough stock for {merchandise.name}. Available: {merchandise.stock_quantity}"}, 400

// #         cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
// #         if not cart:
// #             cart = Order.create(user_id=current_user_id, total_amount=0.0, payment_status='Pending')

// #         existing_item = OrderItem.query.filter_by(order_id=cart.id, merchandise_id=merchandise_id).first()

// #         if existing_item:
// #             if merchandise.stock_quantity < (existing_item.quantity + quantity):
// #                 return {"msg": f"Adding {quantity} more would exceed stock for {merchandise.name}. Available: {merchandise.stock_quantity - existing_item.quantity}"}, 400
// #             existing_item.update(quantity=existing_item.quantity + quantity)
// #         else:
// #             OrderItem.create(
// #                 order_id=cart.id,
// #                 merchandise_id=merchandise_id,
// #                 quantity=quantity,
// #                 price_at_purchase=merchandise.price,
// #                 subtotal=merchandise.price * quantity
// #             )
        
// #         # Recalculate cart total after item addition/update
// #         cart.total_amount = sum(item.subtotal for item in cart.order_items)
// #         db.session.add(cart)
// #         db.session.commit()
// #         return cart.serialize(), 200


// #     @jwt_required()
// #     def patch(self, item_id):
// #         current_user_id = get_jwt_identity()
// #         order_item = OrderItem.get_by_id(item_id)

// #         if not order_item:
// #             return {"msg": "Cart item not found"}, 404

// #         cart = Order.query.get(order_item.order_id)
// #         if not cart or cart.user_id != current_user_id or cart.payment_status != 'Pending':
// #             return {"msg": "Unauthorized or cart is not pending"}, 403
        
// #         data = request.get_json()
// #         new_quantity = data.get('quantity')

// #         if new_quantity is None or not isinstance(new_quantity, int) or new_quantity < 0:
// #             return {"msg": "Quantity must be a non-negative integer"}, 400
        
// #         merchandise = order_item.merchandise
// #         if new_quantity > merchandise.stock_quantity:
// #             return {"msg": f"Cannot update quantity to {new_quantity}. Only {merchandise.stock_quantity} available."}, 400

// #         order_item.update(quantity=new_quantity)
        
// #         # If quantity becomes 0, remove the item
// #         if new_quantity == 0:
// #             order_item.delete()

// #         # Recalculate cart total
// #         cart.total_amount = sum(item.subtotal for item in cart.order_items)
// #         db.session.add(cart)
// #         db.session.commit()

// #         return cart.serialize(), 200

// #     @jwt_required()
// #     def delete(self, item_id):
// #         current_user_id = get_jwt_identity()
// #         order_item = OrderItem.get_by_id(item_id)

// #         if not order_item:
// #             return {"msg": "Cart item not found"}, 404
        
// #         cart = Order.query.get(order_item.order_id)
// #         if not cart or cart.user_id != current_user_id or cart.payment_status != 'Pending':
// #             return {"msg": "Unauthorized or cart is not pending"}, 403

// #         order_item.delete()

// #         # Recalculate cart total
// #         cart.total_amount = sum(item.subtotal for item in cart.order_items)
// #         db.session.add(cart)
// #         db.session.commit()

// #         return {"msg": "Item removed from cart successfully"}, 200


// # class UserOrders(Resource):
// #     """Retrieves user's orders."""
// #     @jwt_required()
// #     def get(self):
// #         current_user_id = get_jwt_identity()
// #         # Fetch orders that are not pending (i.e., completed payments)
// #         orders = Order.query.filter_by(user_id=current_user_id).filter(Order.payment_status != 'Pending').all()
// #         return [order.serialize() for order in orders], 200

// # # --- Register API Resources with the Blueprint ---
// # api.add_resource(AuthRegister, '/auth/register')
// # api.add_resource(AuthLogin, '/auth/login')
// # api.add_resource(UserProfile, '/users/profile')
// # api.add_resource(UserProject, '/users/projects', '/users/projects/<int:project_id>')
// # api.add_resource(ProjectUpload, '/projects/upload')
// # api.add_resource(PublicProjects, '/projects')
// # api.add_resource(SingleProject, '/projects/<int:project_id>')
// # api.add_resource(AdminUserManagement, '/admin/users', '/admin/users/<int:user_id>')
// # api.add_resource(AdminProjectManagement, '/admin/projects', '/admin/projects/<int:project_id>')
// # api.add_resource(AdminMerchandiseManagement, '/admin/merchandise', '/admin/merchandise/<int:merchandise_id>')
// # api.add_resource(AdminProjectStats, '/admin/stats/projects')
// # api.add_resource(MerchandiseCatalog, '/merchandise')
// # api.add_resource(UserCart, '/cart', '/cart/<int:item_id>')
// # api.add_resource(UserOrders, '/orders')


// # # --- Register the API Blueprint with the Flask App ---
// # app.register_blueprint(api_bp)

// # # --- Run the Flask App ---
// # if __name__ == '__main__':
// #     with app.app_context():
// #         db.create_all()

// #         print("Checking/Seeding roles...")
// #         if not Role.get_by_name("admin"):
// #             Role.create(name="admin")
// #             print("Seeded 'admin' role.")
// #         if not Role.get_by_name("student"):
// #             Role.create(name="student")
// #             print("Seeded 'student' role.")
// #         if not Role.get_by_name("user"):
// #             Role.create(name="user")
// #             print("Seeded 'user' role.")
// #         print("Role seeding complete.")

// #     app.run(debug=True, port=5555)


// ##########################################################################################
//     # THIS SECOND CODE IS WORKING HOW I WANT IT TO WORK

// ###########################################################################################
// ###########################################################################################
