import jwt from 'jsonwebtoken';

const generateToken = (userId: string | unknown, email: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined');
  }

  return jwt.sign(
    { userId: String(userId), email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default generateToken;
