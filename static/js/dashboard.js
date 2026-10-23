const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
});

const chartColors = [
    "#43e0a0",
    "#83a9ff",
    "#ffb86b",
    "#c5a2ff",
    "#ff7884",
    "#59d5dc",
    "#a6d76b",
    "#f5a6d8"
];

let categoryChart = null;
let allTransactions = [];


function formatCurrency(amount) {
    return currencyFormatter.format(Number(amount) || 0);
}


function formatDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${url} (${response.status})`);
    }

    return response.json();
}


async function loadSummary() {
    const summary = await fetchJSON("/api/summary");

    document.getElementById("balance").textContent =
        formatCurrency(summary.balance);

    document.getElementById("income").textContent =
        formatCurrency(summary.total_income);

    document.getElementById("expenses").textContent =
        formatCurrency(summary.total_expenses);

    document.getElementById("savings-rate").textContent =
        `${summary.savings_rate.toFixed(2)}%`;
}


async function loadCategories() {
    const categories = await fetchJSON("/api/categories");

    renderCategoryChart(categories);
    renderCategoryBars(categories);
}


function renderCategoryChart(categories) {
    const canvas = document.getElementById("categoryChart");
    const legend = document.getElementById("category-legend");

    if (categoryChart) {
        categoryChart.destroy();
    }

    legend.replaceChildren();

    if (categories.length === 0) {
        legend.textContent = "No expense data available yet.";
        return;
    }

    categoryChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: categories.map(item => item.category),
            datasets: [{
                data: categories.map(item => item.total),
                backgroundColor: categories.map(
                    (_, index) => chartColors[index % chartColors.length]
                ),
                borderColor: "#12171d",
                borderWidth: 4,
                hoverOffset: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: context =>
                            `${context.label}: ${formatCurrency(context.raw)}`
                    }
                }
            }
        }
    });

    categories.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "legend-row";

        const swatch = document.createElement("span");
        swatch.className = "legend-color";
        swatch.style.backgroundColor =
            chartColors[index % chartColors.length];

        const label = document.createElement("span");
        label.textContent = item.category;

        const value = document.createElement("span");
        value.className = "legend-value";
        value.textContent = formatCurrency(item.total);

        row.append(swatch, label, value);
        legend.appendChild(row);
    });
}


function renderCategoryBars(categories) {
    const container = document.getElementById("category-bars");
    container.replaceChildren();

    if (categories.length === 0) {
        container.textContent = "No expense data available yet.";
        return;
    }

    const largestExpense = Math.max(
        ...categories.map(item => item.total),
        1
    );

    categories.forEach(item => {
        const row = document.createElement("div");
        row.className = "category-bar-item";

        const heading = document.createElement("div");
        heading.className = "category-bar-heading";

        const name = document.createElement("span");
        name.textContent = item.category;

        const amount = document.createElement("strong");
        amount.textContent = formatCurrency(item.total);

        heading.append(name, amount);

        const track = document.createElement("div");
        track.className = "progress-track";

        const fill = document.createElement("div");
        fill.className = "progress-fill";

        fill.style.width =
            `${(item.total / largestExpense) * 100}%`;

        track.appendChild(fill);
        row.append(heading, track);
        container.appendChild(row);
    });
}


async function loadTransactions() {
    allTransactions = await fetchJSON("/api/transactions");
    renderTransactions();
}


function renderTransactions() {
    const tbody = document.getElementById("transaction-body");
    const searchInput = document.getElementById("transaction-search");
    const typeFilter = document.getElementById("type-filter");
    const count = document.getElementById("transaction-count");

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;

    const filteredTransactions = allTransactions.filter(transaction => {
        const matchesSearch = [
            transaction.description,
            transaction.category,
            transaction.transaction_type
        ].some(value => value.toLowerCase().includes(searchTerm));

        const matchesType =
            selectedType === "all" ||
            transaction.transaction_type === selectedType;

        return matchesSearch && matchesType;
    });

    tbody.replaceChildren();

    if (filteredTransactions.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 3;
        cell.className = "loading-cell";
        cell.textContent = "No matching transactions found.";

        row.appendChild(cell);
        tbody.appendChild(row);
    }

    filteredTransactions.forEach(transaction => {
        const row = document.createElement("tr");

        const descriptionCell = document.createElement("td");
        const nameWrapper = document.createElement("div");
        nameWrapper.className = "transaction-name";

        const icon = document.createElement("span");
        icon.className = "transaction-icon";
        icon.textContent =
            transaction.transaction_type === "income" ? "↙" : "↗";

        const details = document.createElement("div");

        const description = document.createElement("div");
        description.className = "transaction-description";
        description.textContent = transaction.description;

        const category = document.createElement("div");
        category.className = "transaction-category";
        category.textContent = transaction.category;

        details.append(description, category);
        nameWrapper.append(icon, details);
        descriptionCell.appendChild(nameWrapper);

        const dateCell = document.createElement("td");
        dateCell.className = "date-cell";
        dateCell.textContent = formatDate(transaction.transaction_date);

        const amountCell = document.createElement("td");

        const isIncome = transaction.transaction_type === "income";
        amountCell.className = isIncome
            ? "amount-income"
            : "amount-expense";

        amountCell.textContent =
            `${isIncome ? "+" : "−"}${formatCurrency(transaction.amount)}`;

        row.append(descriptionCell, dateCell, amountCell);
        tbody.appendChild(row);
    });

    count.textContent =
        `Showing ${filteredTransactions.length} of ${allTransactions.length} transactions`;
}


async function initializeDashboard() {
    try {
        await Promise.all([
            loadSummary(),
            loadCategories(),
            loadTransactions()
        ]);
    } catch (error) {
        console.error("Unable to load the Finova dashboard:", error);

        document.getElementById("transaction-body").innerHTML =
            '<tr><td colspan="3" class="loading-cell">Unable to load data. Check the server and refresh.</td></tr>';
    }
}


document
    .getElementById("transaction-search")
    .addEventListener("input", renderTransactions);

document
    .getElementById("type-filter")
    .addEventListener("change", renderTransactions);


initializeDashboard();