-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2025 at 09:28 AM
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
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`username`, `password`, `created_at`) VALUES
('admin', '1234', '2024-09-08 20:54:27');

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
(1, '2024-12-30', '09:00 AM', 'hsgad', 'ruerasritchelle@gmail.com', 'Legal Advisory', 'pupu', 'In-Person', '2024-11-17 06:04:36', NULL, NULL, NULL, NULL),
(2, '2024-11-20', '08:00 AM', 'rITCHELLE RUERAS', 'ritchellerueras@gmail.com', 'Employee Benefits and Compliance Advisory', 'HAKDOG', 'In-Person', '2024-11-17 06:29:33', 0, NULL, NULL, NULL),
(4, '2024-11-22', '02:00 PM', 'CHELLE', 'ruerasritchelle@gmail.com', 'Risk Management Consultation', 'RISKY', 'Video Call', '2024-11-17 06:46:26', 0, NULL, NULL, NULL),
(5, '2024-11-19', '04:00 PM', 'MONIK', 'ritchellerueras@gmail.com', 'Risk Management Consultation', 'RISKYYY', 'Video Call', '2024-11-17 06:55:32', 3, NULL, NULL, NULL),
(6, '2025-01-09', '11:00 AM', 'CLARIEZA BAUTISTA', 'CLAIRE@gmail.com', 'Legal Advisory', 'hakdog', 'In-Person', '2024-11-17 07:05:42', 5, '09876543212', 'Bora', NULL),
(7, '2024-11-24', '03:00 PM', 'claire', 'ritchellerueras@gmail.com', 'Organizational Development Advisory', 'haha', 'Video Call', '2024-11-17 07:21:06', 5, '09876543212', NULL, NULL),
(8, '2024-11-30', '09:00 AM', 'bautista', 'bautista@gmail.com', 'Risk Management Consultation', 'bautista', 'In-Person', '2024-11-17 07:26:31', 5, '09876787654', NULL, NULL),
(9, '2024-11-18', '09:00 AM', 'rueras', 'ruerasritchelle@gmail.com', 'Organizational Development Advisory', 'org', 'Video Call', '2024-11-17 07:29:01', 5, '09876543211', NULL, NULL),
(10, '2024-12-28', '11:00 AM', 'hgj', 'ruerasritchelle@gmail.com', 'Corporate Governance Review', 'gjhg', 'In-Person', '2024-12-15 19:06:39', 5, '09876543212', NULL, NULL),
(12, '2025-01-09', '02:00 PM', 'Julien Cohen', 'ritchellerueras@gmail.com', 'music type', 'music reco', 'Video Call', '2024-12-17 08:29:32', 5, '09876543212', 'Tiktok', '2 hours before'),
(13, '2025-01-08', '11:00 AM', 'Jerome Ponce', 'jerome.gmail.com', 'Risk Management Consultation', 'very demure', 'Phone Call', '2024-12-18 06:00:44', 5, '09876543456', 'Sir Allon ALba TV', '5 minutes before'),
(14, '2024-12-18', '03:00 PM', 'Ritchelle Rueras', 'ruerasritchelle@gmail.com', 'Accounting Consultation', 'payroll', 'In-Person', '2024-12-18 06:26:20', 5, '09876543212', 'Table Tennis', 'At Time of Event'),
(15, '2024-12-18', '01:00 PM', 'Monique Cabigting', 'ruerasritchelle@gmail.com', 'Tax Advisory', 'tax payment', 'In-Person', '2024-12-18 06:37:39', 5, '09876543212', 'Food vlog', '5 minutes before'),
(16, '2025-01-18', '02:00 PM', 'Julie Joy', 'ritchellerueras@gmail.com', 'Payroll System Setup Consultation', 'employee pay', 'Phone Call', '2024-12-18 07:40:53', 2, '09876543234', 'Bora', '10 minutes before'),
(18, '2025-01-18', '04:00 PM', 'jdsjk', 'ritchellerueras@gmail.com', 'Corporate Governance Review', 'dasd', 'In-Person', '2024-12-18 07:59:23', 5, '09876543212', 'Sir Allon ALba TV', 'At Time of Event'),
(19, '2024-12-19', '04:00 PM', 'Ritchelle Rueras', 'ritchellerueras@gmail.com', 'Employee Benefits and Compliance Advisory', 'employee building', 'In-Person', '2024-12-19 07:48:06', 5, '09876543212', 'Samgyupsalamat', '10 minutes before'),
(22, '2024-12-20', '08:00 AM', 'Julie Joy Rueras', 'ritchellerueras@gmail.com', 'Startup Planning', 'new business', 'In-Person', '2024-12-19 08:06:15', 5, '09876543212', 'Table Tennis', '1 day before'),
(23, '2025-01-02', '09:00 AM', 'Julie Rueras', 'ruerasritchelle07@gmail.com', 'Payroll System Setup Consultation', 'Payroll', 'In-Person', '2024-12-29 16:36:09', 23, '09876543212', 'Table Tennis', '2 days before'),
(24, '2025-01-02', '03:00 PM', 'christ Christopher', 'ritchellerueras@gmail.com', 'Tax Advisory', 'tax payment', 'Zoom', '2024-12-29 16:52:54', 22, '09876567898', 'Food vlog', '10 minutes before'),
(26, '2025-01-03', '12:00 PM', 'Julie Rueras', 'ruerasritchelle07@gmail.com', 'Startup Planning', 'Business StartUp', 'Phone Call', '2024-12-29 17:08:41', 23, '09876543212', 'Table Tennis', '5 minutes before'),
(27, '2025-01-04', '09:00 AM', 'christ Christopher', 'ritchellerueras@gmail.com', 'Risk Management Consultation', 'for risk management ', 'Microsoft Teams', '2024-12-29 17:30:31', 22, '09876567898', 'Food vlog', '2 days before'),
(28, '2025-01-08', '09:00 AM', 'claireza Rueras', 'ritchellerueras@gmail.com', 'Payroll System Setup Consultation', 'Payroll for employee', 'Video Call', '2025-01-03 03:55:42', 22, '+639876543212', 'Sports', 'At Time of Event'),
(29, '2025-01-09', '04:00 PM', 'Kyle Rueras', 'ritchelle.rueras@tup.edu.ph', 'Accounting Consultation', 'Accounting', 'Video Call', '2025-01-03 07:58:52', 5, '+639876543212', 'OPPA', '5 minutes before');

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
(12, '07:00 AM', '07:00 PM', '2025-01-02 17:16:37', '2025-01-05'),
(13, '11:00 AM', '03:00 PM', '2025-01-02 17:16:37', '2025-01-06'),
(14, '09:00 AM', '04:00 PM', '2025-01-02 17:43:15', '2025-01-07'),
(15, '08:00 AM', '04:00 PM', '2025-01-02 17:43:15', '2025-01-08'),
(16, '11:00 AM', '05:00 PM', '2025-01-02 17:43:15', '2025-01-09'),
(17, '11:00 AM', '06:00 PM', '2025-01-02 17:43:15', '2025-01-10'),
(18, '11:00 AM', '02:00 PM', '2025-01-03 02:23:22', '2025-01-11');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `middleInitial` char(1) DEFAULT NULL,
  `birthday` date NOT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `email_add` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `companyName` varchar(255) DEFAULT NULL,
  `passwordChanged` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `firstName`, `lastName`, `middleInitial`, `birthday`, `mobile_number`, `email_add`, `address`, `password`, `username`, `status`, `companyName`, `passwordChanged`) VALUES
(1, 'John', 'Doe', 'R', '2024-03-28', '09123456789', 'john.doe@example.com', '1234 Main St, Cityville', 'password1234', '', 'active', NULL, 0),
(2, 'Jane', 'Smith', 'B', '1985-08-15', '09234567890', 'ruerasritchelle07@gmail.com', '456 Elm St, Townsville', 'Password_12345', 'smith.jane', 'inactive', 'Apple', 1),
(3, 'Ritchelle', 'Rueras', 'T', '2001-05-20', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', '12345', 'Rueras12345', 'inactive', NULL, 1),
(4, 'Monique', 'Cabigting', 'h', '2005-06-07', '098765432', 'ritchellerueras@gmail.com', 'df', 'CABIGTING12345', 'Cabigting12345', 'active', NULL, 0),
(5, 'claireza', 'bautista', 'h', '2024-10-01', '09709573613', 'clarieza@gmail.com', 'pasig city', 'Claire_bautista1', 'bautista.claireza', 'inactive', NULL, 1),
(6, 'mimi', 'mema', 'm', '2013-06-09', '09709573613', 'clarieza@gmail.com', 'Surigao City', 'MEMA12345', 'mema.mimi', 'active', NULL, 0),
(7, 'huhu', 'haha', 'h', '2023-12-20', '09709573613', 'clarieza@gmail.com', 'df', 'HAHA12345', 'haha.huhu', 'inactive', NULL, 0),
(8, 'sbh', 'sdjas', 's', '2024-04-23', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', 'SDJAS12345', 'sdjas.sbh', 'active', NULL, 0),
(9, 'sbh', 'sdjas', 's', '2024-04-23', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', 'SDJAS12345', 'sdjas.sbh', 'active', NULL, 0),
(10, 'fafdvd', 'dfafdf', 's', '2023-11-21', '09709573613', 'ritchellerueras@gmail.com', 'pasig city', 'DFAFDF12345', 'dfafdf.fafdvd', 'active', NULL, 0),
(11, 'jsdnsa', 'kksdjsa', 'x', '2024-10-30', '09709573613', 'ritchellerueras@gmail.com', 'surigao city', 'KKSDJSA12345', 'kksdjsa.jsdnsa', 'active', NULL, 0),
(12, 'claireza', 'asdas', 's', '2023-07-10', '09709573613', 'clarieza@gmail.com', 'Surigao Citylalala', 'ASDAS12345', 'asdas.dasd', 'active', NULL, 0),
(13, 'Rueras', 'Ritchelle', 'T', '2001-05-22', '09709573613', 'ritchellerueras@gmail.com', 'Sampaloc, Metro Manila', 'RITCHELLE12345', 'ritchelle.rueras', 'active', NULL, 0),
(14, 'Julie', 'Rueras', 'T', '2006-07-30', '09876543212', 'ritchellerueras@gmail.com', 'Dasmarinas, Cavite', 'Chelle_Rueras1234', 'rueras.julie', 'active', NULL, 1),
(15, 'Monique', 'Cabigting', 'T', '2023-06-08', '09709573613', 'ritchellerueras@gmail.com', 'santa mesa', 'CABIGTING12345', 'cabigting.monique', 'active', NULL, 0),
(17, 'kmdlke', 'mema', 'm', '2022-04-11', '09709573613', 'ritchellerueras@gmail.com', 'Surigao Citylalala', 'MEMA12345', 'mema.kmdlke', 'active', NULL, 0),
(18, 'Monique', 'rueras', 'h', '2000-05-21', '09709573613', 'ritchellerueras@gmail.com', 'surigao city', 'RUERAS12345', 'rueras.monique', 'active', NULL, 0),
(19, 'Jen', 'Paclibar', 'j', '1980-05-22', '09876543212', 'ritchellerueras@gmail.com', 'bulacan', 'PACLIBAR12345', 'paclibar.jen', 'active', NULL, 0),
(20, 'Alba', 'Allon', 's', '2024-06-05', '09876543212', 'ritchellerueras@gmail.com', 'rilles street', 'ALLON12345', 'allon.alba', 'active', NULL, 0),
(21, 'Poca', 'Poca', 'P', '2022-12-07', '09709573613', 'ritchellerueras@gmail.com', 'boracay', 'POCA12345', 'poca.poca', 'active', 'Bora', 0),
(22, 'christ', 'Christopher', 'm', '2021-03-02', '09876567898', 'ritchellerueras@gmail.com', 'Pangasinan', 'Qwerty_123', 'christopher.christ', 'active', 'Food vlog', 1),
(23, 'Julie', 'Rueras', 'T', '2006-10-19', '09876543212', 'ruerasritchelle07@gmail.com', 'Dasmarinas, Cavite', 'RUERAS12345', 'rueras.julie', 'active', 'Table Tennis', 0);

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
(15, 5, 'Appointment Scheduled', 'Your appointment on 2025-01-09 at 04:00 PM has been confirmed.', '2025-01-03 15:58:52', 0);

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
  `birthday` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `lastName`, `middleName`, `firstName`, `address`, `mobile_number`, `email_add`, `status`, `birthday`) VALUES
(1, 'rueras', 'Eco', 'Monique', 'santa mesa', '09709573613', 'ritchellerueras@gmail.com', 'active', '2011-06-02'),
(2, 'Cabigting', 'xasd', 'claireza', 'pasig city', '09709573613', 'ritchellerueras@gmail.com', 'active', '2024-11-01'),
(3, 'mema', 'haha', 'MAMA', 'santa mesa', '09709573613', 'ritchellerueras@gmail.com', 'active', '2024-10-28'),
(4, 'charlene', 'Rue', 'Baltazar', 'quezon city', '09876543212', 'char@gmail.com', 'active', '2022-12-11'),
(5, 'Rueras', 'Taganas', 'Julie Joy', 'Surigao City', '09876543234', 'ritchellerueras@gmail.com', 'active', '2022-10-05'),
(6, 'Arante', 'Isabelle', 'Julliana', 'quezon city', '09876543234', 'ritchellerueras@gmail.com', 'active', '2002-02-17');

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
  `client_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `description`, `timestamp`, `isRead`, `client_id`) VALUES
(1, 'New Client Added', 'Client christ Christopher has been successfully created.', '2024-12-17 19:56:38', 1, 3),
(2, 'New Employee Added', 'Employee Julliana Arante has been successfully created.', '2024-12-17 20:47:33', 1, NULL),
(3, 'New Appointment Created', 'Appointment with Jerome Ponce (jerome.gmail.com) on 2024-12-25 at 11:00.', '2024-12-18 14:00:44', 0, NULL),
(4, 'Appointment by Monique Cabigting', 'Appointment with Monique Cabigting (ruerasritchelle@gmail.com) on 2024-12-18 at 13:00.', '2024-12-18 14:37:39', 0, 3),
(5, 'Appointment', 'Appointment with Julie Joy (ritchellerueras@gmail.com) on 2024-12-18 at 14:00.', '2024-12-18 15:40:53', 1, NULL),
(6, 'Appointment', 'Appointment with Kyle Rueras (ritchellerueras@gmail.com) on 2024-12-18 at 14:00.', '2024-12-18 15:51:02', 1, NULL),
(7, 'Appointment', 'Appointment with jdsjk (ritchellerueras@gmail.com) on 2024-12-18 at 16:00.', '2024-12-18 15:59:23', 0, NULL),
(8, 'New Payment Received', 'Client John Doe paid 15.00 USD.', '2024-12-18 21:57:57', 1, NULL),
(9, 'New Payment Received', 'Client John Doe paid 15.00 USD.', '2024-12-19 15:09:46', 0, NULL),
(10, 'Appointment', 'Appointment with Ritchelle Rueras (ritchellerueras@gmail.com) on 2024-12-19 at 16:00.', '2024-12-19 15:48:06', 0, NULL),
(11, 'Appointment', 'Appointment with mornik (ritchellerueras@gmail.com) on 2024-12-19 at 16:00.', '2024-12-19 15:57:08', 0, NULL),
(12, 'Appointment', 'Appointment with mornik (ritchellerueras@gmail.com) on 2024-12-19 at 16:00.', '2024-12-19 16:02:34', 0, NULL),
(13, 'Appointment', 'Appointment with Julie Joy Rueras (ritchellerueras@gmail.com) on 2024-12-20 at 08:00.', '2024-12-19 16:06:15', 0, NULL),
(14, 'New Client Added', 'Client Julie Rueras has been successfully created.', '2024-12-19 16:21:35', 0, NULL),
(15, 'Appointment', 'Appointment with Julie Rueras (ruerasritchelle07@gmail.com) on 2025-01-02 at 09:00 AM.', '2024-12-30 00:36:09', 0, NULL),
(16, 'Appointment', 'Appointment with christ Christopher (ritchellerueras@gmail.com) on 2025-01-02 at 03:00 PM.', '2024-12-30 00:52:54', 0, NULL),
(17, 'Appointment', 'Appointment with Poca Poca (ritchellerueras@gmail.com) on 2025-01-02 at 12:00 PM.', '2024-12-30 01:06:17', 0, NULL),
(18, 'Appointment', 'Appointment with Julie Rueras (ruerasritchelle07@gmail.com) on 2025-01-03 at 12:00 PM.', '2024-12-30 01:08:41', 0, NULL),
(19, 'Appointment', 'Appointment with christ Christopher (ritchellerueras@gmail.com) on 2025-01-04 at 09:00 AM.', '2024-12-30 01:30:31', 0, NULL),
(20, 'New Payment Received', 'Client John Doe paid 50.00 USD.', '2025-01-02 10:06:57', 0, NULL),
(21, 'New Payment Received', 'Client John Doe paid 45.00 USD.', '2025-01-02 10:38:49', 0, NULL),
(22, 'Appointment', 'Appointment with claireza Rueras (ritchellerueras@gmail.com) on 2025-01-08 at 09:00 AM.', '2025-01-03 11:55:42', 0, NULL),
(23, 'Appointment', 'Appointment with Kyle Rueras (ritchelle.rueras@tup.edu.ph) on 2025-01-09 at 04:00 PM.', '2025-01-03 15:58:52', 0, NULL);

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `client_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `transaction_id`, `payer_name`, `payer_email`, `amount`, `currency`, `payed_to_email`, `created_at`, `client_id`, `project_id`) VALUES
(1, '82V683108H2375644', 'John Doe', 'sb-x2i47834694194@personal.example.com', 20.00, 'USD', 'Sharp Minds', '2024-12-18 12:01:36', NULL, NULL),
(2, '44902679CF354034B', 'John Doe', 'sb-x2i47834694194@personal.example.com', 21.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2024-12-18 12:14:45', NULL, NULL),
(3, '29S25917Y89617702', 'John Doe', 'sb-x2i47834694194@personal.example.com', 15.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2024-12-18 12:36:44', 3, NULL),
(4, '09N39975HP337261B', 'John Doe', 'sb-x2i47834694194@personal.example.com', 15.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2024-12-18 13:57:57', 3, NULL),
(5, '7XG522585E497851R', 'John Doe', 'sb-x2i47834694194@personal.example.com', 15.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2024-12-19 07:09:46', 5, NULL),
(6, '5UJ88158SL470325F', 'John Doe', 'sb-x2i47834694194@personal.example.com', 50.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2025-01-02 10:06:57', 5, 17),
(7, '5EV634229L456502N', 'John Doe', 'sb-x2i47834694194@personal.example.com', 45.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2025-01-02 10:38:48', 5, 17);

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
  `status` enum('ongoing','in_progress','completed','on_hold') NOT NULL DEFAULT 'ongoing',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `clientId` int(11) NOT NULL,
  `contractPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paymentStatus` enum('Paid','Not Paid') DEFAULT 'Not Paid',
  `downpayment` decimal(10,2) DEFAULT NULL,
  `totalPayment` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `clientName`, `projectName`, `description`, `startDate`, `endDate`, `status`, `created_at`, `isDeleted`, `clientId`, `contractPrice`, `paymentStatus`, `downpayment`, `totalPayment`) VALUES
(6, 'John Doe', 'qwqw', 'dnasjdjs', '2024-11-15', '2024-11-22', 'ongoing', '2024-11-14 07:29:16', 1, 5, 0.00, 'Not Paid', NULL, 0.00),
(7, 'Monique Cabigting', 'Coffee Project', 'kapehan', '2024-11-29', '2025-01-10', 'ongoing', '2024-11-14 09:49:23', 0, 5, 1578.00, 'Not Paid', NULL, 12278.00),
(8, 'Ritchelle Rueras', 'APT', 'rose blk', '2024-11-15', '2024-12-07', 'ongoing', '2024-11-14 10:06:23', 0, 5, 0.00, 'Not Paid', NULL, 0.00),
(9, 'John Doe', 'PRMS', 'project management system ', '2024-11-16', '2025-04-15', 'ongoing', '2024-11-14 16:52:07', 0, 0, 0.00, 'Not Paid', NULL, 0.00),
(10, 'Jane Smith', 'DBMS', 'hahahaha', '2024-11-16', '2024-12-05', 'ongoing', '2024-11-14 17:05:19', 0, 0, 0.00, 'Not Paid', NULL, 0.00),
(11, 'mimi mema', 'qwer', 'dmsd ,', '2024-11-16', '2024-11-23', 'ongoing', '2024-11-14 17:24:15', 0, 0, 0.00, 'Not Paid', NULL, 0.00),
(12, 'John Doe', 'mema', 'lapapapa', '2024-11-23', '2024-12-07', 'ongoing', '2024-11-16 08:12:45', 0, 0, 0.00, 'Not Paid', NULL, 0.00),
(13, 'Ritchelle Rueras', 'Rrr', 'rrrrrrrr', '2024-11-19', '2024-12-07', 'ongoing', '2024-11-17 16:49:45', 0, 0, 0.00, 'Not Paid', NULL, 0.00),
(14, 'Jane Smith', 'qqqqqq', 'please make it work', '2024-11-21', '2025-06-26', 'ongoing', '2024-11-17 17:12:09', 0, 2, 0.00, 'Not Paid', NULL, 0.00),
(15, 'Jane Smith', 'jdkasd', 'hhahahaha', '2024-11-30', '2025-05-01', 'ongoing', '2024-11-21 02:28:43', 0, 2, 0.00, 'Not Paid', NULL, 0.00),
(16, 'sbh sdjas', 'ndjas', 'lalalalala', '2024-11-28', '2025-05-01', 'ongoing', '2024-11-21 02:29:14', 0, 8, 0.00, 'Not Paid', NULL, 0.00),
(17, 'claireza bautista', 'Water Station', 'refilling station business', '2025-01-03', '2025-07-23', 'completed', '2024-11-21 06:52:07', 0, 5, 5.00, 'Paid', 20.00, 65.00),
(18, 'claireza bautista', 'Samgyupsal', 'lalalalalalalove', '2024-12-26', '2025-10-30', 'ongoing', '2024-12-22 14:07:48', 0, 5, 5000.00, 'Not Paid', NULL, 8230.00),
(19, 'Ritchelle Rueras', 'Vista Mall', 'tax pay', '2024-12-28', '2025-12-27', 'ongoing', '2024-12-26 14:36:44', 0, 3, 10000.00, 'Not Paid', NULL, 10000.00),
(20, 'Monique Cabigting', 'Moontoon', 'renewal', '2024-12-26', '2025-01-11', 'ongoing', '2024-12-26 15:41:33', 0, 4, 20000.00, 'Not Paid', 10000.00, 20000.00);

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
(1, 5, 17, 5, 'wow very good', 'reviewed', '2025-01-02 11:55:51');

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
  `status` enum('completed','in-progress','pending') DEFAULT 'pending',
  `project_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `task_name`, `task_fee`, `due_date`, `employee`, `miscellaneous`, `status`, `project_id`, `created_at`, `updated_at`, `amount`) VALUES
(1, 'BIR', 1000.00, '2024-12-25', '5', '[{\"name\":\"Gas\",\"fee\":\"100\"}]', 'in-progress', 18, '2024-12-22 18:14:59', '2024-12-31 08:39:54', 1100.00),
(2, 'Tax', 500.00, '2024-12-31', '6', '[{\"name\":\"Food\",\"fee\":\"100\"},{\"name\":\"Gas\",\"fee\":\"500\"}]', 'in-progress', 7, '2024-12-26 17:14:37', '2024-12-31 08:40:07', 1100.00),
(3, 'Payroll', 1000.00, '2024-12-31', '1', '[{\"name\":\"Rent\",\"fee\":\"5000\"}]', 'pending', 7, '2024-12-26 17:18:14', '2024-12-26 17:18:14', 6000.00),
(4, 'Design Homepage', 500.00, '2024-01-15', '1', '[{\"name\": \"Design tools\", \"fee\": 50}]', 'completed', 18, '2024-12-31 08:21:35', '2025-01-02 07:11:34', 550.00),
(5, 'Develop Login Page', 800.00, '2024-01-20', '2', '[{\"name\": \"Backend setup\", \"fee\": 100}]', 'in-progress', 18, '2024-12-31 08:21:35', '2025-01-02 07:11:49', 900.00),
(6, 'Testing and QA', 30.00, '2024-01-25', '3', '[{\"name\": \"Testing tools\", \"fee\": 30}]', 'pending', 17, '2024-12-31 08:21:35', '2025-01-02 09:50:36', 60.00),
(7, 'Database Optimization', 600.00, '2024-02-01', '4', '[{\"name\": \"Database license\", \"fee\": 80}]', 'pending', 18, '2024-12-31 08:21:35', '2025-01-02 07:12:13', 680.00),
(8, 'BIR', 1000.00, '2025-01-07', '3', '[{\"name\":\"Food\",\"fee\":\"100\"},{\"name\":\"Gas\",\"fee\":\"500\"},{\"name\":\"Accomodation\",\"fee\":\"2000\"}]', 'pending', 7, '2025-01-03 07:28:10', '2025-01-03 07:28:10', 3600.00);

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
(14, 7, '1735321798758.xlsx', 'test.xlsx', 'application/vnd.openxmlformats-officedocument.spre', '2024-12-27 17:49:58', 'admin'),
(15, 18, '1735321855502.pptx', 'GEE 13D_RVA_Week 2.pptx', 'application/vnd.openxmlformats-officedocument.pres', '2024-12-27 17:50:56', '5'),
(16, 18, '1735824190614.jpg', '1.jpg', 'image/jpeg', '2025-01-02 13:23:10', '5'),
(17, 8, '1735824351251.pdf', 'reg.cor2.pdf', 'application/pdf', '2025-01-02 13:25:51', '5'),
(18, 8, '1735825716804.pdf', 'RESUME.pdf', 'application/pdf', '2025-01-02 13:48:36', '5'),
(19, 8, '1735835066875.png', 'Data Flow Diagram.png', 'image/png', '2025-01-02 16:24:26', 'admin'),
(20, 8, '1735835084923.docx', '6 Proposal Format.docx', 'application/vnd.openxmlformats-officedocument.word', '2025-01-02 16:24:44', 'admin');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `availability`
--
ALTER TABLE `availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `client_notifications`
--
ALTER TABLE `client_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
