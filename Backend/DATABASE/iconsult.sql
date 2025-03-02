-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 20, 2025 at 12:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iconsult`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'admin', 'ritchelle.rueras@tup.edu.ph', 'admin12345', '2024-09-08 20:54:27'),
(2, 'iconsultAdmin', 'ritchellerueras@gmail.com', 'admin12345', '2025-01-11 14:26:53');

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `date` varchar(15) NOT NULL,
  `time` varchar(15) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `consultationType` varchar(100) NOT NULL,
  `additionalInfo` text DEFAULT NULL,
  `platform` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `client_id` int(11) DEFAULT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `reminder` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `date`, `time`, `name`, `email`, `consultationType`, `additionalInfo`, `platform`, `created_at`, `client_id`, `contact`, `companyName`, `reminder`) VALUES
(2, '2024-11-20', '08:00 AM', 'rITCHELLE RUERAS', 'ritchellerueras@gmail.com', 'Employee Benefits and Compliance Advisory', 'HAKDOG', 'In-Person', '2024-11-17 06:29:33', 0, NULL, NULL, NULL),
(4, '2024-11-22', '02:00 PM', 'CHELLE', 'ruerasritchelle@gmail.com', 'Risk Management Consultation', 'RISKY', 'Video Call', '2024-11-17 06:46:26', 0, NULL, NULL, NULL),
(5, '2024-11-19', '04:00 PM', 'MONIK', 'ritchellerueras@gmail.com', 'Risk Management Consultation', 'RISKYYY', 'Video Call', '2024-11-17 06:55:32', 3, NULL, NULL, NULL),
(6, '2025-01-09', '11:00 AM', 'CLARIEZA BAUTISTA', 'CLAIRE@gmail.com', 'Legal Advisory', 'hakdog', 'In-Person', '2024-11-17 07:05:42', 5, '09876543212', 'Bora', NULL),
(7, '2024-11-24', '03:00 PM', 'claire', 'ritchellerueras@gmail.com', 'Organizational Development Advisory', 'haha', 'Video Call', '2024-11-17 07:21:06', 5, '09876543212', NULL, NULL),
(8, '2024-11-30', '09:00 AM', 'bautista', 'bautista@gmail.com', 'Risk Management Consultation', 'bautista', 'In-Person', '2024-11-17 07:26:31', 5, '09876787654', NULL, NULL),
(9, '2024-11-18', '09:00 AM', 'rueras', 'ruerasritchelle@gmail.com', 'Organizational Development Advisory', 'org', 'Video Call', '2024-11-17 07:29:01', 5, '09876543211', NULL, NULL),
(10, '2024-12-28', '11:00 AM', 'hgj', 'ruerasritchelle@gmail.com', 'Corporate Governance Review', 'gjhg', 'In-Person', '2024-12-15 19:06:39', 5, '09876543212', NULL, NULL),
(12, '2025-01-09', '02:00 PM', 'Julien Cohen', 'ritchellerueras@gmail.com', 'music type', 'music reco', 'Video Call', '2024-12-17 08:29:32', 5, '09876543212', 'Tiktok', '2 hours before'),
(14, '2024-12-18', '03:00 PM', 'Ritchelle Rueras', 'ruerasritchelle@gmail.com', 'Accounting Consultation', 'payroll', 'In-Person', '2024-12-18 06:26:20', 5, '09876543212', 'Table Tennis', 'At Time of Event'),
(15, '2024-12-18', '01:00 PM', 'Monique Cabigting', 'ruerasritchelle@gmail.com', 'Tax Advisory', 'tax payment', 'In-Person', '2024-12-18 06:37:39', 5, '09876543212', 'Food vlog', '5 minutes before'),
(16, '2025-01-18', '02:00 PM', 'Julie Joy', 'ritchellerueras@gmail.com', 'Payroll System Setup Consultation', 'employee pay', 'Phone Call', '2024-12-18 07:40:53', 2, '09876543234', 'Bora', '10 minutes before'),
(19, '2024-12-19', '04:00 PM', 'Ritchelle Rueras', 'ritchellerueras@gmail.com', 'Employee Benefits and Compliance Advisory', 'employee building', 'In-Person', '2024-12-19 07:48:06', 5, '09876543212', 'Samgyupsalamat', '10 minutes before'),
(22, '2024-12-20', '08:00 AM', 'Julie Joy Rueras', 'ritchellerueras@gmail.com', 'Startup Planning', 'new business', 'In-Person', '2024-12-19 08:06:15', 5, '09876543212', 'Table Tennis', '1 day before'),
(23, '2025-01-02', '09:00 AM', 'Julie Rueras', 'ruerasritchelle07@gmail.com', 'Payroll System Setup Consultation', 'Payroll', 'In-Person', '2024-12-29 16:36:09', 23, '09876543212', 'Table Tennis', '2 days before'),
(26, '2025-01-03', '12:00 PM', 'Julie Rueras', 'ruerasritchelle07@gmail.com', 'Startup Planning', 'Business StartUp', 'Phone Call', '2024-12-29 17:08:41', 23, '09876543212', 'Table Tennis', '5 minutes before'),
(27, '2025-01-04', '09:00 AM', 'christ Christopher', 'ritchellerueras@gmail.com', 'Risk Management Consultation', 'for risk management ', 'Microsoft Teams', '2024-12-29 17:30:31', 22, '09876567898', 'Food vlog', '2 days before'),
(29, '2025-01-09', '04:00 PM', 'Kyle Rueras', 'ritchelle.rueras@tup.edu.ph', 'Accounting Consultation', 'Accounting', 'Video Call', '2025-01-03 07:58:52', 5, '+639876543212', 'OPPA', '5 minutes before'),
(30, '2025-01-10', '08:00 AM', 'mimi mema', 'clarieza@gmail.com', 'Organizational Development Advisory', 'sds', 'Google Meet', '2025-01-04 12:43:48', 6, '09709573613', '', 'At Time of Event'),
(31, '2025-01-10', '02:00 PM', 'Jen Paclibar', 'ritchellerueras@gmail.com', 'Startup Planning', 'Apartment rent', 'In-Person', '2025-01-06 08:34:57', 19, '09876543212', '', '5 minutes before'),
(34, '2025-02-01', '11:00 AM', 'Rosyl Cenas', 'ritchellerueras@gmail.com', 'Strategic Planning Consultation', 'business promote', 'In-Person', '2025-01-07 15:49:17', 2, '+639876543212', 'Paresan', '1 week before'),
(35, '2025-01-10', '06:00 PM', 'claireza bautista', 'clarieza@gmail.com', 'Financial Advisory', 'Financial loss', 'Video Call', '2025-01-08 02:50:36', 5, '09709573613', NULL, '1 day before'),
(36, '2025-01-18', '07:00 AM', 'claireza bautista', 'clarieza@gmail.com', 'Strategic Planning Consultation', 'planning consultation', 'In-Person', '2025-01-08 02:54:06', 5, '09709573613', NULL, '2 days before'),
(37, '2025-01-17', '07:00 AM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Accounting Consultation', 'Accounting', 'In-Person', '2025-01-11 07:08:28', 2, '09234567890', 'Apple', '1 week before'),
(38, '2025-01-16', '02:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Risk Management Consultation', 'new business', 'Video Call', '2025-01-11 07:55:11', 2, '09234567890', 'Apple', '2 days before'),
(40, '2025-01-15', '06:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Strategic Planning Consultation', 'Business promote strategy', 'In-Person', '2025-01-11 09:00:46', 2, '09234567890', 'Apple', '2 days before'),
(42, '2025-01-16', '03:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Strategic Planning Consultation', 'business strategy', 'In-Person', '2025-01-14 01:48:14', 2, '09234567890', 'Apple', '5 minutes before'),
(43, '2025-01-18', '10:00 AM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Strategic Planning Consultation', 'business strat', 'In-Person', '2025-01-14 02:32:03', 2, '09234567890', 'Apple', '2 hours before'),
(44, '2025-01-16', '09:00 AM', 'Monique Cabigting', 'ritchellerueras@gmail.com', 'Legal Advisory', 'n/a', 'Zoom', '2025-01-14 02:46:06', 4, '098765432', 'Vape Shop', '2 hours before'),
(45, '2025-01-18', '05:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Business Process Improvement', 'n', 'Video Call', '2025-01-14 02:47:35', 2, '09234567890', 'Apple', '2 hours before'),
(46, '2025-01-15', '11:00 AM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Corporate Governance Review', 'planning', 'In-Person', '2025-01-14 07:10:33', 2, '09234567890', 'Apple', '2025-01-14 15:15:00'),
(47, '2025-01-17', '03:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Business Process Improvement', 'testing', 'Video Call', '2025-01-14 07:15:42', 2, '09234567890', 'Apple', '2025-01-14 15:30:00'),
(48, '2025-01-17', '06:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Risk Management Consultation', 'Testing2', 'In-Person', '2025-01-14 07:16:49', 2, '09234567890', 'Apple', '2025-01-14 15:30:00'),
(49, '2025-01-22', '04:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Corporate Governance Review', 'Testing 3', 'Video Call', '2025-01-14 07:20:13', 2, '09234567890', 'Apple', '2025-01-14 15:30:00'),
(50, '2025-01-22', '04:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Corporate Governance Review', 'Testing 3', 'Video Call', '2025-01-14 07:22:03', 2, '09234567890', 'Apple', '2025-01-14 15:30:00'),
(51, '2025-01-22', '02:00 PM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Corporate Governance Review', 'Testing 4', 'In-Person', '2025-01-14 07:24:31', 2, '09234567890', 'Apple', '2025-01-14 15:30:00'),
(52, '2025-01-31', '03:00 PM', 'Ritchelle Rueras', 'ritchellerueras@gmail.com', 'Accounting Consultation', 'testing only', 'Google Meet', '2025-01-14 07:40:34', 3, '09709573613', 'TYESO', '2025-01-14 15:45:00'),
(53, '2025-01-31', '12:00 PM', 'Clarieza Baustista', 'clarieza@gmail.com', 'Financial Advisory', 'financing', 'Phone Call', '2025-01-14 20:39:50', 5, '09709573613', 'Beauty Parlor', '2025-01-15 12:00:00'),
(54, '2025-01-23', '07:00 AM', 'Jane Smith', 'ruerasritchelle07@gmail.com', 'Strategic Planning Consultation', 'para saan', 'Google Meet', '2025-01-16 09:20:07', 2, '0923456890', 'Apple', '2025-01-16 17:30:00'),
(55, '2025-01-23', '11:00 AM', 'TRISHIa SAN DIEGO', 'trishiasandiego24@gmail.com', 'Legal Advisory', 'PERMIT', 'In-Person', '2025-01-17 05:37:32', 32, '09666095399', 'COFFEE', '2025-01-17 13:45:00'),
(56, '2025-01-23', '01:00 PM', 'TRISHIa SAN DIEGO', 'trishiasandiego24@gmail.com', 'Payroll System Setup Consultation', 'Payroll', 'In-Person', '2025-01-17 05:57:20', 32, '09666095399', 'COFFEE', '2025-01-17 14:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

CREATE TABLE `availability` (
  `id` int(11) NOT NULL,
  `start_time` varchar(10) DEFAULT NULL,
  `end_time` varchar(10) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `dates` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `availability`
--

INSERT INTO `availability` (`id`, `start_time`, `end_time`, `date_created`, `dates`) VALUES
(13, '11:00 AM', '03:00 PM', '2025-01-02 17:16:37', '2025-01-06'),
(14, '09:00 AM', '04:00 PM', '2025-01-02 17:43:15', '2025-01-07'),
(15, '08:00 AM', '04:00 PM', '2025-01-02 17:43:15', '2025-01-08'),
(16, '11:00 AM', '05:00 PM', '2025-01-02 17:43:15', '2025-01-09'),
(17, '11:00 AM', '06:00 PM', '2025-01-02 17:43:15', '2025-01-10'),
(22, '09:00 AM', '07:00 PM', '2025-01-07 15:47:54', '2025-02-01'),
(23, '07:00 AM', '01:00 PM', '2025-01-08 03:10:39', '2025-01-11'),
(24, '08:00 AM', '02:00 PM', '2025-01-08 03:10:39', '2025-01-12'),
(25, '09:00 AM', '03:00 PM', '2025-01-08 03:10:39', '2025-01-13'),
(26, '10:00 AM', '04:00 PM', '2025-01-08 03:10:39', '2025-01-14'),
(27, '11:00 AM', '05:00 PM', '2025-01-08 03:10:39', '2025-01-15'),
(28, '12:00 PM', '06:00 PM', '2025-01-08 03:10:39', '2025-01-16'),
(29, '01:00 PM', '07:00 PM', '2025-01-08 03:10:39', '2025-01-17'),
(30, '11:00 AM', '07:00 PM', '2025-01-08 03:56:20', '2025-02-06'),
(32, '12:00 PM', '05:00 PM', '2025-01-13 07:55:05', '2025-01-22'),
(33, '10:00 AM', '01:00 PM', '2025-01-14 03:21:22', '2025-01-21'),
(34, '11:00 AM', '05:00 PM', '2025-01-16 06:11:13', '2025-01-18'),
(35, '09:00 AM', '02:00 PM', '2025-01-16 09:20:40', '2025-01-28'),
(36, '09:00 AM', '03:00 PM', '2025-01-17 06:53:34', '2025-01-23');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `birthday` date NOT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `email_add` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `companyName` varchar(255) DEFAULT NULL,
  `passwordChanged` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `age` int(11) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postalCode` varchar(10) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `companyPosition` varchar(255) DEFAULT NULL,
  `companyContact` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `firstName`, `lastName`, `birthday`, `mobile_number`, `email_add`, `address`, `password`, `username`, `status`, `companyName`, `passwordChanged`, `created_at`, `age`, `nationality`, `city`, `postalCode`, `gender`, `companyPosition`, `companyContact`) VALUES
(1, 'John Michael', 'Doe', '2024-03-28', '09123456789', 'john.doe@example.com', '1234 Main St, Cityville', '1wEr!rtya', 'john.doe12345', 'inactive', 'Apple Store', 1, '2025-01-07 14:17:44', 25, 'Filipino', 'Manila ', '1017', 'Male', 'CEO', '09666095399'),
(2, 'Jane', 'Smith', '1985-08-15', '0923456890', 'ruerasritchelle07@gmail.com', '456 Elm St, Townsville', '12345', 'smith.jane', 'active', 'Apple', 1, '2025-01-07 14:17:44', 30, 'Filipino', 'Quezon city', '2325', 'Female', 'CEO', '09709573613'),
(3, 'Ritchelle', 'Rueras', '2001-05-22', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', '1234', 'Rueras12345', 'inactive', 'TYESO', 1, '2025-01-07 14:17:44', 27, 'Filipino', 'Marikina City', '2790', 'Female', 'Secretary', '09056545560'),
(4, 'Monique', 'Cabigting', '2005-06-07', '098765432', 'ritchellerueras@gmail.com', 'Santa Mesa', 'monik1234', 'Cabigting12345', 'active', 'Vape Shop', 1, '2025-01-07 14:17:44', 25, 'filipino', 'PAsig', '9098', 'Female', 'Manager', '09276524356'),
(5, 'Clarieza', 'Baustista', '2024-10-01', '09709573613', 'clarieza@gmail.com', 'pasig city', 'Claire_bautista1', 'bautista.claireza', 'active', 'Beauty Parlor', 1, '2025-01-07 14:17:44', 29, 'Filipino', 'Paco', '1234', 'Female', 'Supervisor', '09666095399'),
(6, 'Rasheed', 'Horizon', '2013-06-09', '09709573613', 'clarieza@gmail.com', 'Surigao City', 'MEMA12345', 'mema.mimi', 'inactive', 'Horizon', 0, '2025-01-07 14:17:44', 34, 'filipino', 'makati', '2325', 'Male', 'CEO', '09666095399'),
(7, 'Mark', 'Vincent', '2023-12-20', '09709573613', 'clarieza@gmail.com', 'Butuan City', 'M1qWERT!', 'haha.huhu', 'active', 'DSWD', 1, '2025-01-07 14:17:44', 29, 'Filipino', 'makati', '2434', 'Male', 'caregiver', '09666095399'),
(8, 'MIGUEL ', 'REYES', '2024-04-23', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', 'SDJAS12345', 'sdjas.sbh', 'active', 'PYTHON', 0, '2025-01-07 14:17:44', 30, 'Filipino', 'manila', '2524', NULL, 'CEO', '09666095399'),
(9, 'XYRA', 'MALALUAN', '2024-04-23', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', 'SDJAS12345', 'sdjas.sbh', 'active', 'HP PHILIPPINES ', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'SECRETARY', '09666095399'),
(10, 'REJEAN', 'NOGUERRA', '2023-11-21', '09709573613', 'ritchellerueras@gmail.com', 'pasig city', 'DFAFDF12345', 'dfafdf.fafdvd', 'active', 'STUDENT', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'STUDENT', '09666095399'),
(11, 'Joshua', 'Latruel', '2024-10-30', '09709573613', 'ritchellerueras@gmail.com', 'surigao city', 'KKSDJSA12345', 'kksdjsa.jsdnsa', 'active', 'Manila Library', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'Librarian', '09666095399'),
(12, 'claireza', 'SISCON', '2023-07-10', '09709573613', 'clarieza@gmail.com', 'Surigao Citylalala', 'ASDAS12345', 'asdas.dasd', 'active', 'ITEL', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'PRESIDENT', '09666095399'),
(13, 'Rueras', 'Ritchelle', '2001-05-22', '09709573613', 'ritchellerueras@gmail.com', 'Sampaloc, Metro Manila', 'RITCHELLE12345', 'ritchelle.rueras', 'active', 'CONCENTRIX', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'SUPERVISOR', '09666095399'),
(14, 'Julie', 'Rueras', '2006-07-30', '09876543212', 'ritchellerueras@gmail.com', 'Dasmarinas, Cavite', 'Chelle_Rueras1234', 'rueras.julie', 'active', 'ABS-CBN', 1, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'EXECUTIVE PRODUCER', '09709573613'),
(15, 'Monique', 'Cabigting', '2023-06-08', '09709573613', 'ritchellerueras@gmail.com', 'santa mesa', 'CABIGTING12345', 'cabigting.monique', 'active', 'AMAZON', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'CUSTOMER SERVICE', '09709573613'),
(17, 'NOAH', 'PING', '2022-04-11', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', 'MEMA12345', 'mema.kmdlke', 'active', 'KATINGKO', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'DEVELOPER', NULL),
(18, 'Monique', 'rueras', '2000-05-21', '09709573613', 'ritchellerueras@gmail.com', 'surigao city', 'RUERAS12345', 'rueras.monique', 'active', 'TELEPERFORMANCE', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'TEAM LEADER', '09666095399'),
(19, 'Jen', 'Paclibar', '1980-05-22', '09876543212', 'ritchellerueras@gmail.com', 'bulacan', 'PACLIBAR12345', 'paclibar.jen', 'active', 'GOOGLE', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'PROGRAMMER', '09666095399'),
(20, 'Alba', 'Allon', '2024-06-05', '09876543212', 'ritchellerueras@gmail.com', 'rilles street', 'ALLON12345', 'allon.alba', 'active', 'HAFNI', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, 'AGENT', '09709573613'),
(21, 'Poca', 'Poca', '2022-12-07', '09709573613', 'ritchellerueras@gmail.com', 'boracay', 'POCA12345', 'poca.poca', 'active', 'Bora', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 'christ', 'Christopher', '2021-03-02', '09876567898', 'ritchellerueras@gmail.com', 'Pangasinan', 'Qwerty_123', 'christopher.christ', 'active', 'Food vlog', 1, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'Julie', 'Rueras', '2006-10-19', '09876543212', 'ruerasritchelle07@gmail.com', 'Dasmarinas, Cavite', 'RUERAS12345', 'rueras.julie', 'inactive', 'Table Tennis', 0, '2025-01-07 14:17:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 'Ehrica', 'Libay', '2001-05-22', '09709573613', 'ritchellerueras@gmail.com', '1151 I. DELOS REYES, METRO MANILA', 'LIBAY12345', 'libay.ehrica', 'active', 'ritchellerueras@gmail.com', 0, '2025-01-10 07:06:30', 24, 'Filipino', 'METRO MANILA', '1000', NULL, 'Student', '09709573613'),
(25, 'Kate Nicole', 'Santos', '2001-05-22', '09709573613', 'ritchellerueras@gmail.com', '1151 I. DELOS REYES, METRO MANILA', 'SANTOS12345', 'santos.kate nicole', 'active', 'ritchellerueras@gmail.com', 0, '2025-01-10 07:14:25', 24, 'Filipino', 'METRO MANILA', '1000', NULL, 'Student', '09709573613'),
(26, 'Ray', 'Pagulong', '2001-05-22', '09709573613', 'ritchellerueras@gmail.com', '1151 I. DELOS REYES, METRO MANILA', 'PAGULONG12345', 'pagulong.ray', 'active', 'ritchellerueras@gmail.com', 0, '2025-02-10 07:23:53', 24, 'Filipino', 'METRO MANILA', '1000', 'Male', 'Student', '09709573613'),
(27, 'Khenneath', 'Cruz', '1979-06-10', '09709573613', 'ritchellerueras@gmail.com', 'Paco', 'CRUZ12345', 'cruz.khenneath', 'active', 'ritchellerueras@gmail.com', 0, '2025-01-10 07:51:16', 44, 'Filipino', 'METRO MANILA', '1000', 'Male', 'Student', '09666095399'),
(28, 'Elaiza Jade', 'Buclares', '2000-12-30', '09709573613', 'ritchellerueras@gmail.com', 'Cebu Urgello', 'BUCLARES12345', 'buclares.elaiza_jade', 'active', 'PLM', 0, '2025-01-10 08:15:37', 24, 'Filipino', 'Cebu City', '6000', 'Female', 'Student', '09666095399'),
(29, 'Flor', 'Labajo', '2021-10-13', '09709573613', 'ritchellerueras@gmail.com', 'Margosatunig', 'LABAJO12345', 'labajo.flor', 'active', 'WTT', 0, '2025-01-10 08:21:42', 54, 'Filipino', 'Zamboanga del Sur', '6000', 'Female', 'Player', '09666095399'),
(30, 'July', 'DE LEOn', '2000-06-06', '09709573613', 'ritchellerueras@gmail.com', 'DAVAo', 'DE_LEON12345', 'de_leon.july', 'active', 'WTT', 0, '2025-01-10 08:28:18', 24, 'Filipino', 'DAVAO CITy', '8000', 'Female', 'Player', '09666095399'),
(31, 'ALFREDo', 'DACQUEl', '2008-02-16', '09709573613', 'moniquecabigting01@gmail.com', '1151 I. DELOS REYES, METRO MANILA', 'DACQUEL12345', 'dacquel.alfredo', 'active', 'STOCKORD', 0, '2025-01-15 17:35:57', 22, 'Filipino', 'METRO MANILA', '1000', 'Male', 'CHIEF AUDIT EXECUTIVE', '09709573613'),
(32, 'TRISHIa', 'SAN DIEGO', '2025-05-06', '09666095399', 'trishiasandiego24@gmail.com', 'PANDACAN', 'Sandiego07!!!', 'san_diego.trishia', 'active', 'COFFEE', 1, '2025-01-16 06:32:36', 22, 'PINO', 'MANLa', '1011', 'Female', 'auditor', '09914617184');

-- --------------------------------------------------------

--
-- Table structure for table `client_notifications`
--

CREATE TABLE `client_notifications` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `isRead` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_notifications`
--

INSERT INTO `client_notifications` (`id`, `client_id`, `title`, `description`, `timestamp`, `isRead`) VALUES
(1, 3, 'Appointment', 'you made an appointment', '2024-12-19 14:57:57', 0),
(2, 3, 'Appointment', 'you made an appointment', '2024-12-19 14:58:29', 0),
(3, 5, 'Payment', 'You have paid 300 for the project Cofee', '2024-12-19 15:00:10', 0),
(4, 5, 'Payment Received', 'Your payment of 15.00 USD was successful.', '2024-12-19 15:09:46', 0),
(5, 5, 'Appointment Scheduled', 'Your appointment on 2024-12-19 at 16:00 has been confirmed.', '2024-12-19 16:02:34', 0),
(6, 5, 'Appointment Scheduled', 'Your appointment on 2024-12-20 at 08:00 has been confirmed.', '2024-12-19 16:06:15', 0),
(7, 23, 'Appointment Scheduled', 'Your appointment on 2025-01-02 at 09:00 AM has been confirmed.', '2024-12-30 00:36:09', 0),
(8, 22, 'Appointment Scheduled', 'Your appointment on 2025-01-02 at 03:00 PM has been confirmed.', '2024-12-30 00:52:54', 0),
(9, 21, 'Appointment Scheduled', 'Your appointment on 2025-01-02 at 12:00 PM has been confirmed.', '2024-12-30 01:06:17', 0),
(10, 23, 'Appointment Scheduled', 'Your appointment on 2025-01-03 at 12:00 PM has been confirmed.', '2024-12-30 01:08:41', 0),
(11, 22, 'Appointment Scheduled', 'Your appointment on 2025-01-04 at 09:00 AM has been confirmed.', '2024-12-30 01:30:31', 0),
(12, 5, 'Payment Received', 'Your payment of 50.00 USD was successful.', '2025-01-02 18:06:57', 0),
(13, 5, 'Payment Received', 'Your payment of 45.00 USD was successful.', '2025-01-02 18:38:49', 0),
(14, 22, 'Appointment Scheduled', 'Your appointment on 2025-01-08 at 09:00 AM has been confirmed.', '2025-01-03 11:55:42', 0),
(15, 5, 'Appointment Scheduled', 'Your appointment on 2025-01-09 at 04:00 PM has been confirmed.', '2025-01-03 15:58:52', 0),
(16, 6, 'Appointment Scheduled', 'Your appointment on 2025-01-10 at 08:00 AM has been confirmed.', '2025-01-04 20:43:48', 0),
(17, 19, 'Appointment Scheduled', 'Your appointment on 2025-01-10 at 02:00 PM has been confirmed.', '2025-01-06 16:34:57', 0),
(18, 3, 'Appointment Scheduled', 'Your appointment on 2025-01-08 at 07:00 AM has been confirmed.', '2025-01-07 21:21:43', 0),
(19, 4, 'Appointment Scheduled', 'Your appointment on 2025-01-08 at 03:00 PM has been confirmed.', '2025-01-07 21:44:05', 0),
(20, 2, 'Appointment Scheduled', 'Your appointment on 2025-02-01 at 11:00 AM has been confirmed.', '2025-01-07 23:49:17', 0),
(21, 5, 'Appointment Scheduled', 'Your appointment on 2025-01-10 at 06:00 PM has been confirmed.', '2025-01-08 10:50:36', 0),
(22, 5, 'Appointment Scheduled', 'Your appointment on 2025-01-18 at 07:00 AM has been confirmed.', '2025-01-08 10:54:06', 0),
(23, 2, 'Payment Received', 'Your payment of 50.00 PHP was successful.', '2025-01-09 14:30:42', 0),
(24, 2, 'Payment Received', 'Your payment of 50.00 PHP was successful.', '2025-01-09 16:06:58', 0),
(25, 2, 'Payment Received', 'Your payment of 50.00 PHP was successful.', '2025-01-09 16:19:26', 0),
(26, 2, 'Payment Received', 'Your payment of 10.00 PHP was successful.', '2025-01-09 16:29:30', 0),
(27, 2, 'Appointment Scheduled', 'Your appointment on 2025-01-17 at 07:00 AM has been confirmed.', '2025-01-11 15:08:28', 0),
(28, 5, 'Payment Received', 'Your payment of 8230.00 PHP was successful.', '2025-01-15 00:20:51', 0),
(29, 5, 'Payment Received', 'Your payment of 598.00 PHP was successful.', '2025-01-15 00:34:26', 0),
(30, 5, 'Payment Received', 'Your payment of 598.00 PHP was successful.', '2025-01-15 01:03:52', 0),
(31, 5, 'Payment Received', 'Your payment of 598.00 PHP was successful.', '2025-01-15 01:06:39', 0),
(32, 5, 'Payment Received', 'Your payment of 45.00 PHP was successful.', '2025-01-15 13:18:18', 0),
(33, 5, 'Payment Received', 'Your payment of 1513.00 PHP was successful.', '2025-01-15 15:35:38', 0);

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `firstName` varchar(50) NOT NULL,
  `address` text DEFAULT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `email_add` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `birthday` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `modified_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `lastName`, `middleName`, `firstName`, `address`, `mobile_number`, `email_add`, `status`, `birthday`, `age`, `gender`, `role`, `modified_date`) VALUES
(4, 'CHARLENE', 'RUE', 'BALTAZAR', 'QUEZON CITY', '09876543212', 'char@gmail.com', 'active', '1983-01-11', 42, 'female', 'MESSENGER', '2025-01-16 01:19:02'),
(5, 'MARIANO', 'MARCOS', 'PERLITA', 'SURIGAO CITY', '09876543234', 'ritchellerueras@gmail.com', 'active', '2006-07-30', 18, 'female', 'CHIEF FINANCIAL OFFICER', '2025-01-11 00:48:19'),
(6, 'ARANTE', 'ISABELLE', 'JULLIANA', 'QUEZON CITY', '09876543234', 'ritchellerueras@gmail.com', 'inactive', '2001-06-05', 23, 'female', 'CHIEF AUDIT EXECUTIVE', '2025-01-16 01:41:43'),
(7, 'IGNACIO', 'SAN DIEGO', 'MARIA LOURDES', 'BALOT TONDO', '09709573613', 'ritchellerueras@gmail.com', 'active', '1983-12-23', 41, 'female', 'Chairman of the Board and Chief Executive Officer', '2025-01-12 14:33:27'),
(8, 'MARIANO', 'SAN', 'MARIA KATRINA FAYE', 'PACO', '09709573613', 'ritchellerueras@gmail.com', 'active', '1997-06-17', 27, 'female', 'CHIEF OPERATING OFFICER', '2025-01-11 00:39:47'),
(9, 'PEREIRA', 'RUERAS', 'KYLEE', '1151 I. DELOS REYES, METRO MANILA', '09709573613', 'ritchellerueras@gmail.com', 'active', '1993-02-16', 31, '', 'CHIEF AUDIT EXECUTIVE', '2025-01-16 01:01:25'),
(10, 'CENAS', 'T', 'ROSYL', '1151 I. DELOS REYES, METRO MANILA', '09709573613', 'ritchellerueras@gmail.com', 'inactive', '1993-06-16', 31, 'female', 'CHIEF OPERATING OFFICER', '2025-01-16 01:41:44'),
(11, 'JAY', 'RUERAS', 'JEO', '1151 I. DELOS REYES, METRO MANILA', '09709573613', 'ritchellerueras@gmail.com', 'active', '2010-06-09', 14, '', 'CHAIRMAN OF THE BOARD AND CHIEF EXECUTIVE OFFICER', '2025-01-16 01:08:00'),
(12, 'PEREIRA', 'RUERAS', 'LILIBETH', '', '09709573613', 'ruerasritchelle07@gmail.com', 'active', '2011-11-16', 13, 'female', 'INDEPENDENT AUDITOR', '2025-01-16 01:17:32');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `file_id` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `link` text DEFAULT NULL,
  `download_link` text DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `upload_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `file_id`, `original_name`, `link`, `download_link`, `project_id`, `uploaded_by`, `upload_date`) VALUES
(1, '1Y2yiTUtrJgJgh_3WPBXOAk8N2bbrOw0H', 'client-list.png', 'https://drive.google.com/file/d/1Y2yiTUtrJgJgh_3WPBXOAk8N2bbrOw0H/view?usp=drivesdk', 'https://drive.google.com/uc?id=1Y2yiTUtrJgJgh_3WPBXOAk8N2bbrOw0H&export=download', 7, 'admin', '2025-01-14 20:41:01'),
(2, '1BaS4osrIJXKurxFV8t3uW6GDpNVZn_wy', 'RESUME.pdf', 'https://drive.google.com/file/d/1BaS4osrIJXKurxFV8t3uW6GDpNVZn_wy/view?usp=drivesdk', 'https://drive.google.com/uc?id=1BaS4osrIJXKurxFV8t3uW6GDpNVZn_wy&export=download', 7, 'admin', '2025-01-14 21:00:50'),
(3, '1SnJS0rM-bSQMAHsniBvg0VbJGLVM_Bt0', 'ERP.docx', 'https://docs.google.com/document/d/1SnJS0rM-bSQMAHsniBvg0VbJGLVM_Bt0/edit?usp=drivesdk&ouid=117779346844162407505&rtpof=true&sd=true', 'https://drive.google.com/uc?id=1SnJS0rM-bSQMAHsniBvg0VbJGLVM_Bt0&export=download', 7, 'admin', '2025-01-14 21:02:30'),
(5, '1RkplfS5EDohRCN1XwPGPvVtJll2-tt67', 'Chap-12-di-pa-final.pdf', 'https://drive.google.com/file/d/1RkplfS5EDohRCN1XwPGPvVtJll2-tt67/view?usp=drivesdk', 'https://drive.google.com/uc?id=1RkplfS5EDohRCN1XwPGPvVtJll2-tt67&export=download', 8, 'admin', '2025-01-14 21:06:38'),
(6, '1sQgCMkwa5P1dT2V1aZIHtYpRzy9lvt2c', 'Chapter 3.pdf', 'https://drive.google.com/file/d/1sQgCMkwa5P1dT2V1aZIHtYpRzy9lvt2c/view?usp=drivesdk', 'https://drive.google.com/uc?id=1sQgCMkwa5P1dT2V1aZIHtYpRzy9lvt2c&export=download', 14, 'admin', '2025-01-14 21:29:51'),
(7, '1hkpJGBlhjsviZr_UI88YGdahZRrcbDoi', 'Chapter-3-di-pa-final.pdf', 'https://drive.google.com/file/d/1hkpJGBlhjsviZr_UI88YGdahZRrcbDoi/view?usp=drivesdk', 'https://drive.google.com/uc?id=1hkpJGBlhjsviZr_UI88YGdahZRrcbDoi&export=download', 14, '2', '2025-01-14 21:44:05'),
(8, '1C2FmNHphdrO1N84pEtuuZUF3jQtjd7mt', 'GROUP-4-iConsult.pptx', 'https://docs.google.com/presentation/d/1C2FmNHphdrO1N84pEtuuZUF3jQtjd7mt/edit?usp=drivesdk&ouid=117779346844162407505&rtpof=true&sd=true', 'https://drive.google.com/uc?id=1C2FmNHphdrO1N84pEtuuZUF3jQtjd7mt&export=download', 7, '5', '2025-01-15 04:13:43'),
(9, '1xlp1rnXbhgxnKVm3lHga083YVFeKYqK7', 'ReportsTab 1.jsx', 'https://drive.google.com/file/d/1xlp1rnXbhgxnKVm3lHga083YVFeKYqK7/view?usp=drivesdk', 'https://drive.google.com/uc?id=1xlp1rnXbhgxnKVm3lHga083YVFeKYqK7&export=download', 7, 'admin', '2025-01-15 12:43:00'),
(10, '1EH6OEKHUk9FHSO6kKKEeARVKyCPdhR8E', 'login.txt', 'https://drive.google.com/file/d/1EH6OEKHUk9FHSO6kKKEeARVKyCPdhR8E/view?usp=drivesdk', 'https://drive.google.com/uc?id=1EH6OEKHUk9FHSO6kKKEeARVKyCPdhR8E&export=download', 26, 'admin', '2025-01-17 15:08:44');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `timestamp` datetime NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `client_id` int(11) DEFAULT NULL,
  `postedBy` enum('admin','client') NOT NULL,
  `isReadAdmin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `description`, `timestamp`, `isRead`, `client_id`, `postedBy`, `isReadAdmin`) VALUES
(1, 'New Client Added', 'Client christ Christopher has been successfully created.', '2024-12-17 19:56:38', 1, 3, 'admin', 1),
(2, 'New Employee Added', 'Employee Julliana Arante has been successfully created.', '2024-12-17 20:47:33', 1, NULL, 'admin', 1),
(3, 'New Appointment Created', 'Appointment with Jerome Ponce (jerome.gmail.com) on 2024-12-25 at 11:00.', '2024-12-18 14:00:44', 1, NULL, 'admin', 1),
(4, 'Appointment by Monique Cabigting', 'Appointment with Monique Cabigting (ruerasritchelle@gmail.com) on 2024-12-18 at 13:00.', '2024-12-18 14:37:39', 1, 3, 'admin', 1),
(5, 'Appointment', 'Appointment with Julie Joy (ritchellerueras@gmail.com) on 2024-12-18 at 14:00.', '2024-12-18 15:40:53', 1, NULL, 'admin', 1),
(6, 'Appointment', 'Appointment with Kyle Rueras (ritchellerueras@gmail.com) on 2024-12-18 at 14:00.', '2024-12-18 15:51:02', 1, NULL, 'admin', 1),
(7, 'Appointment', 'Appointment with jdsjk (ritchellerueras@gmail.com) on 2024-12-18 at 16:00.', '2024-12-18 15:59:23', 0, NULL, 'admin', 1),
(8, 'New Payment Received', 'Client John Doe paid 15.00 USD.', '2024-12-18 21:57:57', 1, NULL, 'admin', 1),
(9, 'New Payment Received', 'Client John Doe paid 15.00 USD.', '2024-12-19 15:09:46', 0, NULL, 'admin', 1),
(10, 'Appointment', 'Appointment with Ritchelle Rueras (ritchellerueras@gmail.com) on 2024-12-19 at 16:00.', '2024-12-19 15:48:06', 0, NULL, 'admin', 1),
(11, 'Appointment', 'Appointment with mornik (ritchellerueras@gmail.com) on 2024-12-19 at 16:00.', '2024-12-19 15:57:08', 0, NULL, 'admin', 1),
(12, 'Appointment', 'Appointment with mornik (ritchellerueras@gmail.com) on 2024-12-19 at 16:00.', '2024-12-19 16:02:34', 1, NULL, 'admin', 1),
(13, 'Appointment', 'Appointment with Julie Joy Rueras (ritchellerueras@gmail.com) on 2024-12-20 at 08:00.', '2024-12-19 16:06:15', 1, NULL, 'admin', 1),
(14, 'New Client Added', 'Client Julie Rueras has been successfully created.', '2024-12-19 16:21:35', 0, NULL, 'admin', 1),
(15, 'Appointment', 'Appointment with Julie Rueras (ruerasritchelle07@gmail.com) on 2025-01-02 at 09:00 AM.', '2024-12-30 00:36:09', 1, NULL, 'admin', 1),
(16, 'Appointment', 'Appointment with christ Christopher (ritchellerueras@gmail.com) on 2025-01-02 at 03:00 PM.', '2024-12-30 00:52:54', 0, NULL, 'admin', 1),
(17, 'Appointment', 'Appointment with Poca Poca (ritchellerueras@gmail.com) on 2025-01-02 at 12:00 PM.', '2024-12-30 01:06:17', 0, NULL, 'admin', 1),
(18, 'Appointment', 'Appointment with Julie Rueras (ruerasritchelle07@gmail.com) on 2025-01-03 at 12:00 PM.', '2024-12-30 01:08:41', 1, NULL, 'admin', 1),
(19, 'Appointment', 'Appointment with christ Christopher (ritchellerueras@gmail.com) on 2025-01-04 at 09:00 AM.', '2024-12-30 01:30:31', 0, NULL, 'admin', 1),
(20, 'New Payment Received', 'Client John Doe paid 50.00 USD.', '2025-01-02 10:06:57', 0, NULL, 'admin', 1),
(21, 'New Payment Received', 'Client John Doe paid 45.00 USD.', '2025-01-02 10:38:49', 1, NULL, 'admin', 1),
(22, 'Appointment', 'Appointment with claireza Rueras (ritchellerueras@gmail.com) on 2025-01-08 at 09:00 AM.', '2025-01-03 11:55:42', 0, NULL, 'admin', 1),
(23, 'Appointment', 'Appointment with Kyle Rueras (ritchelle.rueras@tup.edu.ph) on 2025-01-09 at 04:00 PM.', '2025-01-03 15:58:52', 0, NULL, 'admin', 1),
(24, 'Appointment', 'Appointment with mimi mema (clarieza@gmail.com) on 2025-01-10 at 08:00 AM.', '2025-01-04 20:43:48', 1, NULL, 'admin', 1),
(25, 'Appointment', 'Appointment with Jen Paclibar (ritchellerueras@gmail.com) on 2025-01-10 at 02:00 PM.', '2025-01-06 16:34:57', 0, NULL, 'admin', 1),
(26, 'Appointment', 'Appointment with Ritchelle Rueras (ritchellerueras@gmail.com) on 2025-01-08 at 07:00 AM.', '2025-01-07 21:21:43', 0, NULL, 'admin', 1),
(27, 'Appointment', 'Appointment with Monique Cabigting (ritchellerueras@gmail.com) on 2025-01-08 at 03:00 PM.', '2025-01-07 21:44:05', 0, NULL, 'admin', 1),
(28, 'Appointment', 'Appointment with Rosyl Cenas (ritchellerueras@gmail.com) on 2025-02-01 at 11:00 AM.', '2025-01-07 23:49:17', 0, NULL, 'admin', 1),
(29, 'Appointment', 'Appointment with claireza bautista (clarieza@gmail.com) on 2025-01-10 at 06:00 PM.', '2025-01-08 10:50:36', 0, NULL, 'admin', 1),
(30, 'Appointment', 'Appointment with claireza bautista (clarieza@gmail.com) on 2025-01-18 at 07:00 AM.', '2025-01-08 10:54:06', 1, NULL, 'admin', 1),
(31, 'New Payment Received', 'Client John Doe paid 50.00 PHP.', '2025-01-09 06:30:42', 0, NULL, 'admin', 1),
(32, 'New Payment Received', 'Client John Doe paid 50.00 PHP.', '2025-01-09 08:06:58', 0, NULL, 'admin', 1),
(33, 'New Payment Received', 'Client John Doe paid 50.00 PHP.', '2025-01-09 08:19:26', 0, NULL, 'admin', 1),
(34, 'New Payment Received', 'Client John Doe paid 10.00 PHP.', '2025-01-09 08:29:30', 0, NULL, 'admin', 1),
(35, 'Appointment', 'Appointment with Jane Smith (ruerasritchelle07@gmail.com) on 2025-01-17 at 07:00 AM.', '2025-01-11 15:08:28', 0, NULL, 'admin', 1),
(36, 'Appointment Scheduled', 'Consultation scheduled for 2025-01-16 at 02:00 PM.', '2025-01-11 16:14:51', 1, NULL, 'client', 1),
(37, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 15, 2025 at 06:00 PM.', '2025-01-11 17:00:46', 1, 2, 'client', 1),
(38, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 22, 2025 at 01:00 PM.', '2025-01-14 02:36:17', 0, 2, 'client', 0),
(39, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 16, 2025 at 03:00 PM.', '2025-01-14 09:48:14', 0, 2, 'admin', 0),
(40, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 18, 2025 at 10:00 AM.', '2025-01-14 10:32:03', 0, 2, 'client', 0),
(41, 'Appointment Scheduled', 'Consultation scheduled for MONIQUE CABIGTING on January 16, 2025 at 09:00 AM.', '2025-01-14 10:46:06', 0, 4, 'admin', 0),
(42, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 18, 2025 at 05:00 PM.', '2025-01-14 10:47:35', 0, 2, 'client', 0),
(43, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 15, 2025 at 11:00 AM.', '2025-01-14 15:10:33', 0, 2, 'client', 0),
(44, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 17, 2025 at 03:00 PM.', '2025-01-14 15:15:42', 0, 2, 'client', 0),
(45, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 17, 2025 at 06:00 PM.', '2025-01-14 15:16:49', 0, 2, 'client', 0),
(46, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 22, 2025 at 02:00 PM.', '2025-01-14 15:24:31', 0, 2, 'client', 0),
(47, 'Appointment Scheduled', 'Consultation scheduled for RITCHELLE RUERAS on January 31, 2025 at 03:00 PM.', '2025-01-14 15:40:34', 0, 3, 'admin', 0),
(48, 'New Payment Received', 'Client John Doe paid 8230.00 PHP.', '2025-01-14 16:20:51', 0, NULL, 'admin', 0),
(49, 'New Payment Received', 'Client John Doe paid 598.00 PHP.', '2025-01-14 16:34:26', 0, NULL, 'admin', 0),
(50, 'New Payment Received', 'Client John Doe paid 598.00 PHP.', '2025-01-14 17:03:52', 0, NULL, 'admin', 0),
(51, 'New Payment Received', 'Client John Doe paid 598.00 PHP.', '2025-01-14 17:06:39', 0, NULL, 'admin', 1),
(52, 'Appointment Scheduled', 'Consultation scheduled for CLARIEZA BAUSTISTA on January 31, 2025 at 12:00 PM.', '2025-01-15 04:39:50', 0, 5, 'client', 0),
(53, 'New Payment Received', 'Client John Doe paid 45.00 PHP.', '2025-01-15 05:18:18', 0, NULL, 'admin', 0),
(54, 'New Payment Received', 'Client John Doe paid 1513.00 PHP.', '2025-01-15 07:35:38', 0, NULL, 'admin', 0),
(55, 'Appointment Scheduled', 'Consultation scheduled for JANE SMITH on January 23, 2025 at 07:00 AM.', '2025-01-16 17:20:07', 0, 2, 'admin', 0),
(56, 'Appointment Scheduled', 'Consultation scheduled for TRISHIA SAN DIEGO on January 23, 2025 at 11:00 AM.', '2025-01-17 13:37:32', 0, 32, 'admin', 0),
(57, 'Appointment Scheduled', 'Consultation scheduled for TRISHIA SAN DIEGO on January 23, 2025 at 01:00 PM.', '2025-01-17 13:57:20', 0, 32, 'client', 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `payer_name` varchar(255) NOT NULL,
  `payer_email` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `payed_to_email` varchar(255) NOT NULL,
  `payee_merchant_id` varchar(255) DEFAULT NULL,
  `payee_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `client_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `transaction_id`, `payer_name`, `payer_email`, `amount`, `currency`, `payed_to_email`, `payee_merchant_id`, `payee_name`, `created_at`, `client_id`, `project_id`) VALUES
(1, '82V683108H2375644', 'John Doe', 'sb-x2i47834694194@personal.example.com', 20.00, 'USD', 'Sharp Minds', NULL, NULL, '2024-12-18 12:01:36', NULL, NULL),
(2, '44902679CF354034B', 'John Doe', 'sb-x2i47834694194@personal.example.com', 21.00, 'USD', 'ritchelle.rueras@tup.edu.ph', NULL, NULL, '2024-12-18 12:14:45', NULL, NULL),
(3, '29S25917Y89617702', 'John Doe', 'sb-x2i47834694194@personal.example.com', 15.00, 'USD', 'ritchelle.rueras@tup.edu.ph', NULL, NULL, '2024-12-18 12:36:44', 3, NULL),
(4, '09N39975HP337261B', 'John Doe', 'sb-x2i47834694194@personal.example.com', 15.00, 'USD', 'ritchelle.rueras@tup.edu.ph', NULL, NULL, '2024-12-18 13:57:57', 3, NULL),
(5, '7XG522585E497851R', 'John Doe', 'sb-x2i47834694194@personal.example.com', 15.00, 'USD', 'ritchelle.rueras@tup.edu.ph', NULL, NULL, '2024-12-19 07:09:46', 5, NULL),
(6, '5UJ88158SL470325F', 'John Doe', 'sb-x2i47834694194@personal.example.com', 50.00, 'USD', 'ritchelle.rueras@tup.edu.ph', NULL, NULL, '2025-01-02 10:06:57', 5, 17),
(7, '5EV634229L456502N', 'John Doe', 'sb-x2i47834694194@personal.example.com', 45.00, 'USD', 'ritchelle.rueras@tup.edu.ph', NULL, NULL, '2025-01-02 10:38:48', 5, 17),
(8, '6HH64811WC266721W', 'John Doe', 'sb-x2i47834694194@personal.example.com', 50.00, 'PHP', 'ritchelle.rueras@tup.edu.ph', NULL, NULL, '2025-01-09 06:30:42', 2, 14),
(9, '2MM29053BC502073C', 'John Doe', 'sb-x2i47834694194@personal.example.com', 50.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'Unknown Merchant Name', '2025-01-09 08:06:58', 2, 14),
(10, '8WD165671W0319429', 'John Doe', 'sb-x2i47834694194@personal.example.com', 50.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'Unknown Merchant Name', '2025-01-09 08:19:26', 2, 14),
(11, '01P28405RE497924Y', 'John Doe', 'sb-x2i47834694194@personal.example.com', 10.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'Unknown Merchant Name', '2025-01-09 08:29:30', 2, 14),
(12, '4SV402608Y256953R', 'John Doe', 'sb-x2i47834694194@personal.example.com', 8230.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'sb-id7hu34654140@business.example.com', '2025-01-14 16:20:51', 5, 18),
(13, '9U7778809G119394C', 'John Doe', 'sb-x2i47834694194@personal.example.com', 598.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'sb-id7hu34654140@business.example.com', '2025-01-14 16:34:26', 5, 18),
(14, '79462908YR520642T', 'John Doe', 'sb-x2i47834694194@personal.example.com', 598.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'sb-id7hu34654140@business.example.com', '2025-01-14 17:03:52', 5, 18),
(15, '56949455EW192200Y', 'John Doe', 'sb-x2i47834694194@personal.example.com', 598.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'sb-id7hu34654140@business.example.com', '2025-01-14 17:06:39', 5, 18),
(16, '74F88148262988200', 'John Doe', 'sb-x2i47834694194@personal.example.com', 45.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'sb-id7hu34654140@business.example.com', '2025-01-15 05:18:18', 5, 17),
(17, '53A87602P6285325M', 'John Doe', 'sb-x2i47834694194@personal.example.com', 1513.00, 'PHP', 'sb-id7hu34654140@business.example.com', '7YBPBFAVM55H2', 'sb-id7hu34654140@business.example.com', '2025-01-15 07:35:38', 5, 7);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `projectName` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `status` enum('Ongoing','Pending','Completed') NOT NULL DEFAULT 'Ongoing',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `clientId` int(11) NOT NULL,
  `contractPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paymentStatus` enum('Paid','Not Paid','Partial Payment') DEFAULT 'Not Paid',
  `downpayment` decimal(10,2) DEFAULT 0.00,
  `actualStart` datetime DEFAULT NULL,
  `actualFinish` datetime DEFAULT NULL,
  `isReview` tinyint(1) DEFAULT 0,
  `paymentDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `clientName`, `projectName`, `description`, `startDate`, `endDate`, `status`, `created_at`, `isDeleted`, `clientId`, `contractPrice`, `paymentStatus`, `downpayment`, `actualStart`, `actualFinish`, `isReview`, `paymentDate`) VALUES
(6, 'John Doe', 'qwqw', 'dnasjdjs', '2024-11-15', '2024-11-22', 'Ongoing', '2025-01-14 07:29:16', 1, 5, 0.00, 'Not Paid', NULL, NULL, NULL, 0, NULL),
(7, 'claireza bautista', 'Coffee Project', 'Handling business transactions', '2024-11-29', '2025-02-15', 'Completed', '2025-01-14 09:49:23', 0, 5, 178.00, 'Paid', 10513.00, '2025-01-15 02:46:05', '2025-01-15 07:36:01', 1, '2025-01-16 18:10:52'),
(8, 'Ritchelle Rueras', 'Snack Bar', 'music prod', '2024-11-15', '2024-12-07', 'Completed', '2025-01-14 10:06:23', 0, 5, 200.00, 'Paid', 100.00, '2025-01-15 02:51:29', '2025-01-16 06:55:13', 0, '2025-01-16 18:24:49'),
(9, 'Monique Cabigting', 'PRMS', 'Project Management system ', '2024-11-16', '2025-04-15', 'Completed', '2025-02-14 16:52:07', 0, 4, 5000.00, 'Partial Payment', 200.00, '2025-01-12 06:24:30', '2025-01-12 06:25:10', 0, NULL),
(10, 'Jane Smith', 'DBMS', 'hahahaha', '2024-11-16', '2024-12-05', 'Completed', '2025-01-14 17:05:19', 0, 0, 0.00, 'Partial Payment', NULL, '2025-01-11 15:19:54', '2025-01-11 15:19:57', 0, NULL),
(11, 'mimi mema', 'qwer', 'dmsd', '2024-11-16', '2025-11-23', 'Completed', '2025-01-14 17:24:15', 1, 0, 0.00, 'Not Paid', NULL, NULL, '2025-01-14 09:47:48', 0, NULL),
(12, 'John Doe', 'mema', 'lapapapa', '2025-01-23', '2024-12-07', 'Ongoing', '2025-11-16 08:12:45', 1, 0, 0.00, 'Not Paid', NULL, NULL, NULL, 0, NULL),
(13, 'Ritchelle Rueras', 'Rrr', 'rrrrrrrr', '2024-11-19', '2024-12-07', 'Ongoing', '2025-11-17 16:49:45', 1, 0, 0.00, 'Not Paid', NULL, NULL, NULL, 0, NULL),
(14, 'Jane Smith', 'Purple Desk', 'study hub', '2024-11-21', '2025-06-26', 'Ongoing', '2025-01-17 17:12:09', 0, 2, 60.00, 'Not Paid', 50.00, NULL, NULL, 0, NULL),
(15, 'Jane Smith', 'jdkasd', 'hhahahaha', '2024-11-30', '2025-05-01', 'Ongoing', '2025-01-21 02:28:43', 1, 2, 0.00, 'Not Paid', NULL, NULL, NULL, 0, NULL),
(16, 'sbh sdjas', 'ndjas', 'lalalalala', '2024-11-28', '2025-05-01', 'Ongoing', '2025-01-21 02:29:14', 1, 8, 0.00, 'Not Paid', NULL, NULL, NULL, 0, NULL),
(17, 'claireza bautista', 'Water Station', 'refilling station business', '2025-01-03', '2025-07-23', 'Completed', '2024-11-21 06:52:07', 0, 5, 5.00, 'Partial Payment', 65.00, NULL, NULL, 0, NULL),
(18, 'claireza bautista', 'Samgyupsal', 'lalalalalalalove', '2024-12-26', '2025-10-30', 'Completed', '2024-12-22 14:07:48', 0, 5, 50.00, 'Paid', 598.00, NULL, '2025-01-20 11:28:28', 0, '2025-01-20 11:28:42'),
(19, 'Ritchelle Rueras', 'Vista Mall', 'tax pay', '2024-12-28', '2025-12-27', 'Ongoing', '2024-12-26 14:36:44', 0, 3, 1000.00, 'Not Paid', 0.00, NULL, NULL, 0, NULL),
(20, 'Monique Cabigting', 'Moontoon', 'renewal', '2024-12-26', '2025-01-11', 'Ongoing', '2024-12-26 15:41:33', 0, 4, 2000.00, 'Not Paid', 100.00, NULL, NULL, 0, NULL),
(21, 'Ritchelle Rueras', 'Apartment', 'Apartment construction projects', '2025-01-09', '2026-01-07', 'Ongoing', '2025-01-06 19:33:25', 0, 3, 300.00, 'Not Paid', 30000.00, '2025-01-15 18:35:49', NULL, 0, NULL),
(22, 'Julie Rueras', '711', '711 payroll', '2025-01-08', '2025-05-22', 'Ongoing', '2025-01-07 09:54:09', 1, 14, 2000.00, 'Not Paid', 0.00, NULL, NULL, 0, NULL),
(23, 'John Michael Doe', 'Aquaflask', 'business setup', '2025-01-18', '2025-02-26', 'Ongoing', '2025-01-11 13:58:44', 0, 1, 10000.00, 'Not Paid', 0.00, '2025-01-20 11:28:14', NULL, 0, NULL),
(24, 'July DE LEOn', 'Tiktok Shop', 'Revenue Tracking', '2025-01-13', '2026-05-29', 'Ongoing', '2025-01-11 21:14:18', 0, 30, 1000.00, 'Not Paid', 0.00, '2025-01-15 03:33:42', NULL, 0, NULL),
(25, 'Clarieza Baustista', 'Watson', 'health and lifestyle', '2025-01-31', '2025-02-28', 'Ongoing', '2025-01-17 06:59:36', 1, 5, 1000.00, 'Not Paid', 1000.00, '2025-01-17 07:03:40', NULL, 0, NULL),
(26, 'Clarieza Baustista', 'Watson PH', 'life style and health', '2025-01-17', '2025-01-31', 'Completed', '2025-01-17 07:07:24', 0, 5, 1000.00, 'Not Paid', 0.00, '2025-01-17 07:08:56', '2025-01-17 07:08:59', 0, NULL),
(27, 'MIGUEL  REYES', 'HODEKT', 'FAN', '2025-01-22', '2025-05-29', 'Pending', '2025-01-20 11:30:03', 0, 8, 1000.00, 'Not Paid', 100.00, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `status` enum('pending','reviewed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `client_id`, `project_id`, `rating`, `comment`, `status`, `created_at`) VALUES
(1, 5, 17, 5, 'The consultant was incredibly professional and knowledgeable. They provided clear guidance that helped us streamline our operations and boost efficiency. Their strategic advice was spot-on, and they went above and beyond to ensure we understood every step. Highly recommended!', 'reviewed', '2025-01-02 11:55:51'),
(2, 5, 7, 4, 'Working with this consultant was a game-changer for our company. They brought fresh perspectives and introduced tools that significantly improved our workflow. Their expertise and dedication were evident throughout the project. We’re excited to work with them again!', 'reviewed', '2025-01-11 21:41:38'),
(3, 5, 7, 3, 'The consultant was knowledgeable and offered some useful recommendations. However, I felt that some areas of our concerns were not addressed thoroughly. There is room for improvement in terms of communication and attention to detail.', 'reviewed', '2025-01-11 21:53:13'),
(4, 5, 17, 4, 'I was impressed with the overall quality of the service. The consultant provided clear communication and delivered on time. However, there was a minor delay in addressing one of my follow-up questions. Aside from that, everything was great! I would definitely recommend this service to others.', 'reviewed', '2025-01-15 05:50:49');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `task_fee` decimal(10,2) NOT NULL,
  `due_date` varchar(255) NOT NULL,
  `employee` varchar(255) NOT NULL,
  `miscellaneous` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`miscellaneous`)),
  `status` enum('Ongoing','Pending','Completed') DEFAULT 'Pending',
  `project_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amount` decimal(10,2) DEFAULT NULL,
  `actual_finish` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `task_name`, `task_fee`, `due_date`, `employee`, `miscellaneous`, `status`, `project_id`, `created_at`, `updated_at`, `amount`, `actual_finish`) VALUES
(1, 'BIR', 100.00, '2025-01-25', '5', '[{\"name\":\"Gas\",\"fee\":\"100\"}]', 'Ongoing', 18, '2024-12-22 18:14:59', '2025-01-14 16:27:18', 200.00, NULL),
(2, 'Tax', 50.00, '2025-01-30', '5', '[{\"name\":\"Food\",\"fee\":\"100\"},{\"name\":\"Gas\",\"fee\":\"500\"},{\"name\":\"Internet\",\"fee\":\"100\"},{\"name\":\"Accomodotion\",\"fee\":\"100\"}]', 'Completed', 7, '2024-12-26 17:14:37', '2025-01-20 11:32:49', 850.00, '2025-01-11 18:19:55'),
(3, 'Payroll', 10.00, '2025-01-24', '1', '[{\"name\":\"Rent\",\"fee\":\"5000\"}]', 'Completed', 7, '2024-12-26 17:18:14', '2025-01-15 03:32:24', 5010.00, '2025-01-11 18:17:35'),
(4, 'Design Homepage', 50.00, '2025-01-15', '1', '[{\"name\":\"Design tools\",\"fee\":50}]', 'Completed', 18, '2024-12-31 08:21:35', '2025-01-14 16:27:37', 100.00, NULL),
(5, 'Develop Login Page', 8.00, '2025-01-31', '2', '[{\"name\":\"Backend setup\",\"fee\":100}]', 'Ongoing', 18, '2024-12-31 08:21:35', '2025-01-14 16:32:20', 108.00, NULL),
(6, 'Testing and QA', 30.00, '2024-01-25', '3', '[{\"name\": \"Testing tools\", \"fee\": 30}]', 'Pending', 17, '2024-12-31 08:21:35', '2025-01-02 09:50:36', 60.00, NULL),
(7, 'Database Optimization', 60.00, '2025-01-16', '4', '[{\"name\":\"Database license\",\"fee\":80}]', 'Pending', 18, '2024-12-31 08:21:35', '2025-01-14 16:31:08', 140.00, NULL),
(8, 'BIR Payment', 1000.00, '2025-01-29', '3', '[{\"name\":\"Food\",\"fee\":\"100\"},{\"name\":\"Gas\",\"fee\":\"500\"}]', 'Completed', 7, '2025-01-03 07:28:10', '2025-01-14 17:54:51', 1600.00, '2025-01-14 17:54:51'),
(11, 'Payroll', 500.00, '2025-02-05', '4', '[{\"name\":\"Food\",\"fee\":\"200\"},{\"name\":\"Utility\",\"fee\":\"50\"},{\"name\":\"Papers\",\"fee\":\"25\"}]', 'Completed', 7, '2025-01-05 06:13:41', '2025-01-14 17:54:58', 775.00, '2025-01-14 17:54:58'),
(12, 'Music Production', 2000.00, '2025-01-08', '5', '[{\"name\":\"Studio Rent\",\"fee\":\"3000\"}]', 'Pending', 8, '2025-01-05 06:26:19', '2025-01-07 20:19:06', 5000.00, NULL),
(13, 'Cloud', 1300.00, '2025-01-31', '6', '[{\"name\":\"Internet\",\"fee\":\"1300\"}]', 'Pending', 10, '2025-01-06 09:17:17', '2025-01-07 19:53:20', 2600.00, NULL),
(14, 'Payroll', 500.00, '2025-01-16', '6', '[{\"name\":\"Utilities\",\"fee\":\"500\"},{\"name\":\"Food\",\"fee\":\"500\"}]', 'Pending', 22, '2025-01-07 17:51:54', '2025-01-07 17:51:54', 1500.00, NULL),
(15, 'Payroll', 500.00, '2025-01-16', '6', '[{\"name\":\"Utilities\",\"fee\":\"500\"},{\"name\":\"Food\",\"fee\":\"500\"}]', 'Pending', 22, '2025-01-07 18:00:14', '2025-01-07 18:00:14', 1500.00, NULL),
(16, 'Business Registration', 2000.00, '2025-01-31', '8', '[{\"name\":\"Transportation\",\"fee\":\"100\"},{\"name\":\"Food\",\"fee\":\"200\"}]', 'Completed', 7, '2025-01-11 18:42:48', '2025-01-14 17:55:09', 2300.00, '2025-01-14 17:55:09'),
(17, 'Tax Payment', 1000.00, '2025-02-28', '7', '[{\"name\":\"Transportation\",\"fee\":\"100\"}]', 'Pending', 9, '2025-01-11 18:49:15', '2025-01-11 18:49:15', 1100.00, NULL),
(19, 'Payroll', 100.00, '2025-01-31', '6', '[{\"name\":\"Utilities\",\"fee\":\"500\"}]', 'Pending', 19, '2025-01-15 04:51:52', '2025-01-15 04:51:52', 600.00, NULL),
(20, 'Bir Registration', 1000.00, '2025-02-24', '7', '[{\"name\":\"Transportation\",\"fee\":\"100\"},{\"name\":\"Food\",\"fee\":\"100\"}]', 'Pending', 19, '2025-01-15 04:53:03', '2025-01-15 04:53:03', 1200.00, NULL),
(21, 'Payroll', 500.00, '2025-01-28', '7', '[{\"name\":\"Accomodotion\",\"fee\":\"100\"}]', 'Pending', 14, '2025-01-17 02:54:17', '2025-01-17 02:54:17', 600.00, NULL),
(22, 'Payroll', 1000.00, '2025-01-29', '4', '[{\"name\":\"Food\",\"fee\":\"100\"}]', 'Pending', 26, '2025-01-17 07:08:08', '2025-01-17 07:08:08', 1100.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(50) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `uploaded_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`id`, `project_id`, `file_name`, `original_name`, `file_type`, `upload_date`, `uploaded_by`) VALUES
(12, 7, '1735321761623.pdf', 'ERP.pdf', 'application/pdf', '2024-12-27 17:49:21', 'admin'),
(13, 7, '1735321787037.jpg', 'logo.jpg', 'image/jpeg', '2024-12-27 17:49:47', 'admin'),
(15, 18, '1735321855502.pptx', 'GEE 13D_RVA_Week 2.pptx', 'application/vnd.openxmlformats-officedocument.pres', '2024-12-27 17:50:56', '5'),
(16, 18, '1735824190614.jpg', '1.jpg', 'image/jpeg', '2025-01-02 13:23:10', '5'),
(17, 8, '1735824351251.pdf', 'reg.cor2.pdf', 'application/pdf', '2025-01-02 13:25:51', '5'),
(18, 8, '1735825716804.pdf', 'RESUME.pdf', 'application/pdf', '2025-01-02 13:48:36', '5'),
(19, 8, '1735835066875.png', 'Data Flow Diagram.png', 'image/png', '2025-01-02 16:24:26', 'admin'),
(20, 8, '1735835084923.docx', '6 Proposal Format.docx', 'application/vnd.openxmlformats-officedocument.word', '2025-01-02 16:24:44', 'admin'),
(21, 7, '1735963959226.pptx', 'GROUP-4-iConsult.pptx', 'application/vnd.openxmlformats-officedocument.pres', '2025-01-04 04:12:39', '5'),
(22, 14, '1736489347325.pdf', 'Sharp-Minds-Business-and-Consultancy-Inc.-2022-AFS.pdf', 'application/pdf', '2025-01-10 06:09:07', '2'),
(23, 14, '1736489662756.pdf', 'Sharp-Minds-Business-and-Consultancy-Inc.-2023-1702AITR-SAWT-Sched.pdf', 'application/pdf', '2025-01-10 06:14:22', '2'),
(24, 14, '1736489938323.pdf', 'Sharp-Minds-Business-and-Consultancy-Inc.-2023-1702AITR-SAWT-Sched.pdf', 'application/pdf', '2025-01-10 06:18:58', '2'),
(25, 14, '1736489982705.pdf', 'iConsult-Manuscript_Marked.pdf', 'application/pdf', '2025-01-10 06:19:42', '2'),
(26, 14, '1736490127582.docx', 'Monik_Consultant Side.docx', 'application/vnd.openxmlformats-officedocument.word', '2025-01-10 06:22:07', '2'),
(27, 7, '1736626107504.docx', 'iConsult-Manuscript_100624.docx', 'application/vnd.openxmlformats-officedocument.word', '2025-01-11 20:08:27', 'admin'),
(28, 7, '1736626117411.txt', 'Analytics and Reporting.txt', 'text/plain', '2025-01-11 20:08:37', 'admin'),
(29, 7, '1736665314873.pdf', 'G4 Topic Proposal.pdf', 'application/pdf', '2025-01-12 07:01:54', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `availability`
--
ALTER TABLE `availability`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client_notifications`
--
ALTER TABLE `client_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `availability`
--
ALTER TABLE `availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `client_notifications`
--
ALTER TABLE `client_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
