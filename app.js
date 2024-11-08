const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;  // Change to an available port if needed

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Define database file path
const dbFilePath = path.join(__dirname, 'database.json');

// Helper functions to read and write to the database file
function readDatabase() {
    const data = fs.readFileSync(dbFilePath);
    return JSON.parse(data);
}

function writeDatabase(data) {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

// Home route: redirect to register page or serve a home page
app.get('/', (req, res) => {
    res.redirect('/register');  // You can also use `res.sendFile(path.join(__dirname, 'index.html'));` if you create `index.html`
});

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const database = readDatabase();

    if (database.users.some(user => user.username === username)) {
        return res.json({ message: 'Username already exists' });
    }

    database.users.push({ username, password });
    writeDatabase(database);

    res.json({ message: 'Registration successful!' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const database = readDatabase();

    const user = database.users.find(user => user.username === username && user.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

// Serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve the welcome page
app.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});

// Initialize the JSON database file if it doesn't exist
if (!fs.existsSync(dbFilePath)) {
    writeDatabase({ users: [] });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
