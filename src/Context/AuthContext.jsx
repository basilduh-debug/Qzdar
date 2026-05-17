import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // user holds { id, name, role }, null if not logged in
    const [user, setUser] = useState(null);

    // On first render, restore the user from localStorage if a token is saved.
    // (We still keep the JWT and the user object in localStorage so a refresh
    // does not log the user out - this is just for the token, not as a database.)
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    // Login: call backend, save token + user
    const login = async (username, password) => {
        const data = await api("/auth/signin", {
            method: "POST",
            body: JSON.stringify({ username, password })
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    // Signup: call backend, save token + user, user is now logged in
    const signup = async (username, password, role) => {
        const data = await api("/auth/signup", {
            method: "POST",
            body: JSON.stringify({ username, password, role })
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    // Logout: drop the token and the user
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) { throw new Error("useAuth must be used within an AuthProvider"); }
    return context;
};
