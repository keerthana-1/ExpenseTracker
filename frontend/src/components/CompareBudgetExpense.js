import { useState, useEffect, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { LoginContext } from "../contexts/LoginContext";
import apiClient from "../apiClient";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CompareBudgetExpense() {
    const [budgets, setBudgets] = useState([]);
    const [actualSpending, setActualSpending] = useState([]);
    const [loading, setLoading] = useState(true);
    const LoginProviderValues = useContext(LoginContext);

    useEffect(() => {
        async function fetchData() {
            if (!LoginProviderValues) return;
            const { email } = LoginProviderValues;

            try {
                // Fetch budgets
                const budgetResponse = await apiClient.get(`/budget/getUserBudgets/${email}`);
                setBudgets(budgetResponse.data);

                // Fetch actual spending for the current month
                const currentMonth = new Date().toLocaleString('default', { month: 'long' }); // e.g., "December"
                const currentYear = new Date().getFullYear();
                const expenseResponse = await apiClient.get(`/expenses/getUserExpenses/${email}`);
                const currentMonthExpenses = expenseResponse.data.filter((expense) => {
                    const date = new Date(expense.date);
                    return (
                        date.toLocaleString('default', { month: 'long' }) === currentMonth &&
                        date.getFullYear() === currentYear
                    );
                });

                // Aggregate spending by category
                const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
                    acc[expense.name] = (acc[expense.name] || 0) + expense.amount;
                    return acc;
                }, {});

                setActualSpending(spendingByCategory);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [LoginProviderValues]);

    // Match budgets and actual spending by category
   // Ensure categories are unique and ordered
    const categories = [...new Set([...budgets.map((b) => b.category.category), ...Object.keys(actualSpending)])];

    // Align budget values to categories
    const budgetValues = categories.map((category) => {
    const budget = budgets.find((b) => b.category.category === category);
    return budget ? budget.amount : 0; // Default to 0 if no budget exists
    });

    // Align actual spending values to categories
    const actualValues = categories.map((category) => actualSpending[category] || 0); // Default to 0 if no spending  // Chart Data
    
    const chartData = {
        labels: categories, // Categories as X-axis labels
        datasets: [
            {
                label: 'Budget',
                data: budgetValues,
                backgroundColor: '#36A2EB', // Blue color
                barPercentage: 0.5, // Control width of the bar
                categoryPercentage: 0.6, // Spacing between bars in a group
            },
            {
                label: 'Actual Spending',
                data: actualValues,
                backgroundColor: '#FF6384', // Red color
                barPercentage: 0.5,
                categoryPercentage: 0.6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Categories',
                },
                stacked: false, // Keep bars side by side
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount ($)',
                },
                beginAtZero: true,
            },
        },
    };

    const overBudgetCategories = categories.filter((category, index) => actualValues[index] > budgetValues[index]);
    console.log("Categories:", categories);
    console.log("Budget Values:", budgetValues);
    console.log("Actual Values:", actualValues);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading data...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 >Budget vs. Actual Spending</h2>
            <div className="overflow-auto">
                <Bar data={chartData} options={chartOptions} />
                {overBudgetCategories.length > 0 && (
                    <div className='flex gap-3 pt-5'>
                        <h3>Over-Budget Categories:</h3>
                        <ul className='flex gap-3'>
                            {overBudgetCategories.map((category) => (
                                <li key={category} className='font-semibold pt-1'>{category}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
