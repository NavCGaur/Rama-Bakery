const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    


    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log('Token expired');

      return res.status(401).json({ message: 'Token expired' });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log('Invalid token:', error);

    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };