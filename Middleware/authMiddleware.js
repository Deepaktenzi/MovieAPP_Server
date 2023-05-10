const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  console.log('Middle ware Called');
  const userToken = req.headers.authorization;

  if (!userToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    const token = userToken.split(' ')[1];
    const rootUser = await jwt.verify(token, process.env.SECRET_KEY);

    req.user = rootUser;
  }
  next();
};
module.exports = authMiddleware;
