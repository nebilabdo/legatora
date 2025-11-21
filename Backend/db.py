import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.path.join(BASE_DIR, "data.db")
SQL_SCRIPT_FILE = os.path.join(BASE_DIR, "data.sql")

def get_db_connection():
    conn = sqlite3.connect(DATABASE_URL, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def execute_sql_file():
    if not os.path.exists(SQL_SCRIPT_FILE):
        print(f"SQL file missing: {SQL_SCRIPT_FILE}")
        return
    conn = sqlite3.connect(DATABASE_URL)
    try:
        with open(SQL_SCRIPT_FILE, "r") as f:
            conn.executescript(f.read())
        conn.commit()
        print("Database recreated successfully.")
    except Exception as e:
        print(f"DB initialization error: {e}")
    finally:
        conn.close()

def ensure_db():
    if not os.path.exists(DATABASE_URL):
        print("Database not found. Recreating...")
        execute_sql_file()
    else:
        # Optional: test if DB is valid
        try:
            conn = get_db_connection()
            conn.execute("SELECT 1 FROM sqlite_master LIMIT 1;")
        except sqlite3.DatabaseError:
            print("Database corrupt. Recreating...")
            execute_sql_file()
        finally:
            conn.close()

# Ensure database exists on startup
ensure_db()
