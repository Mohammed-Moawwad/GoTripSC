require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function testSignup() {
  try {
    console.log('🔍 Testing signup directly...\n');
    
    // Create connection
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    console.log('✅ Connected to database');
    
    // Test data
    const userData = {
      first_name: 'TestUser',
      last_name: 'Testing',
      email: 'testdirect@test.com',
      phone: '0533333333',
      birth_date: '1999-07-01',
      password: 'Test123#'
    };
    
    console.log('\n📝 User data:', userData);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    console.log('\n🔒 Password hashed successfully');
    
    // Generate user ID
    const userId = `USR${Date.now()}${Math.floor(Math.random() * 1000)}`;
    console.log('🆔 Generated user ID:', userId);
    
    // Try to insert
    console.log('\n💾 Attempting to insert user...');
    const [result] = await conn.execute(
      `INSERT INTO users 
       (user_id, first_name, last_name, email, phone, birth_date, password_hash, status, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', 'user')`,
      [
        userId,
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone,
        userData.birth_date,
        hashedPassword
      ]
    );
    
    console.log('\n✅ User inserted successfully!');
    console.log('Result:', result);
    
    await conn.end();
    
  } catch (error) {
    console.error('\n❌ Error occurred:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('SQL State:', error.sqlState);
    console.error('SQL Message:', error.sqlMessage);
    console.error('\nFull error:', error);
  }
}

testSignup();
