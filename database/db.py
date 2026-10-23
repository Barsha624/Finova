import sqlite3
from pathlib import Path


# Find the main project directory.
BASE_DIR = Path(__file__).resolve().parent.parent

# Store the database inside the database folder.
DATABASE_PATH = BASE_DIR / "database" / "finova.db"


def get_db_connection():
    """Create a connection to the Finova SQLite database."""
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    """Create the transactions table and insert demo data if needed."""
    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            transaction_type TEXT NOT NULL
                CHECK (transaction_type IN ('income', 'expense')),
            amount REAL NOT NULL CHECK (amount > 0),
            transaction_date TEXT NOT NULL
        )
    """)

    existing_transactions = connection.execute(
        "SELECT COUNT(*) FROM transactions"
    ).fetchone()[0]

    if existing_transactions == 0:
        demo_transactions = [
            (
                "Monthly Salary",
                "Salary",
                "income",
                50000.00,
                "2026-10-21",
            ),
            (
                "Grocery Shopping",
                "Food",
                "expense",
                2500.00,
                "2026-10-21",
            ),
            (
                "Electricity Bill",
                "Utilities",
                "expense",
                1200.00,
                "2026-10-20",
            ),
            (
                "Freelance Project",
                "Freelance",
                "income",
                8000.00,
                "2026-10-19",
            ),
            (
                "Internet Bill",
                "Utilities",
                "expense",
                999.00,
                "2026-10-18",
            ),
            (
                "Restaurant Dinner",
                "Food",
                "expense",
                850.00,
                "2026-10-17",
            ),
            (
                "Bus Pass",
                "Transport",
                "expense",
                600.00,
                "2026-10-16",
            ),
            (
                "Online Course",
                "Education",
                "expense",
                1500.00,
                "2026-10-15",
            ),
        ]

        connection.executemany("""
            INSERT INTO transactions (
                description,
                category,
                transaction_type,
                amount,
                transaction_date
            )
            VALUES (?, ?, ?, ?, ?)
        """, demo_transactions)

    connection.commit()
    connection.close()


if __name__ == "__main__":
    initialize_database()
    print("Finova database initialized successfully!")