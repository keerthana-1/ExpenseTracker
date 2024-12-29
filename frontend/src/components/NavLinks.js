import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";

function NavLinks({ isOpen }) {
    const [expensesOpen, setExpensesOpen] = useState(false);
    const [budgetOpen, setBudgetOpen] = useState(false);
    const navigate = useNavigate();

    function handleExpenses() {
        setExpensesOpen(!expensesOpen);
    }

    function handleBudget() {
        setBudgetOpen(!budgetOpen);
    }

    function handleLogout() {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
        navigate("/login");
    }

    const LoginProviderValues = useContext(LoginContext);
    if (!LoginProviderValues) {
        return null;
    }

    const { isLogin, setIsLogin, setEmail, setPassword } = LoginProviderValues;

    if (!isLogin) {
        return null;
    }

    return (
        <div>
            <nav
                className={`bg-blue-950 text-white w-64 p-4 pt-20 lg:pt-24 fixed lg:relative lg:top-0 h-full lg:h-screen ${
                    isOpen ? "fixed inset-0 z-50 pt-20" : "hidden lg:block"
                }`}
            >
                <ul className="space-y-4">
                    <li>
                        <Link to="/dashboard" className="hover:bg-gray-700 p-2 block rounded text-white">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <p className="hover:bg-gray-700 p-2 block rounded" onClick={handleExpenses}>
                            Expenses
                        </p>
                        {expensesOpen && (
                            <ul className="space-y-4 pl-7">
                                <li>
                                    <Link to="/addExpense" className="hover:bg-gray-700 p-2 block rounded text-white">
                                        Add Expense
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manageExpense" className="hover:bg-gray-700 p-2 block rounded text-white">
                                        Manage Expenses
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <p className="hover:bg-gray-700 p-2 block rounded" onClick={handleBudget}>
                            Budget
                        </p>
                        {budgetOpen && (
                            <ul className="space-y-4 pl-7">
                                <li>
                                    <Link to="/addBudget" className="hover:bg-gray-700 p-2 block rounded text-white">
                                        Add Budget
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manageBudget" className="hover:bg-gray-700 p-2 block rounded text-white">
                                        Manage Budget
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <Link to="/profile" className="hover:bg-gray-700 p-2 block rounded text-white">
                            Profile
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/changePassword" className="hover:bg-gray-700 p-2 block rounded text-white">
                            Change Password
                        </Link>
                    </li> */}
                    <li>
                        <p className="hover:bg-gray-700 p-2 block rounded text-white" onClick={handleLogout}>
                            Logout
                        </p>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default NavLinks;
