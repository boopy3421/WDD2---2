import './Card.css';

const Card = ({ title, children }) => {
    return (
        <div className="card-container">
            <div className="card">
                {title ? <h1 className="card-title">{title}</h1> : null}
                {children}
            </div>
        </div>
    );
};

export default Card;
