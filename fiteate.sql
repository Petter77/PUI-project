-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2025 at 12:44 PM
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
  `ApiRecipeID` varchar(255) NOT NULL,
  `DailyMenuName` varchar(255) NOT NULL,
  `MealPlanID` int(11) DEFAULT NULL
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
-- Struktura tabeli dla tabeli `recipes`
--

CREATE TABLE `recipes` (
  `RecipeID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `ApiRecipeID` varchar(255) NOT NULL
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
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `UserName`, `UserEmail`, `UserPassword`, `UserTelephone`, `UserWeight`, `UserHeight`, `UserBirthDate`, `UserSex`) VALUES
(4, 'testowy1', 'testowy1@gmail.com', '$2b$10$Nw1NJNk8ysO2Fq7yI8D1RO4BsiAnk1GkjeHjgHBEuX.uuvhi2okSO', '+48123456789', 75.00, 180.00, '1990-01-01', 'Male'),
(5, 'testowy2', 'testowy2@gmail.com', '$2b$10$X/3qA2TGw7RCtYg5pNMZKeBHEb3LZ/G2WGy1TKnDf4U3wFLyE6l16', '+48123456789', 75.00, 180.00, '1990-01-01', 'Female'),
(6, 'testowy3', 'testowy3@gmail.com', '$2b$10$bBnwyrRVDjnD0ZoqHDAMY.kuK5v0EPD4YXNbWrU7i.Kh96PT3N5Pu', '+48123456789', 75.00, 180.00, '1990-01-01', 'Male'),
(7, 'testowy4', 'myskow2002@gmail.com', '$2b$10$Nlj8BHn/b0G0Qof8Ur5gF.07woks.a5o.DQa2I/3oaAjGAvFMI3Z2', '123456789', 123.00, 123.00, '2025-04-16', ''),
(8, 'testowy5', 'testowy5@gmail.com', '$2b$10$Ro1BHYTzwiGUYLIVoNxxquefZBahZBIQ4Bs7rgb1RdujF6JU/LGZa', '+48123456789', 75.00, 180.00, '1990-01-01', 'Male'),
(9, 'testowy6', 'testowy6@gmail.com', '$2b$10$bdRQIJNHhbtUHB.dijK.G.cY9QOiBqIOf8AXwO66oXc1U.1X5nrTa', '123456789', 123.00, 123.00, '2025-04-09', 'Female');

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
-- Indeksy dla tabeli `mealplans`
--
ALTER TABLE `mealplans`
  ADD PRIMARY KEY (`MealPlanID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indeksy dla tabeli `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`RecipeID`),
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
  MODIFY `DailyMenuID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mealplans`
--
ALTER TABLE `mealplans`
  MODIFY `MealPlanID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `RecipeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dailymenus`
--
ALTER TABLE `dailymenus`
  ADD CONSTRAINT `dailymenus_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `dailymenus_ibfk_2` FOREIGN KEY (`MealPlanID`) REFERENCES `mealplans` (`MealPlanID`) ON DELETE SET NULL;

--
-- Constraints for table `mealplans`
--
ALTER TABLE `mealplans`
  ADD CONSTRAINT `mealplans_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
