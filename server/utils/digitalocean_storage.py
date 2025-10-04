import os
import uuid
import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from werkzeug.utils import secure_filename
from flask import current_app
import logging
from PIL import Image
import io

logger = logging.getLogger(__name__)

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tiff'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'}
ALLOWED_DOCUMENT_EXTENSIONS = {'pdf', 'zip', 'rar', '7z', 'tar', 'gz', 'doc', 'docx', 'txt'}
ALL_ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS | ALLOWED_DOCUMENT_EXTENSIONS

# Maximum file sizes (in bytes)
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024  # 50MB

def init_digitalocean_client():
    """Initialize DigitalOcean Spaces client"""
    try:
        session = boto3.session.Session()
        client = session.client(
            's3',
            region_name=current_app.config['DO_SPACES_REGION'],
            endpoint_url=f"https://{current_app.config['DO_SPACES_REGION']}.digitaloceanspaces.com",
            aws_access_key_id=current_app.config['DO_SPACES_KEY'],
            aws_secret_access_key=current_app.config['DO_SPACES_SECRET']
        )
        return client
    except Exception as e:
        logger.error(f"Failed to initialize DigitalOcean client: {str(e)}")
        return None

def allowed_file(filename, file_type='all'):
    """Check if file has allowed extension"""
    if not filename or '.' not in filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if file_type == 'image':
        return extension in ALLOWED_IMAGE_EXTENSIONS
    elif file_type == 'video':
        return extension in ALLOWED_VIDEO_EXTENSIONS
    elif file_type == 'document':
        return extension in ALLOWED_DOCUMENT_EXTENSIONS
    else:
        return extension in ALL_ALLOWED_EXTENSIONS

def validate_file_size(file, file_type='all'):
    """Validate file size based on type"""
    file.seek(0, 2)  # Move to end of file
    size = file.tell()
    file.seek(0)  # Reset file pointer
    
    if file_type == 'image':
        return size <= MAX_IMAGE_SIZE
    elif file_type == 'video':
        return size <= MAX_VIDEO_SIZE
    elif file_type == 'document':
        return size <= MAX_DOCUMENT_SIZE
    else:
        return size <= MAX_DOCUMENT_SIZE

def get_file_type(filename):
    """Determine file type based on extension"""
    if not filename or '.' not in filename:
        return None
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if extension in ALLOWED_IMAGE_EXTENSIONS:
        return 'image'
    elif extension in ALLOWED_VIDEO_EXTENSIONS:
        return 'video'
    elif extension in ALLOWED_DOCUMENT_EXTENSIONS:
        return 'document'
    else:
        return None

def optimize_image(file, max_width=1920, max_height=1080, quality=85):
    """Optimize image for web delivery"""
    try:
        # Open image
        image = Image.open(file)
        
        # Convert RGBA to RGB if necessary
        if image.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        
        # Resize if too large
        if image.width > max_width or image.height > max_height:
            image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # Save optimized image to bytes
        output = io.BytesIO()
        format = 'JPEG' if file.filename.lower().endswith(('.jpg', '.jpeg')) else 'PNG'
        image.save(output, format=format, quality=quality, optimize=True)
        output.seek(0)
        
        return output, format.lower()
    except Exception as e:
        logger.error(f"Error optimizing image: {str(e)}")
        file.seek(0)
        return file, None

def upload_file_to_digitalocean(file, folder_path, filename_prefix='', optimize_images=True):
    """
    Upload file to DigitalOcean Spaces
    
    Args:
        file: File object from request
        folder_path: Path in Spaces (e.g., 'projects/my-project')
        filename_prefix: Optional prefix for filename
        optimize_images: Whether to optimize images before upload
    
    Returns:
        tuple: (success: bool, result: str|dict)
    """
    try:
        client = init_digitalocean_client()
        if not client:
            return False, "Failed to initialize DigitalOcean client"
        
        # Validate file
        if not file or not file.filename:
            return False, "No file provided"
        
        # Check file extension
        if not allowed_file(file.filename):
            return False, f"File type not allowed. Allowed types: {', '.join(ALL_ALLOWED_EXTENSIONS)}"
        
        # Determine file type and validate size
        file_type = get_file_type(file.filename)
        if not validate_file_size(file, file_type):
            max_sizes = {
                'image': MAX_IMAGE_SIZE // (1024 * 1024),
                'video': MAX_VIDEO_SIZE // (1024 * 1024),
                'document': MAX_DOCUMENT_SIZE // (1024 * 1024)
            }
            max_size_mb = max_sizes.get(file_type, MAX_DOCUMENT_SIZE // (1024 * 1024))
            return False, f"File too large. Maximum size for {file_type}s: {max_size_mb}MB"
        
        # Create unique filename
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_id = str(uuid.uuid4())
        
        if filename_prefix:
            new_filename = f"{filename_prefix}_{unique_id}.{file_extension}"
        else:
            new_filename = f"{unique_id}.{file_extension}"
        
        # Create storage path
        storage_path = f"{folder_path}/{new_filename}"
        
        # Optimize images if enabled
        file_to_upload = file
        content_type = get_content_type(file_extension)
        
        if file_type == 'image' and optimize_images:
            optimized_file, optimized_format = optimize_image(file)
            if optimized_format:
                file_to_upload = optimized_file
                if optimized_format == 'jpeg':
                    content_type = 'image/jpeg'
                elif optimized_format == 'png':
                    content_type = 'image/png'
        
        # Upload to DigitalOcean Spaces
        bucket_name = current_app.config['DO_SPACES_BUCKET']
        
        extra_args = {
            'ContentType': content_type,
            'ACL': 'public-read',
            'CacheControl': 'max-age=31536000'  # 1 year cache
        }
        
        # Add metadata
        if file_type == 'image':
            extra_args['Metadata'] = {
                'original-filename': original_filename,
                'file-type': file_type,
                'optimized': 'true' if optimize_images else 'false'
            }
        
        client.upload_fileobj(
            file_to_upload,
            bucket_name,
            storage_path,
            ExtraArgs=extra_args
        )
        
        # Generate public URL
        cdn_endpoint = current_app.config.get('DO_SPACES_CDN_ENDPOINT')
        if cdn_endpoint:
            public_url = f"https://{cdn_endpoint}/{storage_path}"
        else:
            public_url = f"https://{bucket_name}.{current_app.config['DO_SPACES_REGION']}.digitaloceanspaces.com/{storage_path}"
        
        logger.info(f"File uploaded successfully: {storage_path}")
        
        return True, {
            'url': public_url,
            'path': storage_path,
            'filename': new_filename,
            'original_filename': original_filename,
            'file_type': file_type,
            'size': file.content_length or 0,
            'bucket': bucket_name
        }
        
    except ClientError as e:
        logger.error(f"AWS ClientError uploading file: {str(e)}")
        return False, f"Upload failed: {str(e)}"
    except NoCredentialsError:
        logger.error("DigitalOcean credentials not found")
        return False, "Upload failed: Invalid credentials"
    except Exception as e:
        logger.error(f"Error uploading file to DigitalOcean: {str(e)}")
        return False, f"Upload failed: {str(e)}"

def delete_file_from_digitalocean(storage_path):
    """
    Delete file from DigitalOcean Spaces
    
    Args:
        storage_path: Path to file in Spaces
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        client = init_digitalocean_client()
        if not client:
            return False, "Failed to initialize DigitalOcean client"
        
        bucket_name = current_app.config['DO_SPACES_BUCKET']
        
        # Check if file exists
        try:
            client.head_object(Bucket=bucket_name, Key=storage_path)
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False, "File not found"
            else:
                raise e
        
        # Delete the file
        client.delete_object(Bucket=bucket_name, Key=storage_path)
        
        logger.info(f"File deleted successfully: {storage_path}")
        return True, "File deleted successfully"
        
    except ClientError as e:
        logger.error(f"AWS ClientError deleting file: {str(e)}")
        return False, f"Delete failed: {str(e)}"
    except Exception as e:
        logger.error(f"Error deleting file from DigitalOcean: {str(e)}")
        return False, f"Delete failed: {str(e)}"

def delete_folder_from_digitalocean(folder_path):
    """
    Delete all files in a folder from DigitalOcean Spaces
    
    Args:
        folder_path: Path to folder in Spaces (e.g., 'projects/my-project')
    
    Returns:
        tuple: (success: bool, message: str, deleted_count: int)
    """
    try:
        client = init_digitalocean_client()
        if not client:
            return False, "Failed to initialize DigitalOcean client", 0
        
        bucket_name = current_app.config['DO_SPACES_BUCKET']
        
        # List all objects in the folder
        response = client.list_objects_v2(
            Bucket=bucket_name,
            Prefix=folder_path + '/'
        )
        
        if 'Contents' not in response:
            return True, "No files found in folder", 0
        
        # Delete objects in batches
        objects_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]
        
        deleted_count = 0
        failed_deletions = []
        
        # Delete in batches of 1000 (AWS limit)
        for i in range(0, len(objects_to_delete), 1000):
            batch = objects_to_delete[i:i+1000]
            
            try:
                delete_response = client.delete_objects(
                    Bucket=bucket_name,
                    Delete={'Objects': batch}
                )
                
                deleted_count += len(delete_response.get('Deleted', []))
                
                # Track failed deletions
                for error in delete_response.get('Errors', []):
                    failed_deletions.append(error['Key'])
                    
            except ClientError as e:
                logger.error(f"Error deleting batch: {str(e)}")
                failed_deletions.extend([obj['Key'] for obj in batch])
        
        if failed_deletions:
            return False, f"Failed to delete {len(failed_deletions)} files", deleted_count
        
        if deleted_count > 0:
            logger.info(f"Successfully deleted {deleted_count} files from folder: {folder_path}")
            return True, f"Successfully deleted {deleted_count} files", deleted_count
        else:
            return True, "No files found in folder", 0
        
    except ClientError as e:
        logger.error(f"AWS ClientError deleting folder: {str(e)}")
        return False, f"Folder delete failed: {str(e)}", 0
    except Exception as e:
        logger.error(f"Error deleting folder from DigitalOcean: {str(e)}")
        return False, f"Folder delete failed: {str(e)}", 0

def sanitize_folder_name(name):
    """
    Sanitize project name for use as folder name
    
    Args:
        name: Project name string
    
    Returns:
        str: Sanitized folder name
    """
    import re
    # Remove special characters and replace spaces with hyphens
    sanitized = re.sub(r'[^a-zA-Z0-9\s\-_]', '', name)
    sanitized = re.sub(r'\s+', '-', sanitized)  # Replace spaces with hyphens
    sanitized = sanitized.lower().strip('-')  # Convert to lowercase and remove leading/trailing hyphens
    
    # Ensure the name isn't empty and isn't too long
    if not sanitized:
        sanitized = 'unnamed-project'
    elif len(sanitized) > 50:
        sanitized = sanitized[:50].rstrip('-')
    
    return sanitized

def get_content_type(file_extension):
    """Get content type based on file extension"""
    content_types = {
        # Images
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'bmp': 'image/bmp',
        'tiff': 'image/tiff',
        # Videos
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'wmv': 'video/x-ms-wmv',
        'flv': 'video/x-flv',
        'webm': 'video/webm',
        'mkv': 'video/x-matroska',
        'm4v': 'video/x-m4v',
        # Documents
        'pdf': 'application/pdf',
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        '7z': 'application/x-7z-compressed',
        'tar': 'application/x-tar',
        'gz': 'application/gzip',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'txt': 'text/plain'
    }
    
    return content_types.get(file_extension.lower(), 'application/octet-stream')

def upload_multiple_files(files, folder_path, filename_prefix=''):
    """
    Upload multiple files to DigitalOcean Spaces
    
    Args:
        files: List of file objects
        folder_path: Path in Spaces
        filename_prefix: Optional prefix for filenames
    
    Returns:
        tuple: (success_count: int, results: list, errors: list)
    """
    results = []
    errors = []
    success_count = 0
    
    for file in files:
        success, result = upload_file_to_digitalocean(file, folder_path, filename_prefix)
        
        if success:
            results.append(result)
            success_count += 1
        else:
            errors.append({
                'filename': file.filename if file else 'unknown',
                'error': result
            })
    
    return success_count, results, errors

def get_file_info(storage_path):
    """
    Get file information from DigitalOcean Spaces
    
    Args:
        storage_path: Path to file in Spaces
    
    Returns:
        tuple: (success: bool, result: dict|str)
    """
    try:
        client = init_digitalocean_client()
        if not client:
            return False, "Failed to initialize DigitalOcean client"
        
        bucket_name = current_app.config['DO_SPACES_BUCKET']
        
        # Get object metadata
        response = client.head_object(Bucket=bucket_name, Key=storage_path)
        
        # Generate public URL
        cdn_endpoint = current_app.config.get('DO_SPACES_CDN_ENDPOINT')
        if cdn_endpoint:
            public_url = f"https://{cdn_endpoint}/{storage_path}"
        else:
            public_url = f"https://{bucket_name}.{current_app.config['DO_SPACES_REGION']}.digitaloceanspaces.com/{storage_path}"
        
        return True, {
            'url': public_url,
            'path': storage_path,
            'size': response['ContentLength'],
            'content_type': response['ContentType'],
            'last_modified': response['LastModified'],
            'metadata': response.get('Metadata', {})
        }
        
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            return False, "File not found"
        logger.error(f"AWS ClientError getting file info: {str(e)}")
        return False, f"Failed to get file info: {str(e)}"
    except Exception as e:
        logger.error(f"Error getting file info: {str(e)}")
        return False, f"Failed to get file info: {str(e)}"
