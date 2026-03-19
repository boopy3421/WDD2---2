import './Features.css';

const features = [
    {
        icon: '🔐',
        title: 'JWT Authentication',
        description: 'Secure sign-up and login flow connected to your backend token endpoints.',
    },
    {
        icon: '🛒',
        title: 'Persistent Cart',
        description: 'Cart data is saved in local storage so items remain across refreshes.',
    },
    {
        icon: '📦',
        title: 'REST Product API',
        description: 'Products are loaded from MongoDB through /api/v1/products.',
    },
];

const Features = () => {
    return (
        <section className="features-section" id="features">
            <div className="features-inner">
                <h2 className="features-title">Core Features</h2>
                <p className="features-subtitle">Everything required by your finals specification.</p>

                <div className="features-grid">
                    {features.map((feature) => (
                        <article className="feature-card" key={feature.title}>
                            <div className="feature-icon" aria-hidden="true">
                                {feature.icon}
                            </div>
                            <h3 className="feature-card-title">{feature.title}</h3>
                            <p className="feature-card-text">{feature.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
