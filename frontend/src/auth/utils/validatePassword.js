 const validatePassword = (password) => {
    const errors = [];
    const passMinLength = 8;
  
    if (password.length < passMinLength) {
      errors.push(`Password should have a minimum length of ${passMinLength}`);
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push('Password must contain at least one alphabet');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    if (/\s/.test(password)) {
      errors.push('Password cannot contain spaces');
    }
  
    return errors;
  };
  

export default validatePassword