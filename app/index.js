const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

app.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT NOW() AS serverTime");

        res.json({
            message: "Node.js connected to MySQL",
            serverTime: rows[0].serverTime
        });
    } catch (err) {
        res.status(500).json({
            code: err.code,
            message: err.message
        });
    }
});

// Create Vehicle table
app.get("/create-table", async (req, res) => {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS Vehicle (
                vehicle_no VARCHAR(20) PRIMARY KEY,
                owner VARCHAR(100),
                price DECIMAL(10,2),
                registered_date DATE
            )
        `;

        await pool.query(sql);

        res.json({
            message: "Vehicle table created successfully"
        });

    } catch (err) {
        res.status(500).json(err);
    }
});


// Insert sample records
app.get("/insert-vehicles", async (req, res) => {
    try {
        const sql = `
            INSERT INTO Vehicle 
            (vehicle_no, owner, price, registered_date)
            VALUES ?
        `;

        const values = [
            ["CAR-1001", "John Smith", 25000.00, "2022-01-15"],
            ["CAR-1002", "Alice Brown", 32000.50, "2021-07-22"],
            ["CAR-1003", "Michael Johnson", 18500.75, "2023-03-10"],
            ["CAR-1004", "Sarah Davis", 41000.00, "2020-11-05"],
            ["CAR-1005", "David Wilson", 27500.25, "2024-06-18"]
        ];

        await pool.query(sql, [values]);

        res.json({
            message: "Five vehicle records inserted successfully"
        });

    } catch (err) {
        res.status(500).json(err);
    }
});


// Retrieve vehicle records
app.get("/vehicles", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM Vehicle"
        );

        res.json(rows);

    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
