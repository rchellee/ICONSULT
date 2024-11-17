-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2024 at 11:35 AM
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
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `firstName`, `lastName`, `middleInitial`, `birthday`, `mobile_number`, `email_add`, `address`, `password`, `username`, `status`) VALUES
(1, 'John', 'Doe', 'A', '1990-05-15', '09123456789', 'john.doe@example.com', '123 Main St, Cityville', 'password1234', '', 'active'),
(2, 'Jane', 'Smith', 'B', '1985-08-20', '09234567890', 'jane.smith@example.com', '456 Elm St, Townsville', 'password12345', '', 'active'),
(3, 'Ritchelle', 'Rueras', 'T', '2001-05-20', '09709573613', 'ritchellerueras@gmail.com', 'Surigao City', 'RUERAS12345', 'Rueras12345', 'inactive'),
(4, 'Monique', 'Cabigting', 'h', '2005-06-07', '098765432', 'ritchellerueras@gmail.com', 'df', 'CABIGTING12345', 'Cabigting12345', 'active'),
(5, 'claireza', 'bautista', 'h', '2024-10-01', '09709573613', 'clarieza@gmail.com', 'pasig city', 'BAUTISTA12345', 'bautista.claireza', 'active'),
(6, 'mimi', 'mema', 'm', '2013-06-09', '09709573613', 'clarieza@gmail.com', 'Surigao City', 'MEMA12345', 'mema.mimi', 'active');

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
(1, 'rueras', 'xasd', 'Monique', 'pasig city', '09709573613', 'ritchellerueras@gmail.com', 'active', '2011-06-05'),
(2, 'Cabigting', 'xasd', 'claireza', 'pasig city', '09709573613', 'ritchellerueras@gmail.com', 'inactive', '2024-11-01'),
(3, 'mema', 'haha', 'mimi', 'santa mesa', '09709573613', 'ritchellerueras@gmail.com', 'active', '2024-10-29');

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
  `status` enum('ongoing','in_progress','completed','on_hold') NOT NULL DEFAULT 'ongoing'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `clientName`, `projectName`, `description`, `startDate`, `endDate`, `status`) VALUES
(6, '1', 'qwqw', 'dnasjdjs', '2024-11-16', '2024-11-23', 'ongoing');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `employeename` varchar(255) NOT NULL,
  `projectname` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duedate` date NOT NULL,
  `taskstatus` enum('not_started','in_progress','completed','on_hold') NOT NULL DEFAULT 'not_started',
  `paymentstatus` enum('pending','paid','overdue') NOT NULL DEFAULT 'pending',
  `paymentmethod` enum('paypal','credit_card','bank_transfer','cash') NOT NULL,
  `payment` enum('before_completion','after_completion') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
