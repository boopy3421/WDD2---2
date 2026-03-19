import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    loading = false,
    disabled = false,
    onClick,
}) => {
    const className = `btn btn-${variant}`;

    return (
        <button type={type} className={className} disabled={disabled || loading} onClick={onClick}>
            {loading ? <span className="spinner" /> : null}
            {children}
        </button>
    );
};

export default Button;
