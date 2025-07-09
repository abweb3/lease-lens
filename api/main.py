import os
import time
import fitz # PyMuPDF
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google.api_core import exceptions as google_exceptions

# Load environment variables from .env file
load_dotenv()

# Configure the FastAPI app
app = FastAPI()

# Configure CORS to allow requests from the Next.js frontend
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the Google AI client
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    # Use gemini-2.5-pro - Google's most advanced AI model available for free in 2025
    model = genai.GenerativeModel('gemini-2.5-pro')
except Exception as e:
    # This will help debug if the API key is not set
    print(f"Error configuring Google AI: {e}")
    model = None

# This is the master prompt that defines the AI's behavior
MASTER_PROMPT = """
You are "The Lease Lens," an expert AI assistant specializing in analyzing residential lease agreements for tenants. Your goal is to help a regular person understand their lease, identify potential risks, and feel empowered before they sign. Your tone should be clear, helpful, and cautionary, but not alarmist.

Using your advanced reasoning capabilities, thoroughly analyze the following lease agreement text. Generate a comprehensive report in Markdown format with the following exact structure:

# Lease Lens Report

## 📜 Plain English Summary
Provide a clear, concise summary of the most critical terms:
- **Monthly Rent:**
- **Lease Term (Start/End Dates):**
- **Security Deposit:**
- **Notable Fees:** (pet fees, application fees, etc.)
- **Key Restrictions:** (pets, guests, modifications, etc.)

## 🚩 Red Flag Analysis
This is the most important section. Use your advanced reasoning to scrutinize the lease for clauses that are often unfavorable or costly for tenants. For each red flag you identify, provide:
- A clear title describing the issue
- A simple explanation of the risk to the tenant
- A direct quote from the lease (if available)
- The potential financial or legal impact

Key areas to examine:
- **Automatic Renewal (Evergreen Clause):** Does the lease renew automatically without notice?
- **Early Termination Penalties:** What is the exact financial penalty for breaking the lease?
- **Vague Maintenance Responsibilities:** Does the lease assign unclear duties like "minor repairs" or "general upkeep" to the tenant?
- **Unrestricted Landlord Access:** Can the landlord enter with little or no notice?
- **Subletting Restrictions:** Are there strict rules or complete prohibitions on subletting?
- **Rent Increases:** Are there provisions for mid-lease rent increases?
- **Security Deposit Issues:** Are there vague deduction clauses or non-refundable fees?
- **Utility Responsibilities:** Are utility payment responsibilities clearly defined?
- **Parking and Storage:** Are there additional costs or restrictions?

## ⚖️ Legal Considerations
Identify any clauses that may be legally questionable or potentially unenforceable in typical jurisdictions. Note: This is not legal advice, but highlights areas where tenant rights may be affected.

## ❓ Questions to Ask Your Landlord
Based on your detailed analysis, generate 5-7 specific, intelligent questions the tenant should ask the landlord before signing. These questions should be designed to:
- Clarify ambiguities and vague terms
- Negotiate better terms where possible
- Establish clear expectations
- Protect tenant rights

## 💡 Negotiation Tips
Provide 3-5 practical tips for negotiating with the landlord based on the specific lease terms you've identified.
"""

@app.post("/analyze")
async def analyze_lease(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="AI model not configured. Check API key.")
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        # Read PDF content
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        lease_text = ""
        for page in doc:
            lease_text += page.get_text()
        doc.close()

        if not lease_text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")

        # Send to AI for analysis with retry logic
        full_prompt = MASTER_PROMPT + "\n\nHere is the lease text:\n\n" + lease_text
        
        # Retry logic for rate limiting
        max_retries = 3
        retry_delay = 1
        
        for attempt in range(max_retries):
            try:
                response = model.generate_content(full_prompt)
                return {"analysis": response.text}
            except google_exceptions.ResourceExhausted as e:
                if attempt < max_retries - 1:
                    # Extract retry delay from error message if available
                    error_str = str(e)
                    if "retry_delay" in error_str and "seconds" in error_str:
                        try:
                            # Try to extract the retry delay from the error message
                            import re
                            delay_match = re.search(r'retry_delay.*?seconds:\s*(\d+)', error_str)
                            if delay_match:
                                retry_delay = min(int(delay_match.group(1)), 60)  # Cap at 60 seconds
                        except:
                            pass
                    
                    print(f"Rate limit hit, retrying in {retry_delay} seconds... (attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                else:
                    raise HTTPException(
                        status_code=429, 
                        detail="Rate limit exceeded. Please try again in a few minutes. Consider upgrading to a paid Google AI plan for higher limits."
                    )
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"API error, retrying... (attempt {attempt + 1}/{max_retries}): {str(e)}")
                    time.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during analysis: {str(e)}")