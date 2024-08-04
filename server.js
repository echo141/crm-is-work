const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crm_database'
});

db.connect();

// Создание таблицы (если она еще не создана)
db.query(`CREATE TABLE IF NOT EXISTS requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    initiator VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    status ENUM('Новая', 'В процессе', 'Завершена') NOT NULL,
    description TEXT NOT NULL,
    responsible VARCHAR(255) NOT NULL,
    due_date DATE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);

// Получение всех заявок
app.get('/requests', (req, res) => {
    db.query('SELECT * FROM requests', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Создание новой заявки
app.post('/requests', (req, res) => {
    const { initiator, service, status, description, responsible, due_date, comments } = req.body;
    const newRequest = { initiator, service, status, description, responsible, due_date, comments };
    
    db.query('INSERT INTO requests SET ?', newRequest, (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, ...newRequest });
    });
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Server is running');
});