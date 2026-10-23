from flask import Flask, jsonify, render_template

from database.db import initialize_database
from services.analytics import (
    get_financial_summary,
    get_expenses_by_category,
    get_recent_transactions,
)

app = Flask(__name__)


# Initialize the database when the application starts.
initialize_database()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "application": "Finova",
    })


@app.route("/api/summary")
def api_summary():
    return jsonify(get_financial_summary())


@app.route("/api/categories")
def api_categories():
    return jsonify(get_expenses_by_category())


@app.route("/api/transactions")
def api_transactions():
    return jsonify(get_recent_transactions())


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)