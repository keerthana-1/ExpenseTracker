import {useState,useEffect} from "react";
import { LoginContext } from "../contexts/LoginContext";
import { useContext } from "react";
import apiClient from "../apiClient";
import { Breadcrumb, BreadcrumbSection,BreadcrumbDivider } from 'semantic-ui-react'

function AddExpense(){

    const CAT_API_URL = '/category/getCategories';
    const ADD_EXPENSE_URL='/expenses/addExpense'
    const GET_BUDGET_URL='/expenses/getBudgetForExpense'
    const TRACK_BUDGET_URL='/budget/track-budget'

    const LoginProviderValues = useContext(LoginContext);
    const [categories,setCategories]=useState([])

    const [name,setName] =useState("")
    const [date,setDate] = useState()
    const [category,setCategory] = useState()
    const [amount,setAmount] = useState(0)
    const [isRecurring,setIsRecurring]=useState(false)
    const [availableBudget,setAvailableBudget]=useState()

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
        async function fetchAvailableBudget(){
            try{
                if (!LoginProviderValues) {
                    return null;
                }
                
                const {email}=LoginProviderValues;

                const expenseData={
                    userId:email,
                    date:date,
                    name:name,
                    categoryId:category,
                    isRecurring:isRecurring,
                    amount:amount
                }
               
                
            if(date!=null && category!=null){
               const response=await apiClient.post(GET_BUDGET_URL,expenseData);
        
               if (response.status === 200 || response.status === 201) {
               // console.log('get budget successful:', response.data);
                setAvailableBudget(response.data)
              
                } else {
                    console.error('Unexpected response:', response);
                    alert('Failed to get budget. Please try again.');
                }
            }
            }
            catch{
                alert("Failed to get budget. Please try again.")
            }
        
        
        }
        fetchAvailableBudget();
    },[category, date, LoginProviderValues])


    if (!LoginProviderValues) {
        return null;
    }
    
    const {email}=LoginProviderValues;


    async function handleAdd(){  
        
    try{
        const expenseData={
            userId:email,
            date:date,
            name:name,
            categoryId:category,
            isRecurring:isRecurring,
            amount:amount
        }
        //console.log(expenseData)
        
       const response=await apiClient.post(ADD_EXPENSE_URL,expenseData);

       if (response.status === 200 || response.status === 201) {
       // console.log('Expense added successfully:', response.data);
        alert('Expense added successfully!');

        const budgetRequest={
            email:email,
            budgetName:category,
            currentSpending:amount,
            budgetLimit:availableBudget
        }
    
        
        const response2=await apiClient.post(TRACK_BUDGET_URL,budgetRequest);
        console.log(response2)
        
        } else {
            console.error('Unexpected response:', response);
            alert('Failed to add expense. Please try again.');
        }

    }
    catch{
        alert("Failed to add expense. Please try again.")
    }

   

    }

    async function handleCategoryChange(e){
        e.preventDefault()
        setCategory(e.target.value)
    }

    return (
        <div>
            
            <Breadcrumb size="large" className="pt-5">
                <BreadcrumbSection>Expense</BreadcrumbSection>
                <BreadcrumbDivider icon='right chevron'/>
                <BreadcrumbSection active>Add Expense</BreadcrumbSection>
            </Breadcrumb>
           
        <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg mt-10">
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expense Date</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expense Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Choose Category</label>
            <select
                value={category}
                onChange={(e) => handleCategoryChange(e)}
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
    
        <div className="mb-4 flex">
        <label className="block text-sm font-medium text-gray-700 pr-3">Available Budget:</label>
        { availableBudget != -1.0 &&  <p>{availableBudget}</p> }
        { availableBudget == -1.0 &&  <p>Budget unavailable</p> }
        
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

        <div className="mb-4 flex">
            <input
                type="checkbox"
                value={isRecurring}
                onChange={() => setIsRecurring(true)}
                className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            /> <label className="pl-5 block text-sm font-medium text-gray-700">Is Recurring[monthly]</label>
           
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

export default AddExpense;