import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import OwnerDashboard from './pages/OwnerDashboard';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './Context/AuthContext';

// mock components incase we don't have actual implementations yet
const Login = () => <h2>Login Page</h2>;
const MyMatches = () => <h2>Match Organizer Dashboard</h2>;
const NotFound = () => <h2>404 - Page Not Found</h2>;

function App() {
 const {isAuthenticated, user,logout } = useAuth();
  return (
   
    <BrowserRouter>
     
    </BrowserRouter>
  );
}

export default App;