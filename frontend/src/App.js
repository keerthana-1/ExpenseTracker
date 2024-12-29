import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MyProfile from "./components/MyProfile";
import Dashboard from "./components/Dashboard";
import { useState } from "react";
import NavLinks from "./components/NavLinks";
import AddExpense from "./components/AddExpense";
import AddBudget from "./components/AddBudget";
import Login from "./components/Login";
import LoginProvider from "./contexts/LoginContext";
import ManageBudget from "./components/ManageBudget";
import UpdateBudget from "./components/UpdateBudget";
import ManageExpense from "./components/ManageExpense";
import UpdateExpense from "./components/UpdateExpense";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LoginProvider>
      <Router>
        <div className="App">
          {/* Fixed Header */}
          <Header isOpen={isOpen} setIsOpen={setIsOpen} />

          <div className="flex">
            {/* Sidebar */}
            <div className="fixed h-screen ">
              <NavLinks isOpen={isOpen} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 p-4 pt-20 lg:pt-24 overflow-y-auto">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/addExpense" element={<AddExpense />} />
                <Route path="/addBudget" element={<AddBudget />} />
                <Route path="/login" element={<Login />} />
                <Route path="/manageBudget" element={<ManageBudget />} />
                <Route path="/updateBudget/:id" element={<UpdateBudget />} />
                <Route path="/manageExpense/" element={<ManageExpense />} />
                <Route path="/updateExpense/:id" element={<UpdateExpense />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </LoginProvider>
  );
}

export default App;
