# Finova — Personal Finance Analytics Platform

**Make Every Rupee Count.**

Finova is a personal finance analytics dashboard built with Python, Flask, SQLite, HTML, CSS, and JavaScript. It presents income, expenses, balance, savings rate, spending categories, and recent transactions in a responsive dashboard.

> **Demo project:** The current version uses sample financial data. It does not connect to real bank accounts.

## Features

* Financial summary with total income, expenses, balance, and savings rate.
* Spending breakdown by category.
* Recent transaction history.
* Transaction search and income/expense filtering.
* REST API endpoints that return JSON.
* SQLite database for storing transaction records.
* Automated tests using pytest.
* Dark dashboard interface with responsive styling.

## Technology Stack

* **Backend:** Python, Flask
* **Database:** SQLite
* **Frontend:** HTML, CSS, JavaScript
* **Charts:** Chart.js
* **Testing:** pytest
* **Planned DevOps tooling:** GitHub Actions, Docker, and AWS EC2

## Project Structure

```text
finova/
├── app.py
├── requirements.txt
├── .gitignore
├── database/
│   └── db.py
├── services/
│   └── analytics.py
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── dashboard.js
└── tests/
    └── test_app.py
```

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd finova
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual URL of your GitHub repository.

### 2. Create a virtual environment

**Windows PowerShell:**

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 4. Initialize the database

```powershell
python -m database.db
```

### 5. Start the application

```powershell
python app.py
```

Open the following address in your browser:

http://127.0.0.1:5000

### 6. Run automated tests

Open another terminal in the project directory and run:

```powershell
python -m pytest -v
```

## API Endpoints

| Endpoint                | Description                           |
| ----------------------- | ------------------------------------- |
| `GET /`                 | Serves the dashboard.                 |
| `GET /health`           | Reports application health.           |
| `GET /api/summary`      | Returns the financial summary.        |
| `GET /api/categories`   | Returns expenses grouped by category. |
| `GET /api/transactions` | Returns recent transactions.          |

## Current Limitations

* Uses sample transaction data.
* Does not connect to banks or payment services.
* Does not provide financial advice.
* Authentication and production security hardening are not yet implemented.

## Development Goals

The project will be extended with automated CI testing, containerization with Docker, and deployment to AWS EC2. These capabilities will be documented as they are implemented.
