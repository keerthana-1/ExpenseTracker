import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from "../contexts/LoginContext";

function MyProfile(){

    const UPDATE_API_URL = 'http://localhost:8080/api/user/updateUser';
    const GET_API_URL = 'http://localhost:8080/api/user/getUserById';

    const LoginProviderValues = useContext(LoginContext);
   

    useEffect(()=>{

        if (!LoginProviderValues) {
            return null;
        }
        
        const {email}=LoginProviderValues;
        const fetchUser = async () => {
        const response = await axios.get(`${GET_API_URL}/${email}`)
       // console.log(response)
        const user=response.data;
        
        setUsername(user.email)
        setName(user.name)
        setPassword(user.password)
    };

    fetchUser();
    },[LoginProviderValues]);

    

    async function handleUpdate(){
        const userData={
            'email':username,
            'name':name,
            'password':password
        }
        await axios.put(UPDATE_API_URL,userData);
    }

    const [username,setUsername]=useState("");
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");

    return(
        <div className='max-w-lg mx-auto mt-10 p-10'>
        <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700'>Name:</label>
            <input
                placeholder='name'
                type='text'
                value={name}
                onChange={(event) => setName(event.target.value)}
                className='w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
        </div>
    
        <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700'>Email:</label>
            <input
                placeholder='email'
                type='text'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className='w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
        </div>
    
        <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700'>Password:</label>
            <input
                placeholder='password'
                type='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className='w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
        </div>
    
        <button
            onClick={handleUpdate}
            className='w-full py-3 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
            Update Profile
        </button>
    </div>
    
    )
}

export default MyProfile;