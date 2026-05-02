import os
import requests
from bs4 import BeautifulSoup
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.config import DATA_PATH
from ingest import process_documents

def scrape_to_file(url: str, output_filename: str):
    print(f"Scraping {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        text = soup.get_text(separator="\n", strip=True)
        
        os.makedirs(DATA_PATH, exist_ok=True)
        file_path = os.path.join(DATA_PATH, output_filename)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(text)
            
        print(f"Scraped content saved to {file_path}")
        print("Triggering ingestion process...")
        process_documents()
    else:
        print(f"Failed to scrape {url}. Status code: {response.status_code}")

if __name__ == "__main__":
    # Example URL for demonstration
    scrape_to_file("https://en.wikipedia.org/wiki/Reserve_Bank_of_India", "rbi_wiki.txt")
