import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { getProductById } from '../services/api';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data);
                setError('');
            } catch (loadError) {
                setError(loadError.message || 'Unable to load product details.');
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    return (
        <>
            <Header />
            <main className="product-details-page">
                <section className="product-details-panel">
                    <Link className="product-details-back" to="/">
                        Back to products
                    </Link>

                    {loading ? <p className="product-details-empty">Loading product details...</p> : null}
                    {error ? <p className="product-details-empty">{error}</p> : null}

                    {!loading && !error && product ? (
                        <div className="product-details-grid">
                            <img
                                className="product-details-image"
                                src={product.image || 'https://via.placeholder.com/680x500?text=No+Image'}
                                alt={product.name}
                            />

                            <div>
                                <h1 className="product-details-title">{product.name}</h1>
                                <p className="product-details-meta">Category: {product.category}</p>
                                <p className="product-details-meta">Stock: {product.countInStock}</p>
                                <p className="product-details-meta">{product.description}</p>
                                <p className="product-details-price">${Number(product.price).toFixed(2)}</p>

                                <Button
                                    variant="secondary"
                                    onClick={() => addToCart(product)}
                                    disabled={product.countInStock === 0}
                                >
                                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ProductDetails;
