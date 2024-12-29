import {useState,useEffect} from "react";
import { LoginContext } from "../contexts/LoginContext";
import { useContext } from "react";
import apiClient from "../apiClient";
import { Breadcrumb, BreadcrumbSection,BreadcrumbDivider } from 'semantic-ui-react'

function AddBudget(){

    const CAT_API_URL = '/category/getCategories';
    const ADD_BUDGET_URL='/budget/createBudget'

    const LoginProviderValues = useContext(LoginContext);
    const [categories,setCategories]=useState([])

    const [month,setMonth] =useState("")
    const [year,setYear] = useState()
    const [category,setCategory] = useState()
    const [amount,setAmount] = useState(0)

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


    if (!LoginProviderValues) {
        return null;
    }
    
    const {email}=LoginProviderValues;


    async function handleAdd(){  
        
    try{
        const budgetData={
            userId:email,
            month:month,
            categoryId:category,
            year:year,
            amount:amount
        }
        
       const response=await apiClient.post(ADD_BUDGET_URL,budgetData);

       if (response.status === 200 || response.status === 201) {
        alert('Budget added successfully!');
        setMonth("")
        setCategory("")
        setAmount(0)
        setYear("")

        } else {
            console.error('Unexpected response:', response);
            alert('Failed to add budget. Please try again.');
        }
    }
    catch{
        alert("Failed to add budget. Please try again.")
    }

    }

    const months=["January","February","March","April","May","June","July","August","September","October","November","December"]
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (v, i) => currentYear + i);
    
    return (
        <div>
            
            <Breadcrumb size="large" className="pt-5">
                <BreadcrumbSection>Budget</BreadcrumbSection>
                <BreadcrumbDivider icon='right chevron'/>
                <BreadcrumbSection active>Add Budget</BreadcrumbSection>
            </Breadcrumb>
           
        <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg mt-10">
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Choose Month</label>
            <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" key="">--select--</option>
                {months.map((month, key) => (
                    <option value={month} key={key}>
                        {month}
                    </option>
                ))}
            </select>
        </div>
    
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Choose Year</label>
            <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" key="">--select--</option>
                {years.map((year, key) => (
                    <option value={year} key={key}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Choose Category</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" key="">--select--</option>
                {categories.map((cat) => (
                    <option value={cat.id} key={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Enter Amount</label>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    
        <button
            onClick={handleAdd}
            className="w-full py-2 px-4 bg-blue-950 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            Add
        </button>
    </div>
    </div>
    )
}

export default AddBudget;