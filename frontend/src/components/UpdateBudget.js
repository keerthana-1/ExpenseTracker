import { useParams } from "react-router-dom";
import {useState,useEffect,useContext} from 'react';
import apiClient from "../apiClient";
import { LoginContext } from "../contexts/LoginContext";

function UpdateBudget(){

    const {id } = useParams();
    const GET_BUDGET_URL='/budget/getBudgetByID/'
    const UPDATE_BUDGET_URL='/budget/updateBudget/'
    const CAT_API_URL = '/category/getCategories';
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
            //console.log(cats)
            setCategories(cats)
        }
        fetchCategories();
    },[])

    useEffect(() => {
        const fetchBudget = async () => {
            try {
               // console.log(id)
                if(id!=null){
                const response = await apiClient.get(`${GET_BUDGET_URL}${id}`);

                //console.log("Fetched budget data:", response.data);
                const data=response.data;
                setMonth(data.month)
                setYear(data.year)
                setCategory(data.category.id)
                setAmount(data.amount)
                }
            } catch (error) {
                console.error("Error fetching budget data:", error);
            }
        };
        fetchBudget();
      }, [id]);

      async function handleUpdate(){
        try{

            if (!LoginProviderValues) {
                return null;
            }
            
            const {email}=LoginProviderValues;

            const budgetData={
                userId:email,
                month:month,
                categoryId:category,
                year:year,
                amount:amount
            }
            
           const response=await apiClient.put(`${UPDATE_BUDGET_URL}${id}`,budgetData);
    
           if (response.status === 200 || response.status === 201) {
           // console.log('Budget updated successfully:', response.data);
            alert('Budget updated successfully!');
            } else {
                console.error('Unexpected response:', response);
                alert('Failed to add budget. Please try again.');
            }
        }
        catch{
            alert("Failed to update budget. Please try again.")
        }
      }

      const months=["January","February","March","April","May","June","July","August","September","October","November","December"]
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 10 }, (v, i) => currentYear + i);

    return (
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
            onClick={handleUpdate}
            className="w-full py-2 px-4 bg-blue-950 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            Update
        </button>
    </div>
    )
}

export default UpdateBudget;