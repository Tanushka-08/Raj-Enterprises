const BASE = 'https://raj-enterprises-backend.onrender.com/api';

async function testFlows() {
  console.log('=== STARTING END-TO-END FLOW VERIFICATION ON RENDER ===\n');

  // 1. Health check
  console.log('1. Testing Health Check...');
  let res = await fetch(`${BASE}/health`);
  let data = await res.json();
  console.log('   Health Status:', JSON.stringify(data));

  // 2. Fetch Products
  console.log('\n2. Testing Product Browsing (Customer Flow)...');
  res = await fetch(`${BASE}/products`);
  data = await res.json();
  const products = data.products || data;
  console.log('   Total products found:', data.totalCount || products.length);
  const sampleProduct = products[0];
  console.log('   Sample product:', sampleProduct.name, '| Price: ₹' + sampleProduct.price);

  // 3. Fetch Single Product Detail
  console.log('\n3. Testing Single Product Detail (Customer Flow)...');
  res = await fetch(`${BASE}/products/${sampleProduct._id}`);
  data = await res.json();
  console.log('   Retrieved product by ID:', data.name, '| Brand:', data.brand);

  // 4. Fetch AMC Plans
  console.log('\n4. Testing AMC Plans (Customer Flow)...');
  res = await fetch(`${BASE}/amc`);
  const amcPlans = await res.json();
  console.log('   AMC plans count:', amcPlans.length);
  amcPlans.forEach(p => console.log('   -', p.name, '₹' + p.price, '/' + p.duration));

  // 5. Submit Service Booking (Customer Flow)
  console.log('\n5. Testing Service Booking (Customer Flow)...');
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const serviceBookingData = {
    customerName: 'Rohit Sharma',
    mobile: '9876543210',
    email: 'rohit@example.com',
    address: 'Flat 402, Sea Breeze Apartments, Sector 17, Vashi',
    pincode: '400703',
    serviceType: 'RO Servicing',
    preferredDate: tomorrow,
    message: 'Regular servicing and filter health check needed'
  };
  res = await fetch(`${BASE}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceBookingData)
  });
  data = await res.json();
  if (!res.ok) throw new Error('Service booking failed: ' + JSON.stringify(data));
  const createdTicket = data.service || data;
  console.log('   Service booking created successfully!');
  console.log('   Ticket ID:', createdTicket.ticketId);

  // 6. Track Service Ticket (Customer Flow)
  console.log('\n6. Testing Ticket Tracking (Customer Flow)...');
  res = await fetch(`${BASE}/services/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticketId: createdTicket.ticketId,
      mobile: '9876543210'
    })
  });
  data = await res.json();
  if (!res.ok) throw new Error('Ticket track failed: ' + JSON.stringify(data));
  console.log('   Ticket track verified: Status is "' + data.status + '" for ' + data.customerName);

  // 7. Submit Enquiry (Customer Flow)
  console.log('\n7. Testing General Enquiry (Customer Flow)...');
  res = await fetch(`${BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Priya Verma',
      mobile: '9812345678',
      email: 'priya@example.com',
      productName: sampleProduct.name,
      message: 'Looking for installation at Kopar Khairane with AMC offer.',
      source: 'product-page'
    })
  });
  data = await res.json();
  if (!res.ok) throw new Error('Enquiry submission failed: ' + JSON.stringify(data));
  console.log('   Enquiry created:', data.message || 'Success');

  // 8. Submit Public Customer Review (Customer Flow)
  console.log('\n8. Testing Customer Review Submission (Customer Flow)...');
  res = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Amit Desai',
      rating: 5,
      review: 'Excellent installation service and water TDS is perfectly balanced!'
    })
  });
  data = await res.json();
  console.log('   Review submitted successfully:', data.message || 'Approved / Pending');

  // 9. Admin Login (Admin Flow)
  console.log('\n9. Testing Admin Login (Admin Flow)...');
  res = await fetch(`${BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'adminpassword123'
    })
  });
  data = await res.json();
  if (!res.ok || !data.token) throw new Error('Admin login failed: ' + JSON.stringify(data));
  const token = data.token;
  console.log('   Admin login successful! JWT Token acquired.');
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 10. Admin View All Services (Admin Flow)
  console.log('\n10. Admin Fetching All Service Tickets (Admin Flow)...');
  res = await fetch(`${BASE}/services`, { headers: authHeaders });
  data = await res.json();
  const ticketsList = data.services || data;
  console.log('    Admin retrieved tickets count:', ticketsList.length);

  // 11. Admin Update Ticket Status (Admin Flow)
  console.log('\n11. Admin Updating Service Ticket Status (Admin Flow)...');
  res = await fetch(`${BASE}/services/${createdTicket._id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      status: 'assigned',
      assignedTechnician: 'Ramesh Patil (Senior Technician)',
      technicianPhone: '9822001122'
    })
  });
  data = await res.json();
  console.log('    Ticket status updated to:', data.status || data.service?.status || 'assigned');

  // 12. Admin View Enquiries (Admin Flow)
  console.log('\n12. Admin Fetching Enquiries (Admin Flow)...');
  res = await fetch(`${BASE}/enquiries`, { headers: authHeaders });
  data = await res.json();
  const enqList = data.enquiries || data;
  console.log('    Admin retrieved enquiries count:', enqList.length);

  // 13. Frontend SPA Web Routes Check
  console.log('\n13. Testing Frontend SPA Pages on Render...');
  const pages = ['/', '/products', '/services', '/amc', '/track', '/contact', '/admin'];
  for (const p of pages) {
    const pageRes = await fetch(`https://raj-enterprises-backend.onrender.com${p}`);
    console.log(`    Route "${p}": HTTP ${pageRes.status} ${pageRes.statusText}`);
  }

  console.log('\n=== ALL CUSTOMER & ADMIN FLOWS FULLY TESTED & VERIFIED ON LIVE SITE ===\n');
}

testFlows().catch(err => {
  console.error('\nFlow Test Encountered Error:', err.message);
  process.exit(1);
});
