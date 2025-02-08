const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'users.json');

function readUserData() {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

function writeUserData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

app.post('/api/users', (req, res) => {
    const { firstName, lastName, age, gender, email, phone } = req.body;
    if (!firstName || !lastName || !age || !gender || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const users = readUserData();
    const id = users.length + 1;
    const newUser = { id, firstName, lastName, age, gender, email, phone };
    users.push(newUser);
    writeUserData(users);

    res.json(newUser);
});

app.get('/api/users', (req, res) => {
    const users = readUserData();
    res.json(users);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
