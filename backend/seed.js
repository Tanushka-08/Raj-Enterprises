require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const AMCPlan = require('./models/AMCPlan');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/raj-enterprises');
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await Admin.deleteMany();
    await Product.deleteMany();
    await AMCPlan.deleteMany();
    console.log('Existing data cleared');

    // Create Admin (credentials configurable via .env; defaults are for local development only)
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      email: process.env.ADMIN_EMAIL || 'aquarajenterprises@gmail.com'
    });
    await admin.save();
    console.log('Admin created');

    // Create AMC Plans
    const amcPlans = [
      {
        name: 'Domestic Basic AMC',
        type: 'basic',
        price: 2499,
        duration: '1 Year',
        features: ['2 Scheduled Service Visits', 'Basic Filter Cleaning', 'Filter Health Check', 'Water Quality Testing', 'Phone Support'],
        serviceVisits: 2,
        filterReplacement: false,
        prioritySupport: false
      },
      {
        name: 'Domestic Premium AMC',
        type: 'premium',
        price: 4999,
        duration: '1 Year',
        features: ['4 Scheduled Service Visits', 'Filter Replacements (Sediment + Pre-Carbon + Post-Carbon)', 'Priority Same-Day Support', 'Annual Comprehensive Health Check', 'Water Quality Testing', 'Emergency Visit Coverage', '10% Discount on Additional Parts'],
        serviceVisits: 4,
        filterReplacement: true,
        prioritySupport: true
      }
    ];
    await AMCPlan.insertMany(amcPlans);
    console.log('AMC Plans created');

    // Create Products
    const products = [
      {
        name: 'AROMA Smart Touch', brand: 'AROMA', model: 'Smart Touch', category: 'domestic-ro',
        shortDescription: 'Premium RO water purifier with Smart LED Display and Zinc + Copper + Alkaline enrichment',
        description: 'The AROMA Smart Touch is a premium domestic RO water purifier featuring an innovative Smart LED Display that shows real-time purification status. Powered by advanced Zinc, Copper, and Alkaline enrichment technology, it delivers mineral-rich, healthy drinking water for your family. Patent Design No. 426065-001.',
        variants: [{variantName: 'Black', colorName: 'Black', colorCode: '#1a1a2e', image: '/images/products/02783140-6398-4084-9e82-3bd8c743c918.jfif', sku: 'AROMA-BLK'}, {variantName: 'White', colorName: 'White', colorCode: '#f5f5f5', image: '/images/products/c875199e-61b4-45b8-a477-d47e68205b45.jfif', sku: 'AROMA-WHT'}],
        price: 14999, mrp: 18999, offerPrice: 14999, hasOffer: true,
        storage: '12 Litres', technology: 'Zinc + Copper + Alkaline', filtrationStages: 7,
        filters: ['PP Filter', 'Sediment Filter', 'Pre-Carbon Filter', 'RO Membrane', 'Post-Carbon Filter', 'Zinc Cartridge', 'Copper + Alkaline Cartridge'],
        warranty: '1 Year Warranty', certifications: ['Patent Design No. 426065-001'],
        features: ['Smart LED Display', 'Power/Purifying/Tank Full Indicators', 'Zinc + Copper + Alkaline Enrichment', 'Smart Touch Controls', 'Powered By Innovation', 'Elegant Premium Design'],
        purificationType: ['RO', 'UV', 'UF', 'TDS']
      },
      {
        name: 'AquaX Swift', brand: 'AquaX Series', model: 'Swift', category: 'domestic-ro',
        shortDescription: 'Premium water purifier with 3-in-1 Zinc, Copper & Alkaline protection and transparent design',
        description: 'The AquaX Swift from AquaX Series is a premium residential RO water purifier enriched with Zinc, Copper & Alkaline ions. Featuring a stunning transparent top revealing copper-coloured filter canisters, it combines cutting-edge purification with elegant design. Defined by Class.',
        variants: [{variantName: 'Black Copper', colorName: 'Black & Copper', colorCode: '#2d1810', image: '/images/products/1fc212e0-6eb4-4395-97ad-fac0cefe7ad6.jfif', sku: 'AQX-SWIFT'}],
        price: 16999, mrp: 21999, offerPrice: 16999, hasOffer: true,
        storage: '15 Litres', technology: 'RO + 3-in-1 Zinc/Copper/Alkaline', filtrationStages: 12,
        filters: ['PP Filter', 'Sediment Filter', 'Pre-Carbon Block', 'Anti-Scalant', 'RO Membrane', 'Post-Carbon', 'Zinc Cartridge', 'Copper Cartridge', 'Alkaline Cartridge', 'UV Disinfection', 'UF Membrane', 'TDS Controller'],
        warranty: '1 Year Warranty', certifications: ['RoHS', 'CE', 'pH 9+', 'International Standards'],
        features: ['3-in-1 Zinc Copper Alkaline Protection', 'Premium Water Purifier', 'Transparent Top Design', 'Copper Filter Canisters', 'Innovation for Future', 'TDS/UF/UV/RO Indicators'],
        purificationType: ['RO', 'UV', 'UF', 'TDS']
      },
      {
        name: 'AquaS Plus+', brand: 'AquaS', model: 'Plus+', category: 'domestic-ro',
        shortDescription: 'Multi-stage copper & alkaline water purifier with 100 GPD RO membrane',
        description: 'The AquaS Plus+ is a multi-stage residential RO water purifier enriched with Zinc, Copper & Alkaline minerals. Featuring a powerful 100 GPD RO membrane and Reverse Osmosis Ultra Violet purification, it ensures pure, healthy water. Wall-mounted with transparent top design. Distributed by Raj Enterprises.',
        variants: [{variantName: 'White Blue', colorName: 'White & Blue', colorCode: '#e8f0fe', image: '/images/products/34c2471d-b5c6-4b6a-99c4-19eab0becc01.jfif', sku: 'AQUAS-PLUS'}],
        price: 11999, mrp: 15999, offerPrice: 11999, hasOffer: true,
        storage: '12 Litres', technology: 'RO + UV + Copper + Alkaline', filtrationStages: 6,
        filters: ['Sediment Filter', 'Pre-Carbon Filter', 'RO Membrane (100 GPD)', 'UV Disinfection', 'Alkaline Cartridge', 'Copper Cartridge'],
        warranty: '1 Year Warranty', certifications: ['ISO'],
        features: ['100 GPD RO Membrane', 'Reverse Osmosis Ultra Violet', 'Wall-Mounted Design', 'Transparent Top', 'Multi-Stage Copper + Alkaline Purification', 'RO/UV/UF/TDS/ALK/CU Indicators'],
        purificationType: ['RO', 'UV', 'UF', 'TDS', 'ALK', 'CU']
      },
      {
        name: 'Nile Aqua 4070', brand: 'Nile', model: 'Aqua 4070', category: 'domestic-ro',
        shortDescription: 'Smart designer water purifier with 3-in-1 Copper, Zinc & Alkaline enrichment',
        description: 'The Nile Aqua 4070 is a smartly designed water purifier that combines elegant aesthetics with powerful 3-in-1 Copper, Zinc & Alkaline enrichment technology. Available in Matt and Elegant Design editions across multiple stunning colours. Smart Designs for Spaces standing out & shining. From Nile — the name inspires trust.',
        variants: [{variantName: 'Sand Velvet (Matt Edition)', colorName: 'Sand Velvet', colorCode: '#c4b39a', image: '/images/products/5f954f92-2f70-417c-b576-a768dcfd9b59.jfif', sku: 'NILE-901'}, {variantName: 'Candy White Blue (Elegant)', colorName: 'Candy White Blue', colorCode: '#d4e6f1', image: '/images/products/ec79229a-4503-495d-9f41-e5872638df37.jfif', sku: 'NILE-504'}, {variantName: 'Winner Blue (Elegant)', colorName: 'Winner Blue', colorCode: '#aed6f1', image: '/images/products/e42450e1-238c-43a1-b586-29abef737156.jfif', sku: 'NILE-503'}],
        price: 13999, mrp: 17999, offerPrice: 13999, hasOffer: true,
        storage: '10 Litres', technology: '3-in-1 Copper + Zinc + Alkaline', filtrationStages: 7,
        filters: ['PP Filter', 'Sediment Filter', 'Pre-Carbon Filter', 'RO Membrane', 'Post-Carbon', 'Copper + Zinc Cartridge', 'Alkaline Cartridge'],
        warranty: '1 Year Warranty',
        features: ['Smart Designer Body', 'Power/Purifying/Tank Full Indicators', '3-in-1 Copper Zinc Alkaline', 'Matt & Elegant Design Editions', 'The Name Inspires Trust', 'Smart Designs for Modern Spaces'],
        purificationType: ['RO', 'UV', 'UF']
      },
      {
        name: 'Lexpure Shraddha', brand: 'Lexpure', model: 'Shraddha Series', category: 'domestic-ro',
        shortDescription: '5-stage RO+ B12 H2AAA water purifier with 7L storage and certified quality',
        description: 'The Lexpure Shraddha Series is a premium 5-stage water purifier with advanced RO+ B12 H2AAA Technology. Certified by ISI (IS 14349:2023), NSF, ISO 9001:2015, and CE, it delivers the purest water with 18 Ltr/Hr capacity. Compact Sand Beige design with Power, Purifying, and Tank Full indicators.',
        variants: [{variantName: 'Sand Beige', colorName: 'Sand Beige', colorCode: '#d4a574', image: '/images/products/60eedae6-4164-40eb-b205-74761c4243be.jfif', sku: 'LEX-SHRD'}],
        price: 19999, mrp: 19999, hasOffer: false,
        storage: '7 Litres', technology: 'RO+ B12 H2AAA', filtrationStages: 5,
        filters: ['PP Filter', 'Pre Carbon', 'Sediment', 'RO Membrane', 'H2AAA'],
        dimensions: {length: 355, width: 213, height: 460},
        warranty: '1 Year Warranty', certifications: ['ISI (IS 14349:2023)', 'NSF', 'ISO 9001:2015', 'CE'],
        features: ['5 Stage Filtration', 'RO+ B12 H2AAA Technology', '18 Ltr/Hr Capacity', 'Power/Purifying/Tank Full Indicators', 'Compact Sand Beige Design', 'Multiple International Certifications'],
        purificationType: ['RO'], flowRate: '18 Ltr/Hr'
      },
      {
        name: 'Auric AquaFresh', brand: 'Auric', model: 'AquaFresh', category: 'domestic-ro',
        shortDescription: 'Next-generation RO water purifier with unique transparent design',
        description: 'The Auric AquaFresh brings the Technology of Next Generation to your kitchen. Featuring RO+UV+UF+TDS purification with a unique transparent top design and distinctive blue decorative elements. ISO certified quality with a stylish, wall-mounted form factor. Distributed by Raj Enterprises.',
        variants: [{variantName: 'White Blue', colorName: 'White & Blue', colorCode: '#e3f2fd', image: '/images/products/9223f05a-e813-44d6-a60a-ca853afe25dd.jfif', sku: 'AURIC-AF'}],
        price: 9999, mrp: 13999, offerPrice: 9999, hasOffer: true,
        storage: '12 Litres', technology: 'RO + UV + UF + TDS', filtrationStages: 7,
        filters: ['Sediment Filter', 'Pre-Carbon Filter', 'RO Membrane', 'UV Chamber', 'UF Membrane', 'Post-Carbon', 'TDS Controller'],
        warranty: '1 Year Warranty', certifications: ['ISO'],
        features: ['Technology of Next Generation', 'Unique Transparent Design', 'Wall-Mounted', 'RO/UV/UF/TDS Purification', 'Decorative Blue Design Elements', 'ISO Certified'],
        purificationType: ['RO', 'UV', 'UF', 'TDS']
      },
      {
        name: 'Aqua Innovica', brand: 'Aqua Innovica', model: 'Innovica', category: 'domestic-ro',
        shortDescription: 'Compact 9L premium purifier with 3-in-1 Zinc, Copper & Alkaline advanced filtration',
        description: 'Aqua Innovica — Pure Water. Pure Life. A compact, elegantly designed water purifier with 9 Litre storage and multi-stage purification enhanced with 3-in-1 Zinc, Copper & Alkaline advanced filtration. Available in four stunning colour options with Power ON/OFF, Tank Full, and Purifying indicators. Pure. Safe. Healthy.',
        variants: [{variantName: 'Blue Lavender', colorName: 'Blue Lavender', colorCode: '#7986cb', image: '/images/products/9e33eada-a2e3-42d2-b26d-e37f9d642c59.jfif', sku: 'INNO-BLU'}, {variantName: 'Pearl White', colorName: 'Pearl White', colorCode: '#fafafa', image: '/images/products/bac6eb02-6f6a-4ad0-ab69-0b1581acb4a7.jfif', sku: 'INNO-WHT'}, {variantName: 'Titanium Silver', colorName: 'Titanium Silver', colorCode: '#b0bec5', image: '/images/products/c371c8a1-0dda-4b41-a04d-175e0797a6a4.jfif', sku: 'INNO-SLV'}, {variantName: 'Obsidian Rose Gold', colorName: 'Black Rose Gold', colorCode: '#2c2c2c', image: '/images/products/d8f70b80-6f06-4843-85ae-406849752abd.jfif', sku: 'INNO-BRG'}],
        price: 15999, mrp: 19999, offerPrice: 15999, hasOffer: true,
        storage: '9 Litres', technology: '3-in-1 Zinc + Copper + Alkaline', filtrationStages: 8,
        filters: ['Sediment Filter', 'Pre-Carbon Block', 'Anti-Scalant', 'RO Membrane', 'Post-Carbon', 'Zinc Cartridge', 'Copper Cartridge', 'Alkaline Cartridge'],
        warranty: '1 Year Warranty',
        features: ['Compact Design — Saves Space', '9 Litre Storage', 'Multi Stage Purification', 'Advanced Filtration — Zinc Copper Alkaline', 'Power ON/OFF, Tank Full, Purifying Indicators', 'Pure. Safe. Healthy.'],
        purificationType: ['RO', 'UV', 'UF']
      },
      {
        name: 'Purella', brand: 'Purella', model: 'Purella UV', category: 'uv-purifier',
        shortDescription: '3-stage UV residential water system with 5L/min flow rate for low-TDS water',
        description: 'Purella Residential Water Systems — Goodness of Pure Water For A Healthier You. A 3-stage UV purification system that kills bacteria and viruses with a fast 5L per minute flow rate. Recommended for use below 500 TDS input water conditions. Low maintenance with effortless care. Next Level Support for Your Family Health.',
        variants: [{variantName: 'Black Silver', colorName: 'Black & Silver', colorCode: '#37474f', image: '/images/products/WhatsApp Image 2026-10-02 at 3.05.14 PM.jpeg', sku: 'PURELLA-UV'}],
        price: 7999, mrp: 10999, offerPrice: 7999, hasOffer: true,
        storage: 'Tankless (Inline)', technology: 'UV Purification', filtrationStages: 3,
        filters: ['Pre-Sediment Filter', 'Activated Carbon Filter', 'UV Disinfection Chamber'],
        warranty: '1 Year Warranty',
        features: ['3 Stage Purification', 'UV Purification — Kills Bacteria & Viruses', '5L Per Minute Flow Rate', 'Low Maintenance', 'Recommended Below 500 TDS', 'Stainless Steel Mid-Panel', 'Pure & Safe Water', 'Better Taste & Smell'],
        purificationType: ['UV'], flowRate: '5L/min', inputTDS: 'Below 500 TDS'
      }
    ];
    await Product.insertMany(products);
    console.log('Products created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
