-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2019 at 06:43 PM
-- Server version: 5.7.15
-- PHP Version: 7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bd`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `ctId` int(11) NOT NULL,
  `ctName` varchar(128) NOT NULL,
  `ctPopulation` int(11) NOT NULL,
  `ctSquare` int(11) NOT NULL,
  `ctCountry` int(11) NOT NULL,
  `ctRegion` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`ctId`, `ctName`, `ctPopulation`, `ctSquare`, `ctCountry`, `ctRegion`) VALUES
(1, 'Киев', 100, 212, 1, 'Киевская область'),
(2, 'Харьков', 100, 212, 1, 'Харьковская область'),
(3, 'Днепр', 100, 212, 1, 'Днепропетровская область'),
(4, 'Львов', 100, 212, 1, 'Львовская область'),
(5, 'Москва', 100, 212, 2, 'Московская область'),
(6, 'Санкт-Петербург', 100, 212, 2, 'Ленинградская область'),
(7, 'Минск', 3564422, 311, 3, 'Минская область'),
(8, 'Брест', 110933, 123, 3, 'Брестовская область');

-- --------------------------------------------------------

--
-- Table structure for table `city_langs`
--

CREATE TABLE `city_langs` (
  `citylangId` int(11) NOT NULL,
  `citylangCity` int(11) NOT NULL,
  `citylangLang` int(11) NOT NULL,
  `citylangProcent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `city_langs`
--

INSERT INTO `city_langs` (`citylangId`, `citylangCity`, `citylangLang`, `citylangProcent`) VALUES
(1, 1, 1, 20),
(2, 1, 2, 2),
(3, 1, 3, 77),
(4, 1, 4, 1),
(9, 3, 1, 15),
(10, 3, 2, 4),
(11, 3, 3, 80),
(12, 3, 4, 1),
(13, 4, 1, 17),
(14, 4, 2, 1),
(15, 4, 3, 81),
(16, 4, 4, 1),
(17, 5, 1, 20),
(18, 5, 2, 2),
(19, 5, 3, 76),
(20, 5, 4, 2),
(26, 6, 2, 1),
(27, 6, 3, 2),
(28, 6, 4, 1),
(29, 7, 1, 10),
(30, 7, 2, 85),
(31, 7, 3, 4),
(32, 7, 4, 1),
(33, 8, 1, 8),
(34, 8, 2, 88),
(35, 8, 3, 3),
(36, 8, 4, 1),
(37, 2, 1, 30),
(38, 2, 2, 3),
(39, 2, 3, 67);

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `cId` int(11) NOT NULL,
  `cName` varchar(64) NOT NULL,
  `cCapital` varchar(64) NOT NULL,
  `cPolity` varchar(64) NOT NULL,
  `cMainland` varchar(64) NOT NULL,
  `cGrowth` float NOT NULL,
  `cMigrBalance` float NOT NULL,
  `cPopState` tinyint(1) NOT NULL,
  `cNominalGDP` int(11) NOT NULL,
  `cRealGDP` int(11) NOT NULL,
  `cDevEconomy` tinyint(1) NOT NULL,
  `cSquare` int(11) NOT NULL DEFAULT '0',
  `cPopulation` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`cId`, `cName`, `cCapital`, `cPolity`, `cMainland`, `cGrowth`, `cMigrBalance`, `cPopState`, `cNominalGDP`, `cRealGDP`, `cDevEconomy`, `cSquare`, `cPopulation`) VALUES
(1, 'Украина', 'Киев', 'Парламентско-президентская', 'Евразия', -2.1, -2.1, 0, 0, 0, 0, 0, 0),
(2, 'Россия', 'Москва', 'Президентско-парламентская', 'Евразия', -2.9, 3.3, 0, 0, 0, 0, 0, 0),
(3, 'Белоруссия', 'Минск', 'Президентско-парламентская', 'Евразия', 4.3, 0.24, 0, 109313440, 4343, 0, 1332, 4567554);

-- --------------------------------------------------------

--
-- Table structure for table `country_langs`
--

CREATE TABLE `country_langs` (
  `clangId` int(11) NOT NULL,
  `clangCountry` int(11) NOT NULL,
  `clangLang` int(11) NOT NULL,
  `clangOfficial` tinyint(1) NOT NULL,
  `clangProcent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `country_langs`
--

INSERT INTO `country_langs` (`clangId`, `clangCountry`, `clangLang`, `clangOfficial`, `clangProcent`) VALUES
(5, 2, 1, 0, 96),
(6, 2, 2, 0, 1),
(7, 2, 3, 0, 2),
(8, 2, 4, 0, 1),
(9, 3, 1, 1, 45),
(10, 3, 2, 1, 50),
(11, 3, 3, 0, 4),
(12, 3, 4, 0, 1),
(25, 1, 1, 0, 24),
(26, 1, 2, 0, 2),
(27, 1, 3, 0, 74);

-- --------------------------------------------------------

--
-- Table structure for table `langs`
--

CREATE TABLE `langs` (
  `langId` int(11) NOT NULL,
  `langName` varchar(64) NOT NULL,
  `langRusName` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `langs`
--

INSERT INTO `langs` (`langId`, `langName`, `langRusName`) VALUES
(1, 'Русский', 'Русский'),
(2, 'Беларуский', 'Беларуский'),
(3, 'Украинский', 'Украинский'),
(4, 'Иврит', 'Иврит');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `likeId` int(11) NOT NULL,
  `likePost` int(11) NOT NULL,
  `likeUser` int(11) NOT NULL,
  `likeDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `nation`
--

CREATE TABLE `nation` (
  `nId` int(11) NOT NULL,
  `nName` varchar(128) NOT NULL,
  `nRusName` varchar(128) NOT NULL,
  `nRace` varchar(128) NOT NULL,
  `nReligion` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nation`
--

INSERT INTO `nation` (`nId`, `nName`, `nRusName`, `nRace`, `nReligion`) VALUES
(1, 'Украинцы', 'Украинцы', 'эвропеоидная', 'православие'),
(2, 'Беларусы', 'Беларусы', 'эвропеоидная', 'православие'),
(3, 'Русские', 'Русские', 'эвропеоидная', 'православие'),
(4, 'Евреи', 'Евреи', 'эвропеоидная', 'иудаизм');

-- --------------------------------------------------------

--
-- Table structure for table `nation_country`
--

CREATE TABLE `nation_country` (
  `ncId` int(11) NOT NULL,
  `ncNation` int(11) NOT NULL,
  `ncCountry` int(11) NOT NULL,
  `ncProcent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nation_country`
--

INSERT INTO `nation_country` (`ncId`, `ncNation`, `ncCountry`, `ncProcent`) VALUES
(5, 1, 2, 4),
(6, 2, 2, 2),
(7, 3, 2, 90),
(8, 4, 2, 4),
(9, 1, 3, 5),
(10, 2, 3, 53),
(11, 3, 3, 40),
(12, 4, 3, 2),
(13, 1, 1, 76),
(14, 2, 1, 4),
(15, 3, 1, 18),
(16, 4, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `pId` int(11) NOT NULL,
  `pName` varchar(128) NOT NULL,
  `pText` text NOT NULL,
  `pCreateDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `pPhoto` varchar(128) NOT NULL,
  `pCountry` int(11) NOT NULL,
  `pAuthor` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`pId`, `pName`, `pText`, `pCreateDate`, `pPhoto`, `pCountry`, `pAuthor`) VALUES
(1, 'Первая статья', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae nibh volutpat, interdum neque ut, posuere nisl. Maecenas nisl augue, malesuada eget est ut, mollis eleifend urna. Proin vestibulum, turpis eget commodo dapibus, justo ipsum ultricies est, sed tempus turpis metus sit amet elit. Nulla facilisi. Duis sagittis ligula nibh, vel congue erat hendrerit vitae. Nullam eu quam nulla. Morbi lorem nisl, porttitor quis magna quis, aliquet molestie sapien. Maecenas hendrerit iaculis libero, sed ultricies diam tempus quis. Donec erat velit, fringilla sed facilisis id, sagittis et tortor. Nullam aliquam vehicula lacus, nec tempor tortor. Vivamus euismod rhoncus justo, at viverra nunc porta eget. Curabitur sagittis sem augue, at aliquam ante tincidunt ut. Pellentesque non nulla sagittis, congue odio vitae, eleifend velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.\n\nPraesent nibh magna, lobortis eu risus id, sagittis molestie diam. Sed sapien sem, fermentum vitae tincidunt molestie, venenatis id libero. In eu leo imperdiet, lacinia diam et, congue nibh. Integer sit amet laoreet eros, in consectetur odio. Curabitur vitae metus ut augue bibendum pharetra. Praesent eu erat sed elit sollicitudin aliquet. Quisque eget laoreet orci. Vestibulum commodo dolor non tortor lobortis, eu placerat nunc laoreet. Nulla sed varius libero. Donec placerat suscipit cursus. Suspendisse suscipit, velit eget euismod consectetur, magna nunc pulvinar massa, sed condimentum lectus mi at mauris. Etiam leo sem, eleifend id suscipit eu, porttitor at odio. Phasellus dapibus, mauris vehicula aliquam facilisis, eros mi sagittis tellus, at pretium ex neque eget lectus. Sed non lectus at ligula consequat vehicula id sed.', '2019-11-08 11:41:25', 'https://i.imgur.com/C3DLmpL.jpg', 1, 'Admin'),
(2, 'Вторая статья', 'Sed lacus neque, commodo at condimentum vitae, bibendum vel magna. Proin lacinia laoreet elit sit amet condimentum. Praesent scelerisque dictum sapien, non tincidunt dui faucibus eget. Aliquam odio ante, feugiat sit amet fermentum at, semper sit amet sem. Fusce id augue vitae lacus auctor interdum. Aenean placerat congue magna ut suscipit. Sed venenatis commodo mi, molestie efficitur enim viverra eget. Nunc luctus, tellus vitae ultricies aliquam, nisi turpis venenatis justo, vehicula facilisis metus quam ut lacus. Donec tincidunt tristique velit, vitae ultrices nibh vestibulum in. Etiam sit amet leo nec elit interdum sollicitudin. Etiam vehicula nisi elit, nec lobortis sapien dignissim eu. In gravida elit eu turpis luctus, fringilla iaculis nisl volutpat. Curabitur non porttitor quam.\r\n\r\nPellentesque sit amet pretium orci. Curabitur quam tellus, dapibus quis tellus a, efficitur pulvinar ipsum. Aenean quis ex a nisi laoreet fermentum. Aenean libero quam, convallis ac malesuada non, semper at magna. Suspendisse pellentesque lorem nunc, ut scelerisque lacus hendrerit id. Vivamus id semper dolor. Donec ac faucibus risus. Integer sit amet vestibulum quam. Pellentesque lacinia egestas nibh, vitae semper tortor. Phasellus sagittis porta nisi, sit amet aliquam libero mattis sed. Etiam eu leo laoreet, aliquet augue ut, ullamcorper sem. Nam pellentesque ornare eros sit amet luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', '2019-11-08 11:41:52', 'https://i.imgur.com/UzXzTwH.jpg', 3, 'Admin');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uId` int(11) NOT NULL,
  `uUsername` varchar(64) NOT NULL,
  `uEmail` varchar(129) NOT NULL DEFAULT '',
  `uName` varchar(64) NOT NULL DEFAULT '',
  `uSurname` varchar(64) NOT NULL DEFAULT '',
  `uAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `uRegDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uPass` varchar(64) NOT NULL,
  `uAvatar` varchar(128) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uId`, `uUsername`, `uEmail`, `uName`, `uSurname`, `uAdmin`, `uRegDate`, `uPass`, `uAvatar`) VALUES
(1, 'admin', 'admin@nure.ua', 'Админ', 'Админыч', 1, '2019-11-06 17:41:28', '123456', 'https://i.imgur.com/85GtiDX.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`ctId`),
  ADD KEY `ctCountry` (`ctCountry`);

--
-- Indexes for table `city_langs`
--
ALTER TABLE `city_langs`
  ADD PRIMARY KEY (`citylangId`),
  ADD KEY `citylangCity` (`citylangCity`),
  ADD KEY `citylangLang` (`citylangLang`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`cId`);

--
-- Indexes for table `country_langs`
--
ALTER TABLE `country_langs`
  ADD PRIMARY KEY (`clangId`),
  ADD KEY `clangCountry` (`clangCountry`),
  ADD KEY `clangLang` (`clangLang`);

--
-- Indexes for table `langs`
--
ALTER TABLE `langs`
  ADD PRIMARY KEY (`langId`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`likeId`),
  ADD KEY `likePost` (`likePost`),
  ADD KEY `likeUser` (`likeUser`);

--
-- Indexes for table `nation`
--
ALTER TABLE `nation`
  ADD PRIMARY KEY (`nId`);

--
-- Indexes for table `nation_country`
--
ALTER TABLE `nation_country`
  ADD PRIMARY KEY (`ncId`),
  ADD KEY `ncCountry` (`ncCountry`),
  ADD KEY `ncNation` (`ncNation`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`pId`),
  ADD KEY `pCountry` (`pCountry`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `ctId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `city_langs`
--
ALTER TABLE `city_langs`
  MODIFY `citylangId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `cId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `country_langs`
--
ALTER TABLE `country_langs`
  MODIFY `clangId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `langs`
--
ALTER TABLE `langs`
  MODIFY `langId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `likeId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `nation`
--
ALTER TABLE `nation`
  MODIFY `nId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `nation_country`
--
ALTER TABLE `nation_country`
  MODIFY `ncId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `pId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`ctCountry`) REFERENCES `country` (`cId`) ON DELETE CASCADE;

--
-- Constraints for table `city_langs`
--
ALTER TABLE `city_langs`
  ADD CONSTRAINT `city_langs_ibfk_1` FOREIGN KEY (`citylangCity`) REFERENCES `city` (`ctId`) ON DELETE CASCADE,
  ADD CONSTRAINT `city_langs_ibfk_2` FOREIGN KEY (`citylangLang`) REFERENCES `langs` (`langId`) ON DELETE CASCADE;

--
-- Constraints for table `country_langs`
--
ALTER TABLE `country_langs`
  ADD CONSTRAINT `country_langs_ibfk_1` FOREIGN KEY (`clangCountry`) REFERENCES `country` (`cId`) ON DELETE CASCADE,
  ADD CONSTRAINT `country_langs_ibfk_2` FOREIGN KEY (`clangLang`) REFERENCES `langs` (`langId`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`likePost`) REFERENCES `posts` (`pId`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`likeUser`) REFERENCES `users` (`uId`) ON DELETE CASCADE;

--
-- Constraints for table `nation_country`
--
ALTER TABLE `nation_country`
  ADD CONSTRAINT `nation_country_ibfk_1` FOREIGN KEY (`ncCountry`) REFERENCES `country` (`cId`) ON DELETE CASCADE,
  ADD CONSTRAINT `nation_country_ibfk_2` FOREIGN KEY (`ncNation`) REFERENCES `nation` (`nId`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`pCountry`) REFERENCES `country` (`cId`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
