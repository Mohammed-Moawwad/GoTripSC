// Test the /api/auth/users endpoint
const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/auth/users",
  method: "GET",
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS:`, res.headers);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("\nRESPONSE BODY:");
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on("error", (error) => {
  console.error("Error:", error.message);
});

req.end();
