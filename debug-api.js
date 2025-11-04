// Debug script to test database connection
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test product count
    const count = await prisma.product.count();
    console.log('✅ Product count:', count);
    
    // Test product query
    const products = await prisma.product.findMany({
      include: { 
        inventory: true, 
        categories: { 
          include: { category: true } 
        } 
      }
    });
    console.log('✅ Products found:', products.length);
    
    if (products.length > 0) {
      console.log('Sample product:', {
        title: products[0].title,
        price: products[0].priceCents,
        inventory: products[0].inventory?.quantity
      });
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();




