const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/save', (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user.user.userId;

  const checkSql = 'SELECT * FROM favourite_recipes WHERE ApiRecipeID = ? AND UserID = ?';

  db.query(checkSql, [recipeId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera przy sprawdzaniu przepisu.' });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Ten przepis już został dodany do ulubionych!' });
    }

    const insertSql = 'INSERT INTO favourite_recipes (UserID, ApiRecipeID) VALUES (?, ?)';

    db.query(insertSql, [userId, recipeId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Błąd serwera przy dodawaniu przepisu.' });

      return res.status(201).json({ message: 'Przepis został dodany do ulubionych!' });
    });
  });
});

module.exports = router;
