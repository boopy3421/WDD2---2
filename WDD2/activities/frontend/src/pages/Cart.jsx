import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import './Cart.css';

const Cart = () => {
    const { user, isLoggedIn } = useAuth();
    const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            setMessage('Please log in first before placing an order.');
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            await createOrder({
                user: user._id,
                items: items.map((item) => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });

            clearCart();
            setMessage('Order placed successfully.');
        } catch (error) {
            setMessage(error.message || 'Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="cart-page">
                <section className="cart-panel">
                    <h1 className="cart-title">Shopping Cart</h1>

                    {message ? <p className="cart-message">{message}</p> : null}

                    {items.length === 0 ? (
                        <p className="cart-empty">
                            Your cart is empty. <Link to="/">Browse products</Link>
                        </p>
                    ) : (
                        <>
                            <section className="cart-list">
                                {items.map((item) => (
                                    <article className="cart-item" key={item._id}>
                                        <img
                                            className="cart-item-image"
                                            src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            alt={item.name}
                                        />
                                        <div>
                                            <h3>{item.name}</h3>
                                            <p>{item.category}</p>
                                        </div>
                                        <p>${Number(item.price).toFixed(2)}</p>
                                        <input
                                            className="qty-input"
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(event) => updateQuantity(item._id, event.target.value)}
                                        />
                                        <Button variant="primary" onClick={() => removeFromCart(item._id)}>
                                            Remove
                                        </Button>
                                    </article>
                                ))}
                            </section>

                            <section className="cart-summary">
                                <div className="summary-row">
                                    <span>Total</span>
                                    <strong>${totalPrice.toFixed(2)}</strong>
                                </div>
                                <Button variant="secondary" loading={loading} onClick={handleCheckout}>
                                    Place Order
                                </Button>
                            </section>
                        </>
                    )}
                </section>
            </main>
        </>
    );
};

export default Cart;
