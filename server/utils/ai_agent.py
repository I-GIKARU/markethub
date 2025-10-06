import os
import uuid
import json
from datetime import datetime
from flask import current_app
from PyPDF2 import PdfReader
import google.generativeai as genai
from io import BytesIO
from .digitalocean_storage import init_digitalocean_client

class AIAgent:
    def __init__(self):
        # Configure Google Generative AI
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if self.google_api_key:
            genai.configure(api_key=self.google_api_key)
        else:
            print("⚠️ GOOGLE_API_KEY not found. AI functionality will not be available.")
        
        # DigitalOcean Spaces client (initialize lazily)
        self.storage_client = None
        
        # In-memory text store for quick access
        self.pdf_text_store = {}

    def extract_text_from_pdf(self, file_stream):
        """Extract text from PDF file stream"""
        try:
            reader = PdfReader(file_stream)
            text = "\n".join([page.extract_text() or "" for page in reader.pages])
            return text
        except Exception as e:
            print(f"PDF parse error: {e}")
            return None

    def generate_cv_summary(self, text: str) -> str:
        """Generate AI summary for CV content"""
        if not text.strip():
            return "The CV file appears to be empty or unreadable."
        
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            prompt = f"""
            Analyze this CV/Resume and provide a comprehensive professional summary including:
            
            1. **Professional Profile**: Key skills, experience level, and areas of expertise
            2. **Technical Skills**: Programming languages, frameworks, tools, and technologies
            3. **Experience Summary**: Years of experience and key roles/positions
            4. **Education**: Degrees, certifications, and academic achievements
            5. **Key Strengths**: Standout qualities and unique selling points
            6. **Career Focus**: Primary areas of interest and career direction
            
            Make the summary professional, concise, and suitable for admin review.
            
            CV Content:
            {text[:8000]}
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini CV summary error: {e}")
            return "CV summary could not be generated due to AI service error."

    def generate_project_summary(self, project_data: dict, documentation_text: str = None) -> str:
        """Generate AI summary for project"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Combine project data and documentation
            project_info = f"""
            Project Title: {project_data.get('title', 'N/A')}
            Description: {project_data.get('description', 'N/A')}
            Tech Stack: {project_data.get('tech_stack', 'N/A')}
            Technical Mentor: {project_data.get('technical_mentor', 'N/A')}
            """
            
            if documentation_text:
                project_info += f"\n\nDocumentation Content:\n{documentation_text[:6000]}"
            
            prompt = f"""
            Create a comprehensive project summary for this Innovation Marketplace project including:
            
            1. **Project Overview**: What the project does and its main purpose
            2. **Technical Implementation**: Key technologies, frameworks, and architecture
            3. **Features & Functionality**: Main features and capabilities
            4. **Innovation Factor**: What makes this project unique or innovative
            5. **Learning Outcomes**: Skills and knowledge demonstrated
            6. **Potential Applications**: Real-world use cases and market potential
            
                    "Make the summary engaging for potential viewers and users."
            
            Project Information:
            {project_info}
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini project summary error: {e}")
            return "Project summary could not be generated due to AI service error."

    def answer_project_question(self, question: str, project_data: dict, documentation_text: str = None) -> str:
        """Answer questions about a specific project"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Combine project data and documentation
            context = f"""
            Project: {project_data.get('title', 'N/A')}
            Description: {project_data.get('description', 'N/A')}
            Tech Stack: {project_data.get('tech_stack', 'N/A')}
            GitHub: {project_data.get('github_link', 'N/A')}
            Demo: {project_data.get('demo_link', 'N/A')}
            """
            
            if documentation_text:
                context += f"\n\nDocumentation:\n{documentation_text[:6000]}"
            
            prompt = f"""
            You are an AI assistant helping users understand this Innovation Marketplace project. 
            Answer the following question based on the project information and documentation provided.
            
            Be helpful, accurate, and engaging. If the information isn't available in the context, 
            say so politely and suggest checking the project's GitHub repository or contacting the developers.
            
            Project Context:
            {context}
            
            Question: {question}
            
            Answer:
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini question answering error: {e}")
            return "I'm sorry, I couldn't process your question due to an AI service error. Please try again later."

    def _get_storage_client(self):
        """Lazy initialization of DigitalOcean client"""
        if not self.storage_client:
            try:
                self.storage_client = init_digitalocean_client()
            except Exception as e:
                print(f"Failed to initialize DigitalOcean client: {e}")
                return None
        return self.storage_client

    # All file storage now handled by DigitalOcean Spaces
    # Firebase methods removed - CVs use DigitalOcean integration
    
    def get_project_pdf_texts(self, project):
        """Extract text from all PDFs in a regular project's media"""
        if not project:
            print("❌ No project provided")
            return []
            
        if not project.pdf_urls:
            print(f"📄 No PDFs found for project '{project.title}' (pdf_urls is empty)")
            return []
        
        try:
            import json
            pdf_urls = json.loads(project.pdf_urls)
            if not pdf_urls:
                print(f"📄 Project '{project.title}' has empty PDF URLs list")
                return []
            print(f"📄 Found {len(pdf_urls)} PDF URLs in project '{project.title}' media")
        except (json.JSONDecodeError, TypeError) as e:
            print(f"❌ Failed to parse project PDF URLs for '{project.title}': {e}")
            return []
        
        # PDFs are now stored in DigitalOcean Spaces - text extraction not implemented
        print("📄 PDF text extraction from DigitalOcean Spaces not yet implemented")
        return []
        
        pdf_texts = []
        
        # PDF text extraction from DigitalOcean Spaces not yet implemented
        print("📄 PDF text extraction from DigitalOcean Spaces not yet implemented")
        return []
    
    def _extract_storage_path_from_url(self, url):
        """Extract DigitalOcean Spaces storage path from download URL"""
        try:
            # Handle DigitalOcean Spaces URLs
            if 'digitaloceanspaces.com' in url:
                # Extract path after domain
                path_part = url.split('.com/')[1] if '.com/' in url else url
                return path_part
            
            return None
            
        except Exception as e:
            print(f"Error extracting storage path from URL: {e}")
            return None

    def delete_document(self, file_id: str, file_type="general"):
        """Delete document - now handled by DigitalOcean Spaces"""
        cache_key = f"{file_type}_{file_id}"
        self.pdf_text_store.pop(cache_key, None)
        print(f"Document deletion for {file_type} {file_id} - handled by DigitalOcean")

ai_agent = AIAgent()
