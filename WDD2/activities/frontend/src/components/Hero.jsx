import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1 className="hero-title">
                    Discover Deals You'll <span className="hero-accent">Love</span>
                </h1>
                <p className="hero-subtitle">
                    Shop trending products, add your favorites to cart, and enjoy a smooth checkout experience.
                </p>

                <div className="hero-cta">
                    <Link className="cta-btn cta-primary" to="/cart">
                        View Cart
                    </Link>
                    <a className="cta-btn cta-outline" href="#products">
                        Shop Now
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
