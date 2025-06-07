const express = require('express');
const router = express.Router();
const db = require('../db');


// Dodaj przepis do ulubionych
router.post('/save', (req, res) => {
  const {
    recipeId,
    title,
    instructions,
    calories,
    prepTime,
    servings,
    image,
    healthScore,
    ingredients
  } = req.body;

  const userId = req.user.user.userId;

  const ingredientsJson = JSON.stringify(ingredients || []);

  const checkSql = 'SELECT * FROM saved_recipes WHERE ApiRecipeID = ? AND UserID = ?';
  db.query(checkSql, [recipeId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera!' });

    if (results.length > 0) {

      return res.status(409).json({ message: 'Przepis już jest w ulubionych.' });
    }

    const insertSql = `
      INSERT INTO saved_recipes 
        (UserID, ApiRecipeID, title, instructions, calories, prepTime, servings, image, healthScore, ingredients) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [userId, recipeId, title, instructions, calories, prepTime, servings, image, healthScore, ingredientsJson],
      (err) => {
        if (err) return res.status(500).json({ error: 'Błąd podczas zapisu przepisu.' });
        return res.status(201).json({ message: 'Przepis dodany do ulubionych!' });
      }
    );
  });
});

// Usuń przepis z ulubionych
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.user.userId;


  const checkSql = 'SELECT * FROM saved_recipes WHERE ApiRecipeID = ? AND UserID = ?';
  db.query(checkSql, [id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera!' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nie znaleziono przepisu.' });
    }

    const deleteSql = 'DELETE FROM saved_recipes WHERE UserID = ? AND ApiRecipeID = ?';
    db.query(deleteSql, [userId, id], (err) => {
      if (err) return res.status(500).json({ error: 'Błąd przy usuwaniu przepisu.' });

      return res.status(200).json({ message: 'Przepis usunięty z ulubionych!' });
    });
  });
});


// Sprawdź, czy przepis jest w ulubionych
router.get('/isFavorite/:id', (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.user.userId;

  const sql = 'SELECT 1 FROM saved_recipes WHERE ApiRecipeID = ? AND UserID = ?';
  db.query(sql, [recipeId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera!' });
    res.json({ isFavorite: results.length > 0 });
  });
});


// Pobierz wszystkie ulubione przepisy użytkownika
router.get('/saved-recipes/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM saved_recipes WHERE UserID = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Błąd serwera!' });

    const parsed = results.map((r) => ({
      ...r,
      ingredients: r.ingredients ? JSON.parse(r.ingredients) : []
    }));

    res.status(200).json(parsed);
  });
});

module.exports = router;

