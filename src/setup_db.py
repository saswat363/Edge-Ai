import sqlite3

DB_PATH = "bank_data.db"

def setup_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS accounts (
            account_id TEXT PRIMARY KEY,
            customer_name TEXT,
            balance REAL,
            account_type TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            tx_id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id TEXT,
            amount REAL,
            tx_type TEXT,
            tx_date TEXT,
            FOREIGN KEY(account_id) REFERENCES accounts(account_id)
        )
    ''')
    
    # Insert dummy data if empty
    cursor.execute("SELECT COUNT(*) FROM accounts")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO accounts (account_id, customer_name, balance, account_type) VALUES ('A123', 'John Doe', 5000.0, 'Savings')")
        cursor.execute("INSERT INTO accounts (account_id, customer_name, balance, account_type) VALUES ('B456', 'Jane Smith', 12500.5, 'Checking')")
        
        cursor.execute("INSERT INTO transactions (account_id, amount, tx_type, tx_date) VALUES ('A123', 500.0, 'Deposit', '2023-10-01')")
        cursor.execute("INSERT INTO transactions (account_id, amount, tx_type, tx_date) VALUES ('A123', -20.0, 'Withdrawal', '2023-10-05')")
        
        conn.commit()
        print("Database initialized and seeded.")
    else:
        print("Database already initialized.")
    
    conn.close()

if __name__ == "__main__":
    setup_db()
