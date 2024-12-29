import { useState, useEffect, useContext } from 'react';
import { LoginContext } from "../contexts/LoginContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import apiClient from "../apiClient";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ThreeMonthsSpending() {
    const GET_EXPENSE_URL = '/expenses/getUserExpenses/';
    const [expenseData, setExpenseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const LoginProviderValues = useContext(LoginContext);

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

    const getLastThreeMonths = () => {
        const months = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return Array.from({ length: 3 }, (_, i) => {
            const date = new Date(currentYear, currentMonth - i);
            return {
                month: months[date.getMonth()],
                year: date.getFullYear(),
            };
        });
    };

    const aggregateSpendingByCategory = (data, month, year) => {
        if (!data) return {};
        return data
            .filter((item) => {
                const itemDate = new Date(item.date);
                const itemMonth = itemDate.toLocaleString('default', { month: 'long' });
                const itemYear = itemDate.getFullYear();
                return itemMonth === month && itemYear === year;
            })
            .reduce((acc, expense) => {
                acc[expense.name] = (acc[expense.name] || 0) + expense.amount;
                return acc;
            }, {});
    };

    const lastThreeMonths = getLastThreeMonths();
    const chartData = lastThreeMonths.map(({ month, year }) => ({
        label: `${month} ${year}`,
        data: aggregateSpendingByCategory(expenseData, month, year),
    }));

    const createPieChartData = (data) => ({
        labels: Object.keys(data),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    });

    if (loading) {
        return <p>Loading expense data...</p>;
    }

    if (!expenseData || expenseData.length === 0) {
        return <p>No expense data available for the selected period.</p>;
    }

    return (
        <div>
            <h2>Spending Visualization</h2>
            <div className="flex gap-8 justify-content flex-wrap">
                {chartData.map((data, index) => (
                    <div key={index} className="w-64 m-5 h-80">
                        <h3>{data.label}</h3>
                        {Object.keys(data.data).length > 0 ? (
                            <Pie data={createPieChartData(data.data)} />
                        ) : (
                            <p>No data for this month.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
