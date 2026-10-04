export const formatPrice = (price) => {
  if (price === null || price === undefined) return '₹0';
  return '₹' + Number(price).toLocaleString('en-IN');
};

/* ---------------- contact / messaging ---------------- */

export const BUSINESS_PHONE = '8237739994';
export const COUNTRY_CODE = '91';
export const BUSINESS_PHONE_E164 = `+${COUNTRY_CODE}${BUSINESS_PHONE}`;

// Accepts 10-digit, 0-prefixed or already country-coded numbers
export const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `${COUNTRY_CODE}${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `${COUNTRY_CODE}${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith(COUNTRY_CODE)) return digits;
  return digits;
};

// api.whatsapp.com is the universal endpoint: it hands off to the app on mobile
// and falls back to WhatsApp Web on desktop.
export const generateWhatsAppLink = (phone, message) => {
  const to = normalizePhone(phone);
  const text = encodeURIComponent(message || '');
  return `https://api.whatsapp.com/send/?phone=${to}&text=${text}`;
};

// SMS is the fallback that needs no WhatsApp account/login at all
export const generateSmsLink = (phone, message) =>
  `sms:+${normalizePhone(phone)}${message ? `?body=${encodeURIComponent(message)}` : ''}`;

export const generateCallLink = (phone) => `tel:+${normalizePhone(phone)}`;

const whatsappIntro = (name = 'Raj Enterprises') => `Hi ${name}!`;

// Built after a booking succeeds so the customer can forward it anywhere
export const buildBookingMessage = ({ ticketId, name, serviceType, mobile, address, preferredDate }) =>
  [
    whatsappIntro(),
    'I have booked an RO service request on your website.',
    ticketId ? `Ticket ID: ${ticketId}` : null,
    name ? `Name: ${name}` : null,
    mobile ? `Mobile: ${mobile}` : null,
    serviceType ? `Service: ${serviceType}` : null,
    preferredDate ? `Preferred date: ${preferredDate}` : null,
    address ? `Address: ${address}` : null
  ]
    .filter(Boolean)
    .join('\n');

export const buildEnquiryMessage = ({ name, mobile, subject, message }) =>
  [
    whatsappIntro(),
    'I have a question about your RO services.',
    name ? `Name: ${name}` : null,
    mobile ? `Mobile: ${mobile}` : null,
    subject ? `Subject: ${subject}` : null,
    message ? `Message: ${message}` : null
  ]
    .filter(Boolean)
    .join('\n');

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getDiscountPercentage = (mrp, offerPrice) => {
  if (!mrp || !offerPrice || mrp <= offerPrice) return 0;
  return Math.round(((mrp - offerPrice) / mrp) * 100);
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Maps a backend Product document to the shape used by the UI components
export const mapProduct = (p) => {
  if (!p) return null;
  const specs = {
    filtrationStages: p.filtrationStages,
    warranty: p.warranty,
    inputTDS: p.inputTDS,
    flowRate: p.flowRate,
    purificationType: Array.isArray(p.purificationType)
      ? p.purificationType.join(', ')
      : p.purificationType,
    dimensions: p.dimensions && p.dimensions.length
      ? `${p.dimensions.length} x ${p.dimensions.width || '-'} x ${p.dimensions.height || '-'} mm`
      : undefined
  };

  return {
    id: p._id || p.id,
    name: p.name,
    brand: p.brand,
    model: p.model,
    price: p.hasOffer && p.offerPrice ? p.offerPrice : p.price,
    mrp: p.mrp || p.price,
    shortDesc: p.shortDescription || p.description,
    description: p.description,
    category: p.category,
    technology: p.technology,
    storageCapacity: p.storage,
    filters: p.filters || [],
    features: p.features || [],
    certifications: p.certifications || [],
    variants: p.variants || [],
    specs: Object.fromEntries(Object.entries(specs).filter(([, v]) => v !== undefined && v !== null && v !== ''))
  };
};

// Canonical service types accepted by the backend enum
export const SERVICE_TYPES = [
  'RO Installation',
  'RO Repair',
  'RO Servicing',
  'AMC',
  'Filter Replacement',
  'Water Treatment',
  'Water Testing',
  'Other'
];

// Normalizes legacy/query-string service labels to the backend enum
export const normalizeServiceType = (value) => {
  if (!value) return '';
  const map = {
    Installation: 'RO Installation',
    Repair: 'RO Repair',
    Servicing: 'RO Servicing',
    'General Servicing': 'RO Servicing',
    FilterReplacement: 'Filter Replacement',
    'AMC Request': 'AMC',
    'Commercial RO': 'Water Treatment'
  };
  if (SERVICE_TYPES.includes(value)) return value;
  return map[value] || 'Other';
};
