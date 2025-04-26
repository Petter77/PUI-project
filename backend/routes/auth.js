const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkUserExistence = require('../middlewares/auth/checkUserExistence');
const db = require('../db');

const SECRET_KEY = 'secret';

router.post('/register', checkUserExistence(true), async (req, res) =>{

    const {
        UserName,
        UserEmail,
        UserPassword,
        UserTelephone,
        UserWeight,
        UserHeight,
        UserBirthDate,
        UserSex
    } = req.body;

    const hashedPassword = await bcrypt.hash(UserPassword, 10);

    const values = [
        UserName,
        UserEmail,
        hashedPassword,
        UserTelephone,
        UserWeight,
        UserHeight,
        UserBirthDate,
        UserSex
    ];
    
    const sql = 'INSERT INTO users (UserName, UserEmail, UserPassword, UserTelephone, UserWeight, UserHeight, UserBirthDate, UserSex) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Błąd serwera' });
        }
        res.status(201).json({ message: 'Użytkownik został utworzony pomyślnie!'});
    });

})

// login user with checkIfusername middleware for check if username is busy or username exists in db
router.post('/login', checkUserExistence(false), async (req, res) =>{
    const hashedPassword = req.user.UserPassword;
    const {password} = req.body;
    
    if(!password) return res.status(400).json('Wypełnij wszystkie pola!');
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatch) return res.status(401).json('Błędny login lub hasło!');

    const userId = req.user.UserID;
    const username = req.user.UserName

    const user = {
      userId,
      username,
    }

    const token = jwt.sign({user}, SECRET_KEY);

    res.status(200).json(token);
})

module.exports = router;