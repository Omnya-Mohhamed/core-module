const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const DATA_FILE = path.join(__dirname, "users.json");

// Read users object from users.json
function readUsers() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data || "{}");
}

// Write users object to users.json
function writeUsers(usersObj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(usersObj, null, 2));
}

// Send JSON response cleanly
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // 1) POST /user - Add a new user
  if (method === "POST" && url === "/user") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newUser = JSON.parse(body);
      const users = readUsers();

      // Check if email already exists
      for (const id in users) {
        if (users[id].email === newUser.email) {
          return sendResponse(res, 400, { message: "Email already exists." });
        }
      }

      // Generate next numeric ID
      const existingIds = Object.keys(users).map(Number);
      const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

      users[nextId] = {
        id: nextId,
        name: newUser.name,
        age: newUser.age,
        email: newUser.email,
      };

      writeUsers(users);
      return sendResponse(res, 201, { message: "User added successfully." });
    });
  }

  // 2) PATCH /user/:id - Update user by ID
  else if (method === "PATCH" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const updates = JSON.parse(body);
      const users = readUsers();

      if (!users[id]) {
        return sendResponse(res, 404, { message: "User ID not found." });
      }

      // Update provided fields
      if (updates.name !== undefined) users[id].name = updates.name;
      if (updates.age !== undefined) users[id].age = updates.age;
      if (updates.email !== undefined) users[id].email = updates.email;

      writeUsers(users);
      return sendResponse(res, 200, { message: "User age updated successfully." });
    });
  }

  // 3) DELETE /user/:id - Delete user by ID
  else if (method === "DELETE" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    const users = readUsers();

    if (!users[id]) {
      return sendResponse(res, 404, { message: "User ID not found." });
    }

    delete users[id];
    writeUsers(users);
    return sendResponse(res, 200, { message: "User deleted successfully." });
  }

  // 4) GET /user - Get all users
  else if (method === "GET" && url === "/user") {
    const users = readUsers();
    return sendResponse(res, 200, Object.values(users));
  }

  // 5) GET /user/:id - Get user by ID
  else if (method === "GET" && url.startsWith("/user/")) {
    const id = url.split("/")[2];
    const users = readUsers();

    if (!users[id]) {
      return sendResponse(res, 404, { message: "User not found." });
    }

    return sendResponse(res, 200, users[id]);
  }

  // Fallback for unknown routes
  else {
    return sendResponse(res, 404, { message: "Route not found." });
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});