import sqlite3
import os

# Use absolute paths so Render knows where to create files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.path.join(BASE_DIR, "data.db")
SQL_SCRIPT_FILE = os.path.join(BASE_DIR, "data.sql")

def get_db_connection():
    """Establishes and returns a database connection."""
    # check_same_thread=False allows FastAPI multiple requests safely
    conn = sqlite3.connect(DATABASE_URL, check_same_thread=False)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

def execute_sql_file():
    """Executes the SQL script to set up the database if not exists."""
    if not os.path.exists(SQL_SCRIPT_FILE):
        print(f"Error: SQL script file '{SQL_SCRIPT_FILE}' not found.")
        return

    conn = get_db_connection()
    try:
        with open(SQL_SCRIPT_FILE, 'r') as f:
            sql_script = f.read()
        conn.executescript(sql_script)
        conn.commit()
        print("Database created and mock data inserted successfully.")
    except Exception as e:
        print(f"Error during database initialization: {e}")
    finally:
        conn.close()

# Automatically create the database if it doesn't exist
if not os.path.exists(DATABASE_URL):
    execute_sql_file()
