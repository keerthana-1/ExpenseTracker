import CompareBudgetExpense from "./CompareBudgetExpense";
import SpendingLineChart from "./SpendingLineChart";
import ThreeMonthsSpending from "./ThreeMonthsSpending";

function Dashboard() {
  return (
    <div >

      
      <div>        
          <ThreeMonthsSpending />
       
      </div>

      <div className="flex justify-center gap-8">
        {/* Spending Line Chart */}
        <div className="w-[500px] h-[400px]">
          <SpendingLineChart />
        </div>

        {/* Compare Budget Expense Chart */}
        <div className="w-[500px] h-[400px]">
          <CompareBudgetExpense />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
