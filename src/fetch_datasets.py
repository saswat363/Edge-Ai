import os
import requests
from bs4 import BeautifulSoup
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.config import DATA_PATH
from ingest import process_documents

WIKIPEDIA_URLS = {
    "RBI_Overview.txt": "https://en.wikipedia.org/wiki/Reserve_Bank_of_India",
    "KYC_Guidelines.txt": "https://en.wikipedia.org/wiki/Know_your_customer",
    "AML_Rules.txt": "https://en.wikipedia.org/wiki/Money_laundering",
    "Credit_Card_Concepts.txt": "https://en.wikipedia.org/wiki/Credit_card"
}

EDGE_AI_BANK_POLICIES = {
    "Edge_AI_Bank_Credit_Card_Terms.md": """# Edge AI Bank - Credit Card Terms & Conditions

## 1. Annual Fees and Charges
- **Titanium Card:** $0 Annual Fee for the first year. $99 subsequently unless annual spend exceeds $10,000.
- **Obsidian Reserve Card:** $450 Annual Fee. Includes complimentary lounge access.
- **Late Payment Fee:** A strict penalty of $40 will be applied if the minimum due is not paid by the due date.

## 2. Interest Rates (APR)
- **Purchases:** 19.99% Variable APR based on the Prime Rate.
- **Cash Advances:** 25.99% Variable APR. A 5% transaction fee applies to all cash advances.
- **Penalty APR:** Up to 29.99% may be applied if you make a late payment.

## 3. Rewards Program
- Earn 3x points on dining and travel.
- Earn 1x points on all other purchases.
- Points do not expire as long as the account remains open and in good standing.

## 4. Dispute Resolution
- Cardholders have 60 days from the statement date to dispute any fraudulent charges.
- Edge AI Bank holds zero liability for fraudulent transactions reported within 24 hours.
""",

    "Edge_AI_Bank_Loan_Policies.md": """# Edge AI Bank - Master Loan Policies

## 1. Personal Loans
- **Eligibility:** Must have a credit score of 680+ and verifiable income of at least $40,000 per year.
- **Interest Rates:** Fixed rates ranging from 6.99% to 18.99% based on creditworthiness.
- **Repayment Terms:** 12 to 60 months.

## 2. Home Mortgages
- **Down Payment:** Minimum 5% required for first-time homebuyers. 20% required to avoid Private Mortgage Insurance (PMI).
- **Escrow:** Edge AI Bank requires an escrow account for property taxes and insurance if the loan-to-value (LTV) ratio exceeds 80%.

## 3. Auto Loans
- **Vehicle Age:** The vehicle must be less than 7 years old and have under 100,000 miles to qualify for standard rates.
- **Repossession Clause:** Edge AI Bank reserves the right to initiate repossession if an account is more than 90 days past due without a formal forbearance agreement.
"""
}

def fetch_wikipedia_content(url, filename):
    print(f"Fetching {filename} from Wikipedia...")
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Extract main content
        content_div = soup.find(id="mw-content-text")
        if content_div:
            paragraphs = content_div.find_all('p')
            text = "\n\n".join([p.get_text() for p in paragraphs if p.get_text().strip()])
            
            filepath = os.path.join(DATA_PATH, filename)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"  -> Saved {filename} ({len(text)} characters)")
        else:
            print(f"  -> Could not find content for {url}")
    except Exception as e:
        print(f"  -> Error fetching {url}: {e}")

def generate_internal_policies():
    print("\nGenerating Edge AI Bank Proprietary Policies...")
    for filename, content in EDGE_AI_BANK_POLICIES.items():
        filepath = os.path.join(DATA_PATH, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  -> Created {filename}")

if __name__ == "__main__":
    os.makedirs(DATA_PATH, exist_ok=True)
    
    print("=== STARTING DATASET COLLECTION ===\n")
    
    for filename, url in WIKIPEDIA_URLS.items():
        fetch_wikipedia_content(url, filename)
        
    generate_internal_policies()
    
    print("\n=== DATASET COLLECTION COMPLETE ===")
    print("Triggering Ingestion Pipeline...\n")
    
    process_documents()
    
    print("\n=== INGESTION COMPLETE ===")
