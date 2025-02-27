import dotenv from 'dotenv'
dotenv.config()

export default function authenticate(req, res, next){
    const token = req.headers['authorization']; 
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        if (token !== process.env.SECRET_API_KEY) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

