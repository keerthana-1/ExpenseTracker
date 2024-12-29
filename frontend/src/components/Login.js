import { useState} from 'react';
import { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';

function Login() {

    const LoginProviderValues = useContext(LoginContext);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    if (!LoginProviderValues) {
        return null;
    }
    
    const {email,setEmail,password,setPassword,setIsLogin}=LoginProviderValues;

  const handleLogin = async (e) => {
    e.preventDefault();


    setError('');


    const loginData = { email, password };

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', loginData);

      // If login is successful, store the token in localStorage (or cookies)
      localStorage.setItem('authToken', response.data.token);
        setIsLogin(true);
      // Redirect to a protected route after successful login (e.g., dashboard)
      navigate('/dashboard'); // Change to your desired route
    } catch (err) {
      // Handle error (e.g., invalid credentials)
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
    <form onSubmit={handleLogin} className="space-y-4">
        <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
            type="submit"
            className="w-full py-3 bg-blue-950 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Login
        </button>
    </form>
</div>

  );
}

export default Login;
