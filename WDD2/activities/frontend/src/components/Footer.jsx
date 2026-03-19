import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="landing-footer">
            <div className="footer-content">
                <p className="footer-brand">ShopFlow</p>
                <p className="footer-copy">{`Curated essentials, delivered with care. Copyright ${year} ShopFlow.`}</p>
            </div>
        </footer>
    );
};

export default Footer;
