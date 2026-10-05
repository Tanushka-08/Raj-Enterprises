const { check, validationResult } = require('express-validator');

const MOBILE = /^[6-9]\d{9}$/;
const PINCODE = /^[1-9]\d{5}$/;

const validateServiceBooking = [
  check('customerName', 'Name is required').trim().not().isEmpty().isLength({ max: 80 }),
  check('mobile', 'Valid 10-digit mobile number is required').trim().matches(MOBILE),
  check('email', 'Please include a valid email').optional({ checkFalsy: true }).isEmail(),
  check('address', 'Address is required').trim().not().isEmpty().isLength({ max: 400 }),
  check('pincode', 'Valid 6-digit pincode is required').trim().matches(PINCODE),
  check('customerType', 'Invalid customer type').optional().isIn(['residential', 'commercial', 'office']),
  check('serviceType', 'Service type is required').trim().not().isEmpty()
    .isIn(['RO Installation', 'RO Repair', 'RO Servicing', 'AMC', 'Filter Replacement', 'Water Treatment', 'Water Testing', 'Other']),
  check('preferredDate', 'Preferred date is required').trim().not().isEmpty().isISO8601()
    // A visit cannot be booked in the past. Compared against the start of today
    // so "today" is still accepted.
    .custom((value) => {
      const requested = new Date(value);
      if (Number.isNaN(requested.getTime())) throw new Error('Preferred date is not a valid date');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (requested < today) throw new Error('Preferred date cannot be in the past');
      return true;
    }),
  check('message', 'Message is too long').optional({ checkFalsy: true }).isLength({ max: 1000 })
];

const validateTicketTrack = [
  check('ticketId', 'Ticket ID is required').trim().not().isEmpty().isLength({ max: 40 }),
  // Visitors paste numbers in many formats ("+91 98765 43210", "09876543210"),
  // so the tracker accepts those and the controller normalises to 10 digits.
  check('mobile', 'Valid 10-digit mobile number is required')
    .trim()
    .custom((value) => {
      const digits = String(value).replace(/\D/g, '').replace(/^91/, '').replace(/^0(?=\d{10}$)/, '');
      return /^[6-9]\d{9}$/.test(digits);
    })
];

const validateEnquiry = [
  check('customerName', 'Name is required').trim().not().isEmpty().isLength({ max: 80 }),
  check('mobile', 'Valid mobile number is required').trim().matches(MOBILE),
  check('email', 'Please include a valid email').optional({ checkFalsy: true }).isEmail(),
  check('productName', 'Product name is required').optional({ checkFalsy: true }).isLength({ max: 120 }),
  check('message', 'Message is too long').optional({ checkFalsy: true }).isLength({ max: 2000 }),
  check('source', 'Invalid source').optional().isIn(['product-page', 'contact', 'whatsapp', 'other'])
];

const validatePublicReview = [
  check('customerName', 'Name is required').trim().not().isEmpty().isLength({ max: 80 }),
  check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
  check('review', 'Review text is required').trim().not().isEmpty().isLength({ max: 1000 })
];

const validateCustomer = [
  check('name', 'Name is required').trim().not().isEmpty().isLength({ max: 80 }),
  check('mobile', 'Valid 10-digit mobile number is required').trim().matches(MOBILE),
  check('email', 'Please include a valid email').optional({ checkFalsy: true }).isEmail()
];

const validateProduct = [
  check('name', 'Product name is required').trim().not().isEmpty().isLength({ max: 120 }),
  check('brand', 'Brand is required').trim().not().isEmpty().isLength({ max: 80 }),
  check('price', 'Price is required').isNumeric({ min: 0 }),
  check('category', 'Invalid category').optional().isIn(['domestic-ro', 'uv-purifier'])
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
  validateTicketTrack,
  validateEnquiry,
  validatePublicReview,
  validateCustomer,
  validateProduct,
  handleValidationErrors
};
