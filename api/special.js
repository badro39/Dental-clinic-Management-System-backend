// express
import express from 'express';

// jwt
import { jwt } from 'jsonwebtoken';

// Controllers
import { getNotificationByPatientId } from '../controllers/Notification';

// middleware
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get(
  '/Notification/:patientId',
  authorize(['patient']),
  getNotificationByPatientId,
);

router.post('/refreshCookie', async (req, res) => {
  const oldToken = req.cookies.oldToken;
  if (!oldToken) return res.status(401).json({ err: 'Token expired!' });
  try {
    const decode = jwt.verify(oldToken, process.env.JWT_KEY);

    const { id, email, role } = decode;

    // create new token

    const newToken = jwt.sign({ id, email, role }, process.env.JWT_KEY, {
      expiresIn: '1h',
    });

    // set new token in cookie
    return res
      .cookie('token', newToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
      })
      .status(200)
      .json({ message: 'Token refreshed successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res
        .clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'prod',
          sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
        })
        .status(401)
        .json({ err: 'Token expired!' });
    }
    return res.status(500).json({ err: 'Internal server error' });
  }
});
