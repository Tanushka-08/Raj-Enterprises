const generateTicketId = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `RAJ-${yyyy}${mm}${dd}-${random}`;
};

const generateEnquiryId = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `ENQ-${yyyy}${mm}${dd}-${random}`;
};

module.exports = {
  generateTicketId,
  generateEnquiryId
};
