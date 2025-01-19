import { validationResult } from 'express-validator';
import { isStrongPassword, emailValidator, sanitizeInput, isOptional } from '../utils/validators.js';

export const validateUserRegistration = [
  isOptional(['userStatus','userRole']),
  sanitizeInput(['userName', 'firstName', 'lastName', 'userStatus', 'userRole']),
  emailValidator(),
  isStrongPassword(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
 
];
