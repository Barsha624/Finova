from database.db import get_db_connection


def get_financial_summary():
    """Calculate income, expenses, balance, and savings rate."""

    connection = get_db_connection()

    result = connection.execute("""
        SELECT
            COALESCE(
                SUM(CASE
                    WHEN transaction_type = 'income' THEN amount
                    ELSE 0
                END), 0
            ) AS total_income,

            COALESCE(
                SUM(CASE
                    WHEN transaction_type = 'expense' THEN amount
                    ELSE 0
                END), 0
            ) AS total_expenses

        FROM transactions
    """).fetchone()

    connection.close()

    total_income = result["total_income"]
    total_expenses = result["total_expenses"]

    balance = total_income - total_expenses

    if total_income > 0:
        savings_rate = (balance / total_income) * 100
    else:
        savings_rate = 0

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "balance": round(balance, 2),
        "savings_rate": round(savings_rate, 2),
    }


def get_expenses_by_category():
    """Calculate total spending in each expense category."""

    connection = get_db_connection()

    results = connection.execute("""
        SELECT
            category,
            SUM(amount) AS total
        FROM transactions
        WHERE transaction_type = 'expense'
        GROUP BY category
        ORDER BY total DESC
    """).fetchall()

    connection.close()

    return [
        {
            "category": row["category"],
            "total": round(row["total"], 2),
        }
        for row in results
    ]


def get_recent_transactions(limit=10):
    """Return the most recent transactions."""

    connection = get_db_connection()

    results = connection.execute("""
        SELECT
            id,
            description,
            category,
            transaction_type,
            amount,
            transaction_date
        FROM transactions
        ORDER BY transaction_date DESC, id DESC
        LIMIT ?
    """, (limit,)).fetchall()

    connection.close()

    return [dict(row) for row in results]