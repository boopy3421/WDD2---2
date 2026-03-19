import './Input.css';

const Input = ({ label, id, error, ...props }) => {
    return (
        <div className="input-group">
            <label className="input-label" htmlFor={id}>
                {label}
            </label>
            <input id={id} className={`input-field ${error ? 'input-error' : ''}`} {...props} />
            {error ? <span className="error-message">{error}</span> : null}
        </div>
    );
};

export default Input;
