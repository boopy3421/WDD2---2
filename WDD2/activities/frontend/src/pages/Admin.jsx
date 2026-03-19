import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import {
    createProductAdmin,
    deleteProductAdmin,
    getProducts,
    updateProductAdmin,
} from '../services/api';
import './Admin.css';

const initialForm = {
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    countInStock: '',
};

const Admin = () => {
    const { isLoggedIn, isAdmin, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            setMessage(error.message || 'Failed to load products.');
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        if (!isLoggedIn || !isAdmin) {
            setMessage('Admin access required.');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...form,
                price: Number(form.price),
                countInStock: Number(form.countInStock),
            };

            if (editingId) {
                await updateProductAdmin(editingId, payload, user.token);
                setMessage('Product updated successfully.');
            } else {
                await createProductAdmin(payload, user.token);
                setMessage('Product created successfully.');
            }

            resetForm();
            await loadProducts();
        } catch (error) {
            setMessage(error.message || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (product) => {
        setEditingId(product._id);
        setForm({
            name: product.name || '',
            category: product.category || '',
            price: String(product.price ?? ''),
            description: product.description || '',
            image: product.image || '',
            countInStock: String(product.countInStock ?? ''),
        });
    };

    const handleDelete = async (productId) => {
        if (!isLoggedIn || !isAdmin) {
            setMessage('Admin access required.');
            return;
        }

        try {
            await deleteProductAdmin(productId, user.token);
            setMessage('Product deleted successfully.');
            await loadProducts();
        } catch (error) {
            setMessage(error.message || 'Failed to delete product.');
        }
    };

    return (
        <>
            <Header />
            <main className="admin-page">
                <section className="admin-panel">
                    <h1 className="admin-title">Admin Product Manager</h1>
                    <p className="admin-subtitle">Create, update, and delete products in your catalog.</p>

                    {!isLoggedIn ? <p className="admin-alert">Please log in first.</p> : null}
                    {isLoggedIn && !isAdmin ? (
                        <p className="admin-alert">Your account is not an admin. Update role to Admin in MongoDB.</p>
                    ) : null}
                    {message ? <p className="admin-alert">{message}</p> : null}

                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-grid">
                            <input
                                placeholder="Product name"
                                value={form.name}
                                onChange={handleChange('name')}
                                required
                            />
                            <input
                                placeholder="Category"
                                value={form.category}
                                onChange={handleChange('category')}
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Price"
                                value={form.price}
                                onChange={handleChange('price')}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={form.countInStock}
                                onChange={handleChange('countInStock')}
                                required
                            />
                            <input
                                placeholder="Image URL"
                                value={form.image}
                                onChange={handleChange('image')}
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={handleChange('description')}
                            />
                        </div>

                        <div className="admin-actions">
                            <Button type="submit" loading={loading}>
                                {editingId ? 'Update Product' : 'Add Product'}
                            </Button>
                            {editingId ? (
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Cancel Edit
                                </Button>
                            ) : null}
                        </div>
                    </form>

                    <section className="admin-products">
                        {products.map((product) => (
                            <article className="admin-product" key={product._id}>
                                <img
                                    src={product.image || 'https://via.placeholder.com/320x220?text=No+Image'}
                                    alt={product.name}
                                />
                                <h3>{product.name}</h3>
                                <p>{product.category}</p>
                                <p>${Number(product.price).toFixed(2)}</p>
                                <p>Stock: {product.countInStock}</p>
                                <div className="admin-product-actions">
                                    <Button type="button" onClick={() => startEdit(product)}>
                                        Edit
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={() => handleDelete(product._id)}>
                                        Delete
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </section>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Admin;
