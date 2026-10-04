const { check, validationResult } = require('express-validator');

const validateServiceBooking = [
  check('customerName', 'Name is required').not().isEmpty(),
  check('mobile', 'Valid 10-digit mobile number is required').matches(/^[6-9]\d{9}$/),
  check('email', 'Please include a valid email').optional({ checkFalsy: true }).isEmail(),
  check('address', 'Address is required').not().isEmpty(),
  check('pincode', 'Valid 6-digit pincode is required').matches(/^[1-9]\d{5}$/),
  check('serviceType', 'Service type is required').not().isEmpty(),
  check('preferredDate', 'Preferred date is required').not().isEmpty()
];

const validateEnquiry = [
  check('customerName', 'Name is required').not().isEmpty(),
  check('mobile', 'Valid mobile number is required').not().isEmpty(),
  check('email', 'Please include a valid email').optional({ checkFalsy: true }).isEmail(),
  check('productName', 'Product name is required').optional({ checkFalsy: true })
];

const validateProduct = [
  check('name', 'Product name is required').not().isEmpty(),
  check('brand', 'Brand is required').not().isEmpty(),
  check('price', 'Price is required').isNumeric()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateServiceBooking,
  validateEnquiry,
  validateProduct,
  handleValidationErrors
};
