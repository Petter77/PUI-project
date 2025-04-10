# PUI Project

Projekt zespołowy realizowany w ramach przedmiotu PUI (Projektowanie Użytkowych Interfejsów). Aplikacja składa się z dwóch części:

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + MySQL

---

## 📦 Struktura projektu


---

## 🔧 Backend

### 📁 Lokalizacja:
`/backend`

### 📦 Zależności:
- `express`
- `mysql2`
- `jsonwebtoken`
- `bcrypt`
- `cors`
- `body-parser`

### ▶️ Uruchomienie:
1. Przejdź do katalogu backendu:
    ```bash
    cd backend
    ```
2. Zainstaluj paczki:
    ```bash
    npm install
    ```
3. Uruchom serwer:
    ```bash
    npm start
    ```

---

## 💻 Frontend

### 📁 Lokalizacja:
`/frontend`

### 📦 Zależności:
- `react`, `react-dom`
- `axios`
- `react-router-dom`
- `sass`

### 🛠️ Uruchomienie:
1. Przejdź do katalogu frontendu:
    ```bash
    cd frontend
    ```
2. Zainstaluj paczki:
    ```bash
    npm install
    ```
3. Uruchom aplikację:
    ```bash
    npm run dev
    ```

---

## ⚙️ Konfiguracja bazy danych (MySQL)

1. Utwórz bazę danych i tabelę zgodnie z wymaganiami projektu.
2. Skonfiguruj dane dostępowe w pliku `backend/config.js` (jeśli taki istnieje, lub bezpośrednio w `index.js`):
    ```js
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fitate'
    });
    ```
    
---

