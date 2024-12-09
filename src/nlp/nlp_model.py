import sys
import spacy
import re
from dateutil import parser as date_parser
import json
from docx import Document  # For handling DOCX files
from PyPDF2 import PdfReader  # For handling PDF files
import os
from datetime import datetime
import openai

# Load SpaCy NLP model
nlp = spacy.load('en_core_web_sm')

# Set DEBUG to True for development, False for production
DEBUG = True

def log_debug(message):
    if DEBUG:
        print(message, file=sys.stderr)

# Function to extract text from DOCX
def extract_text_from_docx(file_path):
    doc = Document(file_path)
    full_text = []
    for paragraph in doc.paragraphs:
        full_text.append(paragraph.text)
    return '\n'.join(full_text)

# Function to extract text from PDF
def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    full_text = []
    for page in reader.pages:
        full_text.append(page.extract_text())
    return '\n'.join(full_text)

# Main function to read and extract text based on file type
def extract_text(file_path):
    _, file_extension = os.path.splitext(file_path)
    
    if file_extension.lower() == '.docx':
        return extract_text_from_docx(file_path)
    elif file_extension.lower() == '.pdf':
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_extension}")

# Set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_structured_resume(resume_text):
    prompt = f"""
    Extract the following information from the resume text and return it in valid JSON format:
    1. name (string)
    2. email (string)
    3. experience (Array of Objects with exact field names as follows: jobTitle, company, startDate, endDate, description)
    4. education (Array of Objects with exact field names as follows: degree, institution, startDate, endDate)
    5. achievements (Array of Strings)
    6. awards (Array of Strings)
    7. extracurriculars (Array of Strings)
    8. skills (Array of Strings)

    Ensure the JSON is valid and correctly formatted. Makes sure dates such as startDate and endDate are valid json dates. Conver strings to dates the best you can. If the date says "current" or something similar the endDate can be left null.

    Resume Text:
    {resume_text}
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a resume parser."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1500
    )

    # Extracting the text content from the OpenAI response
    try:
        response_text = response.choices[0].message['content']

        # Remove any Markdown formatting (like ```json) from the response
        cleaned_response = response_text.replace('```json', '').replace('```', '').strip()

        # Attempt to parse the cleaned JSON-like response
        parsed_response = json.loads(cleaned_response)

        return parsed_response

    except json.JSONDecodeError as e:
        log_debug(f"Failed to parse response: {response_text}")
        raise ValueError("Failed to parse AI response")

if __name__ == "__main__":
    try:
        # Read input from the command line
        file_path = sys.argv[1]

        # Extract text based on file type (PDF or DOCX)
        resume_text = extract_text(file_path)

        parsed_resume = generate_structured_resume(resume_text)
        print(json.dumps(parsed_resume, indent=4))

    except Exception as e:
        print(f"Error during file reading or parsing: {e}")
        print(json.dumps({"error": str(e)}))
