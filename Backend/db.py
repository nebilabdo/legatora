import sqlite3
import os

# Configuration for the SQLite Database
DATABASE_URL = "data.db"
SQL_SCRIPT_FILE = "data.sql"

def get_db_connection():
    """Establishes and returns a database connection."""
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row  # Allows accessing columns by name
    return conn

def execute_sql_file(filename=SQL_SCRIPT_FILE):
    """Executes the SQL script to set up the database."""
    # Check if the SQL file exists
    if not os.path.exists(filename):
        print(f"Error: SQL script file '{filename}' not found.")
        return

    conn = get_db_connection()
    try:
        with open(filename, 'r') as f:
            sql_script = f.read()
        
        conn.executescript(sql_script)
        conn.commit()
        print("Database initialized and mock data inserted successfully.")
    except Exception as e:
        print(f"Error during database initialization: {e}")
    finally:
        conn.close()

# Initialize the database on application startup
execute_sql_file()