const validatePassword = (password, confirmPassword) => {
  const errors = {};

  const passMinLength = 8;

  if (password.length < passMinLength) {
    errors.password = `Password should have a minimum length of ${passMinLength}`;
  }
  if (!/[A-Za-z]/.test(password)) {
    errors.password = 'Password must contain at least one alphabet';
  }
  if (!/\d/.test(password)) {
    errors.password = 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.password = 'Password must contain at least one special character';
  }
  if (/\s/.test(password)) {
    errors.password = 'Password cannot contain spaces';
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export default validatePassword;
