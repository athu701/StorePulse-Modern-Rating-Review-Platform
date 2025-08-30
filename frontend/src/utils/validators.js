export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const validatePassword = (pass) =>
  /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(pass);
