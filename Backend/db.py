import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.path.join(BASE_DIR, "data.db")
SQL_SCRIPT_FILE = os.path.join(BASE_DIR, "data.sql")

def get_db_connection():
    """Establishes and returns a database connection."""
    conn = sqlite3.connect(DATABASE_URL, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    # Enable foreign keys
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def execute_sql_file():
    """Executes the SQL script to set up the database."""
    if not os.path.exists(SQL_SCRIPT_FILE):
        print(f"Error: SQL script file '{SQL_SCRIPT_FILE}' not found.")
        return
    try:
        with open(SQL_SCRIPT_FILE, 'r') as f:
            sql_script = f.read()
        conn = sqlite3.connect(DATABASE_URL)
        conn.executescript(sql_script)
        conn.commit()
        conn.close()
        print("Database created and mock data inserted successfully.")
    except Exception as e:
        print(f"Error during database initialization: {e}")

def ensure_db():
    """Ensures the database exists and is valid. Recreates if missing or corrupt."""
    recreate = False

    if not os.path.exists(DATABASE_URL):
        print("Database not found. It will be created.")
        recreate = True
    else:
        # Test if DB is valid
        try:
            conn = get_db_connection()
            conn.execute("SELECT 1 FROM sqlite_master LIMIT 1;")
            conn.close()
        except sqlite3.DatabaseError:
            print("Database corrupt or invalid. Recreating...")
            recreate = True

    if recreate:
        execute_sql_file()

# Ensure DB exists at startup
ensure_db()
