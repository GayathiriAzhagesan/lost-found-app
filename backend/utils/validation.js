/**
 * Basic Validation and Sanitization Utilities
 */

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

const isNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {
  isValidEmail,
  isNonEmptyString,
};
