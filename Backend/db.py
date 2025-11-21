import sqlite3
import os

# Use Render persistent path
DATABASE_URL = "/data/data.db"
SQL_SCRIPT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.sql")

def get_db_connection():
    conn = sqlite3.connect(DATABASE_URL, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def execute_sql_file():
    if not os.path.exists(SQL_SCRIPT_FILE):
        print(f"Error: SQL script '{SQL_SCRIPT_FILE}' not found.")
        return
    try:
        with open(SQL_SCRIPT_FILE, "r") as f:
            sql_script = f.read()
        conn = sqlite3.connect(DATABASE_URL)
        conn.executescript(sql_script)
        conn.commit()
        conn.close()
        print("Database created and mock data inserted successfully.")
    except Exception as e:
        print(f"Error during DB init: {e}")

def ensure_db():
    recreate = False
    if not os.path.exists(DATABASE_URL):
        print("Database not found. It will be created.")
        recreate = True
    else:
        try:
            conn = get_db_connection()
            conn.execute("SELECT 1 FROM sqlite_master LIMIT 1;")
            conn.close()
        except sqlite3.DatabaseError:
            print("Database corrupt or invalid. Recreating...")
            recreate = True

    if recreate:
        execute_sql_file()

# Run at startup
ensure_db()
