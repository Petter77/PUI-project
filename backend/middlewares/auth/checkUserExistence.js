const db = require('../../db');

// middleware for check if login is empty and valid login/password
// isLogin is true for register, false for login
const checkUserExistence = (isLogin) => (req, res, next) =>{
    const {UserName, UserEmail} = req.body;
    if(!UserName) return res.status(400).json('Wypełnij wszystkie pola!');
    db.query('SELECT * FROM users WHERE UserName = ? OR UserEmail = ?', [UserName, UserEmail], (err, result) =>{
        if (err) return res.status(500).json('Błąd serwera!'); 
        if(isLogin){
            if (result.length != 0) return res.status(409).json('Ten użytkownik już istnieje!');
        }else{
            if (!result.length) return res.status(401).json('Błędny login lub hasło!');
            req.user = result[0];
        }
        next();
    })
}

module.exports = checkUserExistence;