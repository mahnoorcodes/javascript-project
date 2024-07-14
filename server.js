const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const config = {
    connectionTimeout: 30000,
    options: {
        trustedConnection: true,
    },
    connectionString: 'Driver={ODBC Driver 17 for SQL server};Server=DESKTOP-YOGA\\MSSQLSERVER01;Database=L5Project;Trusted_Connection=yes;',
};


app.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.json({ success: true, message: "SQL Server connection successful" });
    } catch (err) {
        console.error('SQL Connection Error', err);
        res.status(500).json({ success: false, message: "SQL Server connection failed", error: err.message });
    } finally {
        sql.close();
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid username or password"});
        }

        res.json({ success: true, message: "Login successful" });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: "Internal server error" });
    } finally {
        sql.close();
    }
});

app.post('/registration', async (req, res) => {
    const { username, email, fname, lname, password } = req.body;
    console.log('Received data:', { username, email, fname, lname, password });
    try {
        await sql.connect(config);

        await sql.query`
            INSERT INTO users (username, email, fname, lname, password)
            VALUES (${username}, ${email}, ${fname}, ${lname}, ${password})
        `;

        res.json({ success: true, message: "Registration successful" });
    } catch (err) {
        if (err.number === 2627) {
            res.status(400).json({ success: false, message: "Username or email already exists" });
        } else {
            console.error('Registration Error:', err);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    } finally {
        sql.close();
    }
});


app.use(express.static(__dirname)); //serve static files

// Define the root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Endpoint to serve navbar.html
app.get('/navbar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'navbar.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/registration.html', (req, res) => {
    res.sendFile(path.join(__dirname,'registration.html'));
});

app.get('/details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'details.html'));
});

app.get('/details.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'details.json'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Catch-all route for undefined routes
app.get('*', (req, res) => {
    res.status(404).send('Page not found');
})