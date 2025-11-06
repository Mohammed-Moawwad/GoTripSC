// Quick test for signup fix
async function testSignup() {
  console.log("🧪 Testing Signup Fix...\n");

  const testUser = {
    first_name: "Test",
    last_name: "User",
    email: `test${Date.now()}@example.com`, // Unique email
    password: "test123456"
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Signup Successful!");
      console.log(`   User ID: ${data.data.user.user_id}`);
      console.log(`   Email: ${data.data.user.email}`);
      console.log(`   Token: ${data.data.token.substring(0, 20)}...`);
      console.log("\n🎉 Fix is working! Teammates can now create accounts!");
      process.exit(0);
    } else {
      console.error("❌ Signup Failed:");
      console.error(`   Status: ${response.status}`);
      console.error(`   Message: ${data.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testSignup();
