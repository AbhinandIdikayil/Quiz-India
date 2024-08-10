
function validateName(name) {
    if (!name) return false;
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name.trim());
  }

  function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email.trim().toLowerCase());
  }

  function validatePassword(password) {
    if (!password) return false;
    
    if (password.length < 6) return false;
    
    if (!/[A-Z]/.test(password)) return false;
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return false;
    
    return true;
  }
  
  module.exports = {
    validateName,
    validateEmail,
    validatePassword
  };