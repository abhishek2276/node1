// Import the necessary modules
const jwt = require('jsonwebtoken');

// Replace 'your-secret-key' with the new secret key
const secretKey = 'your-new-secret-key'; // Change this to your actual secret key

// Function to generate a JWT token
const generateToken = (user) => {
  const token = jwt.sign({ user }, secretKey, { expiresIn: '24h' });
  console.log(token)

  return token;
};

// Function to verify a JWT token
const verifyToken = (request, response, next) => {
  const token = request.headers.authorization;
  console.log(token)

  if (!token) {
    return response.status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
    request.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Export the functions for use in your routes or middleware
module.exports = {
  generateToken,
  verifyToken,
};
