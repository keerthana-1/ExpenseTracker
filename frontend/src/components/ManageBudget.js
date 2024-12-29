import {useState,useEffect,useContext} from 'react';
import { LoginContext } from "../contexts/LoginContext";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbSection,BreadcrumbDivider } from 'semantic-ui-react'

function ManageBudget(){

    const LoginProviderValues = useContext(LoginContext);
    const GET_BUDGET_URL='/budget/getUserBudgets/';
    const DELETE_BUDGET_URL='/budget/deleteBudget/'
    const [budgetData,setBudgetData]=useState();
    const navigate=useNavigate();
    const [category,setCategory] = useState()
    const CAT_API_URL = '/category/getCategories';
    const [month,setMonth] =useState("")
    const [year,setYear] = useState()

    useEffect(()=>{

        async function fetchBudget(){
            if (!LoginProviderValues) {
                return null;
            }
            
            const {email}=LoginProviderValues;

            try {
               // console.log(`${GET_BUDGET_URL}${email}`)
                const response = await apiClient.get(`${GET_BUDGET_URL}${email}`);

                //console.log("Fetched budget data:", response.data);
                setBudgetData(response.data);
            } catch (error) {
                console.error("Error fetching budget data:", error);
            }
        }
        fetchBudget();

    },[LoginProviderValues])


   

    const [categories,setCategories]=useState([])

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

    const handleUpdate = (id) => {
        navigate(`/updateBudget/${id}`);
      };


    const handleDelete = async (id)=>{
        try{

             await apiClient.delete(`${DELETE_BUDGET_URL}${id}`);
             setBudgetData((prevBudgets) => prevBudgets?.filter((budget) => budget.id !== id) || null);
        }
        catch{
            alert("Failed to delete budget. Please try again.")
        }
    }

    const months=["January","February","March","April","May","June","July","August","September","October","November","December"]
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (v, i) => currentYear + i);


    const filteredBudgets =
    budgetData &&
    budgetData.filter((budget) => {
        console.log(budget.category.category)
        console.log(category)
        return (
            (category ? budget.category.id === parseInt(category) : true) &&
            (month ? budget.month === month : true) &&
            (year ? budget.year === parseInt(year) : true)
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
                <label className='pt-2'>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className=" mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="" key="">--select--</option>
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                </div>
                <div className='flex gap-1'>
                <label className='pt-2'>Month:</label>
                <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className=" mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" key="">--select--</option>
                {months.map((month, key) => (
                    <option value={month} key={key}>
                        {month}
                    </option>
                ))}
            </select>
            </div>
            <div className='flex gap-1'>
            <label className='pt-2'>Year:</label>
                <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className=" mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" key="">--select--</option>
                {years.map((year, key) => (
                    <option value={year} key={key}>
                        {year}
                    </option>
                ))}
            </select>
            </div>

            </div>
            {filteredBudgets ? (
                <table className="table-auto border-collapse border border-gray-400 w-full mt-4 text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-400 px-4 py-2">Category</th>
                            <th className="border border-gray-400 px-4 py-2">Amount</th>
                            <th className="border border-gray-400 px-4 py-2">Month</th>
                            <th className="border border-gray-400 px-4 py-2">Year</th>
                            <th className="border border-gray-400 px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBudgets.map((budget, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-400 px-4 py-2">{budget.category.category}</td>
                                <td className="border border-gray-400 px-4 py-2">{budget.amount}</td>
                                <td className="border border-gray-400 px-4 py-2">{budget.month}</td>
                                <td className="border border-gray-400 px-4 py-2">{budget.year}</td>
                                <td className='flex gap-5 p-5 justify-center'>
                                    <button className='w-20 py-3 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none' onClick={()=>handleUpdate(budget.id)}>Update</button>
                                    <button className='w-20 py-3 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none' onClick={()=>handleDelete(budget.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading budget data...</p>
            )}
        </div>
    )
}

export default ManageBudget;