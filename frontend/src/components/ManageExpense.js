import {useState,useEffect,useContext} from 'react';
import { LoginContext } from "../contexts/LoginContext";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbSection,BreadcrumbDivider } from 'semantic-ui-react'


function ManageExpense(){

    const LoginProviderValues = useContext(LoginContext);
    const CAT_API_URL = '/category/getCategories';
    const GET_EXPENSE_URL='/expenses/getUserExpenses/';
    const DELETE_EXPENSE_URL='/expenses/deleteExpense/'
    const [expenseData,setExpenseData]=useState();
    const navigate=useNavigate();
    const [categories,setCategories]=useState([])
    const [date,setDate] = useState()
    const [category,setCategory] = useState()

    useEffect(()=>{
        async function fetchCategories(){
            const response = await apiClient.get(CAT_API_URL)
            const cats = response.data.map(item => ({
                id: item.id, 
                name: item.category 
            }));
            setCategories(cats)
        }
        fetchCategories();
    },[])


    useEffect(()=>{

        async function fetchExpense(){
            if (!LoginProviderValues) {
                return null;
            }
            
            const {email}=LoginProviderValues;

            try {
                
                const response = await apiClient.get(`${GET_EXPENSE_URL}${email}`);

                //console.log("Fetched expense data:", response.data);
                setExpenseData(response.data);
            } catch (error) {
                console.error("Error fetching expense data:", error);
            }
        }
        fetchExpense();

    },[LoginProviderValues])

    const handleUpdate = (id) => {
        navigate(`/updateExpense/${id}`);
      };


    const handleDelete = async (id)=>{
        try{

             await apiClient.delete(`${DELETE_EXPENSE_URL}${id}`);
             setExpenseData((prevExpenses) => prevExpenses?.filter((expense) => expense.id !== id) || null);
        }
        catch{
            alert("Failed to delete expense. Please try again.")
        }
    }

    const filteredExpenses =
    expenseData &&
    expenseData.filter((expense) => {
        console.log(expense.category.category)
        console.log(expense)
        return (
            (category ? expense.category.id === parseInt(category) : true) &&
            (date ? new Date(expense.date).toISOString().split("T")[0] === date : true) 
        );
    });

    return(
        <div>
             <Breadcrumb size="large" className="pt-5">
                <BreadcrumbSection>Budget</BreadcrumbSection>
                <BreadcrumbDivider icon='right chevron'/>
                <BreadcrumbSection active>Manage Budget</BreadcrumbSection>
            </Breadcrumb>

            <div className='flex gap-5 pt-10'>
            <div className='flex gap-1'>
            <label className='pt-2'>Date:</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className=" mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            </div>
            <div className='flex gap-1'>
            <label className='pt-2'>Category:</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" key="">--select--</option>
                {categories.map((cat) => (
                    <option value={cat.id} key={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            </div>

            </div>
            {filteredExpenses ? (
                <table className="table-auto border-collapse border border-gray-400 w-full mt-4 text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2">Category</th>
                            <th className="border border-gray-400 px-4 py-2">Amount</th>
                            <th className="border border-gray-400 px-4 py-2">Date</th>
                            <th className="border border-gray-400 px-4 py-2">Recurrance</th>
                            <th className="border border-gray-400 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-400 px-4 py-2">{expense.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{expense.category.category}</td>
                                <td className="border border-gray-400 px-4 py-2">{expense.amount}</td>
                                <td className="border border-gray-400 px-4 py-2">{new Date(expense.date).toISOString().split("T")[0]}</td>
                                <td className="border border-gray-400 px-4 py-2">{expense.recurring==true && <p>yes</p>}{expense.recurring!=true && <p>no</p>}</td>
                                <td className='border border-gray-400 flex gap-5 p-5 justify-center'>
                                    <button className='w-20 py-3 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none' onClick={()=>handleUpdate(expense.id)}>Update</button>
                                    <button className='w-20 py-3 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none' onClick={()=>handleDelete(expense.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading Expense data...</p>
            )}
        </div>
    )
}

export default ManageExpense;