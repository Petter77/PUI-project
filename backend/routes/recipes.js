const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/save', (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user.user.userId;

  const checkSql = 'SELECT * FROM favourite_recipes WHERE ApiRecipeID = ? AND UserID = ?';

  db.query(checkSql, [recipeId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera!' });

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

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.user.userId;

  const checkSql = 'SELECT * FROM favourite_recipes WHERE ApiRecipeID = ? AND UserID = ?';

  db.query(checkSql, [id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera!' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Przepis nie został znaleziony.' });
    }

    const deleteSql = 'DELETE FROM favourite_recipes WHERE UserID = ? AND ApiRecipeID = ?';

    db.query(deleteSql, [userId, id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Błąd serwera przy usuwaniu przepisu.' });

      return res.status(200).json({ message: 'Przepis został usunięty pomyślnie!' });
    });
  });
});

router.get('/saved-recipes', (req, res) =>{
  const userId = req.user.user.userId;
  const getSql = 'SELECT * FROM favourite_recipes WHERE UserID = ?';

  db.query(getSql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera!' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Brak zapisanych przepisów.' });
    }
    return res.status(200).json(results)
  })


})

module.exports = router;
