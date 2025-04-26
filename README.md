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
- `lucide icons`

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

### 🛠️ Baza danych:

1. Stwórzcie baze danych w PhpMyAdmin o nazwie fiteate (nazwa musi sie zgadzac)
2. klikajac w zakladke sql wklejcie ponizszy kod:

```
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 26, 2025 at 04:45 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fiteate`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `dailymenus`
--

CREATE TABLE `dailymenus` (
  `DailyMenuID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `DailyMenuName` varchar(255) NOT NULL,
  `MealPlanID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `dailymenu_recipes`
--

CREATE TABLE `dailymenu_recipes` (
  `DailyMenuID` int(11) NOT NULL,
  `ApiRecipeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `favourite_recipes`
--

CREATE TABLE `favourite_recipes` (
  `UserID` int(11) NOT NULL,
  `ApiRecipeID` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `mealplans`
--

CREATE TABLE `mealplans` (
  `MealPlanID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `MealPlanStart` date NOT NULL,
  `CountDays` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `UserEmail` varchar(255) NOT NULL,
  `UserPassword` varchar(255) NOT NULL,
  `UserTelephone` varchar(20) DEFAULT NULL,
  `UserWeight` decimal(5,2) DEFAULT NULL,
  `UserHeight` decimal(5,2) DEFAULT NULL,
  `UserBirthDate` date DEFAULT NULL,
  `UserSex` enum('Male','Female','Other') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `dailymenus`
--
ALTER TABLE `dailymenus`
  ADD PRIMARY KEY (`DailyMenuID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `MealPlanID` (`MealPlanID`);

--
-- Indeksy dla tabeli `dailymenu_recipes`
--
ALTER TABLE `dailymenu_recipes`
  ADD PRIMARY KEY (`DailyMenuID`,`ApiRecipeID`);

--
-- Indeksy dla tabeli `favourite_recipes`
--
ALTER TABLE `favourite_recipes`
  ADD KEY `UserID` (`UserID`);

--
-- Indeksy dla tabeli `mealplans`
--
ALTER TABLE `mealplans`
  ADD PRIMARY KEY (`MealPlanID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `UserEmail` (`UserEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dailymenus`
--
ALTER TABLE `dailymenus`
  MODIFY `DailyMenuID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `mealplans`
--
ALTER TABLE `mealplans`
  MODIFY `MealPlanID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dailymenus`
--
ALTER TABLE `dailymenus`
  ADD CONSTRAINT `dailymenus_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dailymenus_ibfk_2` FOREIGN KEY (`MealPlanID`) REFERENCES `mealplans` (`MealPlanID`) ON DELETE CASCADE;

--
-- Constraints for table `dailymenu_recipes`
--
ALTER TABLE `dailymenu_recipes`
  ADD CONSTRAINT `dailymenu_recipes_ibfk_1` FOREIGN KEY (`DailyMenuID`) REFERENCES `dailymenus` (`DailyMenuID`) ON DELETE CASCADE;

--
-- Constraints for table `favourite_recipes`
--
ALTER TABLE `favourite_recipes`
  ADD CONSTRAINT `favourite_recipes_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `mealplans`
--
ALTER TABLE `mealplans`
  ADD CONSTRAINT `mealplans_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
```

### Pierwsze użycie:

## Najpierw należy kliknąć w przycisk zarejestruj się i wypełnić formularz, następnie apka przeniesie Was do formularza logowania, trzeba się zalogować loginem i hasłem wcześniej podanym przy rejestracji. U każdego z Was baza będzie pewnie pusta i apka nie ma kontentu z tabeli users, bo póki co jest tylko system autentykacji. Domyślnie przed zalogowaniem się user dostanie na pierwszym widoku wyszukiwarke do potraw.
