import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
function PrivateRoute({ children,acceptedRole }) {  //userRole prop can be used to restrict access based on user roles (e.g., admin, user)
    const { isAuthenticated,user } = useAuth();
    if(!isAuthenticated) {
        return (
            <div>
                <Navigate to="/login" replace/> // Redirect to login page if not authenticated, clear history to prevent back navigation
            </div>
        );
    }
    if(acceptedRole && user?.role !== acceptedRole) { // If acceptedRole is specified and user's role doesn't match, show access denied message
        return (
            <div>
                <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }
    
    return children; // If authenticated and has correct role, render the child components
}
export default PrivateRoute;