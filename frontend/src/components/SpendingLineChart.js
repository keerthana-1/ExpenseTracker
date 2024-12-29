import { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { LoginContext } from "../contexts/LoginContext";
import apiClient from "../apiClient";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function SpendingLineChart() {
    const GET_EXPENSE_URL = '/expenses/getUserExpenses/';
    const [expenseData, setExpenseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const LoginProviderValues = useContext(LoginContext);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `$${tooltipItem.raw.toFixed(2)}`, // Format tooltip
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Spending ($)',
                },
                beginAtZero: true,
            },
        },
    };
    

    useEffect(() => {
        async function fetchExpense() {
            if (!LoginProviderValues) {
                return;
            }

            const { email } = LoginProviderValues;

            try {
                const response = await apiClient.get(`${GET_EXPENSE_URL}${email}`);
                console.log("Fetched expense data:", response.data);
                setExpenseData(response.data);
            } catch (error) {
                console.error("Error fetching expense data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchExpense();
    }, [LoginProviderValues]);

    const groupSpendingByMonth = (data) => {
        if (!data) return {};
    
        const spendingByMonth = data.reduce((acc, expense) => {
            const date = new Date(expense.date);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
            acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
            return acc;
        }, {});
    
        // Sort keys by actual date
        const sortedKeys = Object.keys(spendingByMonth).sort((a, b) => {
            const dateA = new Date(a); // Parse "Dec 2024"
            const dateB = new Date(b);
            return dateA - dateB;
        });
    
        // Create a sorted object
        const sortedSpending = {};
        sortedKeys.forEach((key) => {
            sortedSpending[key] = spendingByMonth[key];
        });
    
        return sortedSpending;
    };

    const generateFullMonthRange = (startDate, endDate) => {
        const result = [];
        const current = new Date(startDate);
    
        while (current <= new Date(endDate)) {
            result.push(`${current.toLocaleString('default', { month: 'short' })} ${current.getFullYear()}`);
            current.setMonth(current.getMonth() + 1); // Move to the next month
        }
    
        return result;
    };

    const fillMissingMonths = (data, startDate, endDate) => {
        const fullRange = generateFullMonthRange(startDate, endDate);
        const filledData = {};
    
        fullRange.forEach((monthYear) => {
            filledData[monthYear] = data[monthYear] || 0; // Use 0 if no data for that month
        });
    
        return filledData;
    };
    
    // Usage
    const currentYear = new Date().getFullYear();

    // Generate the start and end dates for the current year
    const startDate = `${currentYear}-01-01`; // January 1st of the current year
    const endDate = `${currentYear}-12-01`;  // December 1st of the current year
    const filledData = fillMissingMonths(groupSpendingByMonth(expenseData), startDate, endDate);
    const chartLabels = Object.keys(filledData);
    const chartValues = Object.values(filledData);
    
    
    const lineChartData = {
        labels: chartLabels, // Properly sorted and filled labels
        datasets: [
            {
                label: 'Monthly Spending',
                data: chartValues, // Properly aligned data
                fill: false,
                borderColor: '#172554',
                backgroundColor: '#172554',
                tension: 0.4,
            },
        ],
    };
    
    <Line data={lineChartData} />;
    

    if (loading) {
        return <p>Loading expense data...</p>;
    }

    if (!expenseData || expenseData.length === 0) {
        return <p>No expense data available to display trends.</p>;
    }

    return (
        <div>
            <h2>Spending Trend Over Time</h2>
            <Line data={lineChartData} options={options}/>
        </div>
    );
}
