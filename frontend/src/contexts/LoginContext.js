import { createContext, useState } from "react";

export const  LoginContext= createContext(undefined)

   
export default function LoginProvider({children}){

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [isLogin,setIsLogin]=useState(false);
   
    return(
        <LoginContext.Provider value={{email,setEmail,password,setPassword,isLogin,setIsLogin}}>
            {children}
        </LoginContext.Provider>
    )
    
 }