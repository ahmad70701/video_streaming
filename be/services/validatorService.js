import { body } from 'express-validator';

export const isStrongPassword = () => 
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter');

export const emailValidator = () => 
  body('email').isEmail().withMessage('Invalid email');

export const sanitizeInput = (fieldName) =>
  body(fieldName).trim().escape();

export const isOptional = (fieldName) =>
  body(fieldName).optional();
