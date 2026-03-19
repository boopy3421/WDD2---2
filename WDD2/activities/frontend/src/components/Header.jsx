import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
    const { isLoggedIn, isAdmin, logout } = useAuth();
    const { totalItems } = useCart();

    return (
        <header className="landing-header">
            <div className="header-container">
                <div className="logo">
                    <h2>ShopFlow</h2>
                </div>

                <nav className="navigation">
                    <Link to="/">Home</Link>
                    <Link to="/cart">Cart ({totalItems})</Link>
                    {isAdmin ? <Link to="/admin">Admin</Link> : null}
                </nav>

                <div className="auth-section">
                    {isLoggedIn ? (
                        <button type="button" onClick={logout}>
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
