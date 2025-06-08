const express = require('express');
const router = express.Router();
const db = require('../db');

// Pobierz plan posiłków użytkownika (bez zmian)
router.get('/plan', (req, res) => {
    const userId = req.user.user.userId;
    console.log(userId);

    const sql = 'SELECT * FROM meal_plans WHERE UserID = ? ORDER BY FIELD(day, "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"), FIELD(meal_type, "Śniadanie", "I-danie", "II-danie", "Kolacja")';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Błąd serwera podczas pobierania planu posiłków:", err);
            return res.status(500).json({ error: 'Błąd serwera!' });
        }

        const parsed = results.map((r) => ({
            ...r,
            ingredients: r.ingredients ? JSON.parse(r.ingredients) : []
        }));

        res.status(200).json(parsed);
    });
});

// Dodaj przepis do planu posiłków (zmodyfikowany)
router.post('/plan', (req, res) => {
    const userId = req.user.user.userId;

    const {
        ApiRecipeID,
        title,
        instructions,
        calories,
        prepTime,
        servings,
        image,
        healthScore,
        ingredients,
        day,
        meal_type
    } = req.body;

    const ingredientsJson = JSON.stringify(ingredients || []);

    // 1. Sprawdź, czy istnieje już przepis dla danego dnia i typu posiłku dla tego użytkownika
    const checkExistingSql = 'SELECT COUNT(*) AS count FROM meal_plans WHERE UserID = ? AND day = ? AND meal_type = ?';
    db.query(checkExistingSql, [userId, day, meal_type], (err, results) => {
        if (err) {
            console.error("Błąd SQL podczas sprawdzania istniejącego przepisu:", err);
            return res.status(500).json({ error: 'Błąd serwera!' });
        }

        if (results[0].count > 0) {
            return res.status(409).json({ error: `W planie posiłków dla ${day} na ${meal_type} już istnieje przepis.` });
        }

        // Jeśli nie ma istniejącego, dodaj nowy przepis
        const insertSql = `
            INSERT INTO meal_plans
            (UserID, ApiRecipeID, title, instructions, calories, prepTime, servings, image, healthScore, ingredients, day, meal_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertSql, [
            userId,
            ApiRecipeID,
            title,
            instructions,
            calories,
            prepTime,
            servings,
            image,
            healthScore,
            ingredientsJson,
            day,
            meal_type
        ], (err) => {
            if (err) {
                console.error("SQL Błąd podczas dodawania do planu:", err);
                return res.status(500).json({ error: 'Błąd podczas dodawania do planu posiłków.' });
            }
            res.status(201).json({ message: 'Dodano do planu posiłków!' });
        });
    });
});

// Usuń przepis z planu posiłków (bez zmian)
router.delete('/plan/:id', (req, res) => {
    const userId = req.user.user.userId;
    const { id } = req.params;

    const checkSql = 'SELECT * FROM meal_plans WHERE id = ? AND UserID = ?';
    db.query(checkSql, [id, userId], (err, results) => {
        if (err) {
            console.error("Błąd SELECT podczas usuwania przepisu z planu:", err);
            return res.status(500).json({ error: 'Błąd serwera!' });
        }
        if (results.length === 0) {
            console.warn(`Próba usunięcia nieistniejącego lub nieautoryzowanego przepisu: ID=${id}, UserID=${userId}`);
            return res.status(404).json({ error: 'Nie znaleziono przepisu w planie lub nie masz do niego dostępu.' });
        }

        const deleteSql = 'DELETE FROM meal_plans WHERE id = ? AND UserID = ?';
        db.query(deleteSql, [id, userId], (err) => {
            if (err) {
                console.error("Błąd DELETE podczas usuwania przepisu z planu:", err);
                return res.status(500).json({ error: 'Błąd przy usuwaniu przepisu z planu.' });
            }
            res.json({ message: 'Przepis usunięty z planu posiłków!' });
        });
    });
});

module.exports = router;