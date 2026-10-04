export const validateMobile = (number) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(number);
};

export const validatePincode = (pin) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pin);
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== '';
};

export const validateName = (name) => {
  const regex = /^[a-zA-Z\s]{2,}$/;
  return regex.test(name);
};

export const validateDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};
