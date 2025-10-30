const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateJWTToken({ account, userData }) {
  const payload = {
    accountId: account._id,
    role: account.role,
    fullName: userData.fullName,
    id: userData.id,
    hospitalId: userData?.hospitalId,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
}

module.exports = { generateJWTToken };
