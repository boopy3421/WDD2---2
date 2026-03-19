import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data);
                setError('');
            } catch (loadError) {
                setError(loadError.message || 'Unable to load products.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const categories = useMemo(() => {
        const unique = new Set(products.map((product) => product.category || 'General'));
        return ['all', ...unique];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const loweredQuery = query.trim().toLowerCase();

        return products.filter((product) => {
            const matchesQuery =
                !loweredQuery || product.name.toLowerCase().includes(loweredQuery);
            const matchesCategory = category === 'all' || product.category === category;
            return matchesQuery && matchesCategory;
        });
    }, [products, query, category]);

    return (
        <>
            <Header />
            <Hero />
            <main className="products-section" id="products">
                <div className="products-inner">
                    <h2 className="products-title">Product Catalog</h2>
                    <p className="products-subtitle">Search by name and filter by category.</p>

                    <div className="products-toolbar">
                        <input
                            type="text"
                            placeholder="Search product name"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <select value={category} onChange={(event) => setCategory(event.target.value)}>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error ? <p className="empty-products">{error}</p> : null}
                    {loading ? <p className="empty-products">Loading products...</p> : null}

                    {!loading && filteredProducts.length === 0 ? (
                        <p className="empty-products">No products found.</p>
                    ) : null}

                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <article className="product-card" key={product._id}>
                                <Link to={`/product/${product._id}`}>
                                    <img
                                        src={product.image || 'https://via.placeholder.com/640x480?text=No+Image'}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </Link>
                                <h3 className="product-name">
                                    <Link className="product-link" to={`/product/${product._id}`}>
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="product-meta">
                                    {product.category} • Stock: {product.countInStock}
                                </p>
                                <p className="product-meta">{product.description}</p>
                                <p className="product-price">${Number(product.price).toFixed(2)}</p>
                                <Button
                                    variant="secondary"
                                    onClick={() => addToCart(product)}
                                    disabled={product.countInStock === 0}
                                >
                                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Home;
