const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');


//creating an instance of the express application
const app = express()

app.use(express.static(path.join(__dirname, "public")))

app.use(cors())

app.use(express.json())

const port = 5000

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "students"
})

app.post('/add_user', (req, res) =>{
    sql = "INSERT INTO student_details (name,email,age,gender) VALUES (?,?,?,?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.age,
        req.body.gender
    ]
    db.query(sql,values, (err, result) =>{
        if(err) return res.json({message: 'Something Unexpected has occurred'+ err})
            return res.json({ success: "Student added successfully"}) 
    })
})


app.get('/students', (req, res) => {
    const sql = "SELECT * FROM student_details";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("SQL error: ", err);
            return res.status(500).json({ message: 'Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }
  
        return res.status(200).json({ result });
    });
});

app.get('/get_student/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM student_details WHERE `id` = ?";

    db.query(sql,[id], (err, result) => {
        if (err) {
            console.error("SQL error: ", err);
            return res.status(500).json({ message: 'Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }
  
        return res.status(200).json({ result });
    });
});

app.post('/edit_user/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE student_details SET name = ?, email=?, age=? ,gender=? WHERE `id` = ?";
    const values = [
        req.body.name,
        req.body.email,
        req.body.age,
        req.body.gender,
        id
    ]

    db.query(sql,values, (err, result) => {
        if (err) {
            console.error("SQL my error: ", err);
            return res.status(500).json({ message: 'Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }
  
        return res.status(200).json({ result });
    });
});


app.get('/delete_student/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM student_details WHERE `id` = ?";

    db.query(sql,[id], (err, result) => {
        if (err) {
            console.error("SQL my error: ", err);
            return res.status(500).json({ message: 'Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Student Not found' });
        }
  
        return res.status(200).json({ result });
    });
});


app.listen(port, () => {
    console.log('listening')
})


