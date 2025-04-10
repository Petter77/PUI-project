const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkIfUserName = require('../middlewares/auth/checkIfUserName');

const SECRET_KEY = 'secret';

router.post('/register', checkIfUserName(true), async (req, res) => {
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


  if (
    !UserName ||
    !UserEmail ||
    !UserPassword ||
    !UserTelephone ||
    !UserWeight ||
    !UserHeight ||
    !UserBirthDate ||
    !UserSex
  ) {
    return res.status(400).json({ error: 'Wypełnij wszystkie pola!' });
  }

  try {
    const hashedPassword = await bcrypt.hash(UserPassword, 10);

    const sql = `
      INSERT INTO users (
        UserName,
        UserEmail,
        UserPassword,
        UserTelephone,
        UserWeight,
        UserHeight,
        UserBirthDate,
        UserSex
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

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

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Błąd serwera' });
      }

      return res.status(201).json({ message: 'Zarejestrowano pomyślnie!' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.post('/login', checkIfUserName(false), async (req, res) =>{
    const hashedPassword = req.user.UserPassword;
    const {UserPassword} = req.body;

    if(!UserPassword) return res.status(400).json('Wypełnij wszystkie pola!');
    const isPasswordMatch = await bcrypt.compare(UserPassword, hashedPassword);
    if (!isPasswordMatch) return res.status(401).json('Błędny login lub hasło!');
    const UserID = req.user.UserID;
    const UserName = req.user.UserName
    // zrobic obiekt w ktorym bedzie token, userid i username
    // ten obiekt zapisac w sesji na frontendzie, wtedy frontend bedzie mial username bez koniecznosci zapytania
    // na backendzie uwzglednic ze w tokenie jest obiekt a sam token to pole tego obiektu
    const token = jwt.sign({UserID}, SECRET_KEY, {expiresIn: "1h"});
    const user = {
      token,
      UserID,
      UserName
    }
    res.status(200).json(user);
})

module.exports = router;
