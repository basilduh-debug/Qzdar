import { createContext, useState, useContext} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
        //if user is logged in, user state will hold user data, otherwise it will be null
    const  login = (userData) => {
        setUser(userData);  
    };
        //if userr logs out, we set user state back to null
    const logout = () => {
        setUser(null);
    };  
        //isAuthenticated is a boolean that indicates whether the user is logged in or not
    const isAuthenticated = user !== null;

    return ( //Provide auth context to children components
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}      
        </AuthContext.Provider>
    );
};
//hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) { throw new Error("useAuth must be used within an AuthProvider"); }
    return context;
};