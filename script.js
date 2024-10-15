// Budget and expenses data
let budget = 0;
let totalExpenses = 0;
let savingsGoal = 0;
const expenses = [];

// DOM elements
const budgetInput = document.getElementById('budget-input');
const savingsGoalInput = document.getElementById('savings-goal');
const budgetMessage = document.getElementById('budget-message');
const expenseInput = document.getElementById('expense-input');
const categorySelect = document.getElementById('expense-category');
const customCategoryInput = document.getElementById('custom-category-input');
const expensesUl = document.getElementById('expenses-ul');
const totalExpensesP = document.getElementById('total-expenses');

// Chart.js integration for visualizing expenses
let expenseChart = null;

// Toggle custom category input based on selection
categorySelect.addEventListener('change', () => {
    if (categorySelect.value === 'Custom') {
        customCategoryInput.style.display = 'block';
    } else {
        customCategoryInput.style.display = 'none';
    }
});

// Set budget and savings goal
document.getElementById('set-budget-btn').addEventListener('click', () => {
    budget = parseFloat(budgetInput.value) || 0;
    savingsGoal = parseFloat(savingsGoalInput.value) || 0;
    budgetMessage.textContent = `Budget set to $${budget}. Savings goal: $${savingsGoal}.`;
    updateExpensesUI();
});

// Add expense
document.getElementById('add-expense-btn').addEventListener('click', () => {
    const amount = parseFloat(expenseInput.value);
    let category = categorySelect.value;

    // Handle custom category input
    if (category === 'Custom' && customCategoryInput.value.trim() !== '') {
        category = customCategoryInput.value;
    }

    if (amount > 0 && category) {
        expenses.push({ category, amount });
        totalExpenses += amount;
        updateExpensesUI();
        updateChart(); // Update chart with new data
    }
});

// Update expenses list and total expenses
function updateExpensesUI() {
    expensesUl.innerHTML = ''; // Clear list
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.category}: $${expense.amount}`;
        // Add delete button for each expense
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            totalExpenses -= expense.amount;
            expenses.splice(index, 1); // Remove expense
            updateExpensesUI();
            updateChart(); // Update chart after deletion
        });
        li.appendChild(deleteBtn);
        expensesUl.appendChild(li);
    });
    totalExpensesP.textContent = `Total Expenses: $${totalExpenses}`;
}

// Chart.js setup for visualizing expenses by category
function updateChart() {
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (expenseChart) {
        expenseChart.destroy(); // Destroy the previous chart before creating a new one
    }

    const ctx = document.getElementById('expense-chart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: amounts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        }
    });
}
