import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (_error) {
        return res.status(401).json({ message: 'Unauthorized: invalid token.' });
    }
};

export const adminOnly = (req, res, next) => {
    const role = String(req.user?.role || '').toLowerCase();
    if (role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: admin access required.' });
    }

    return next();
};
