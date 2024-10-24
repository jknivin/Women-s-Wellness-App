const express = require('express');
const fs = require('fs');
const xlsx = require('xlsx');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

// Excel file to store user data
const excelFile = 'users.xlsx';

// Utility function to get users from Excel
function getUsersFromExcel() {
    if (!fs.existsSync(excelFile)) {
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet([]);
        xlsx.utils.book_append_sheet(wb, ws, 'Users');
        xlsx.writeFile(wb, excelFile);
    }

    const workbook = xlsx.readFile(excelFile);
    const sheet = workbook.Sheets['Users'];
    const users = xlsx.utils.sheet_to_json(sheet);
    return users;
}

// Utility function to save user to Excel
function saveUserToExcel(user) {
    const users = getUsersFromExcel();
    users.push(user);
    const newSheet = xlsx.utils.json_to_sheet(users);
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Users');
    xlsx.writeFile(newWorkbook, excelFile);
}

// Route for registering users
app.post('/register', (req, res) => {
    const { username, mobile, email, password } = req.body;

    const users = getUsersFromExcel();
    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.json({ success: false, message: "User already exists!" });
    }

    // Save the new user to Excel
    saveUserToExcel({ username, mobile, email, password });
    return res.json({ success: true });
});

// Route for logging in users
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = getUsersFromExcel();
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.json({ success: false, message: "User not found!" });
    }

    if (user.password !== password) {
        return res.json({ success: false, message: "Incorrect password!" });
    }

    return res.json({ success: true });
});

// Serve the frontend HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});