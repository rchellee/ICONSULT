-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 17, 2024 at 08:38 AM
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
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `consultationType` varchar(100) NOT NULL,
  `additionalInfo` text DEFAULT NULL,
  `platform` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `client_id` int(11) DEFAULT NULL,
  `contact` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `date`, `time`, `name`, `email`, `consultationType`, `additionalInfo`, `platform`, `created_at`, `client_id`, `contact`) VALUES
(1, '2024-11-20', '09:00:00', 'hsgad', 'ruerasritchelle@gmail.com', 'Legal Advisory', 'pupu', 'In-Person', '2024-11-17 06:04:36', NULL, NULL),
(2, '2024-11-20', '08:00:00', 'rITCHELLE RUERAS', 'ritchellerueras@gmail.com', 'Employee Benefits and Compliance Advisory', 'HAKDOG', 'In-Person', '2024-11-17 06:29:33', 0, NULL),
(3, '2024-12-04', '10:00:00', 'CLARIEZA BAUTISTA', 'ritchellerueras@gmail.com', 'Strategic Planning Consultation', 'STARTS', 'Video Call', '2024-11-17 06:42:00', 0, NULL),
(4, '2024-11-22', '14:00:00', 'CHELLE', 'ruerasritchelle@gmail.com', 'Risk Management Consultation', 'RISKY', 'Video Call', '2024-11-17 06:46:26', 0, NULL),
(5, '2024-11-19', '16:00:00', 'MONIK', 'ritchellerueras@gmail.com', 'Risk Management Consultation', 'RISKYYY', 'Video Call', '2024-11-17 06:55:32', 3, NULL),
(6, '2024-11-28', '11:00:00', 'CLARIEZA BAUTISTA', 'CLAIRE@gmail.com', 'Legal Advisory', 'hakdog', 'In-Person', '2024-11-17 07:05:42', 5, '09876543212'),
(7, '2024-11-24', '15:00:00', 'claire', 'ritchellerueras@gmail.com', 'Organizational Development Advisory', 'haha', 'Video Call', '2024-11-17 07:21:06', 5, '09876543212'),
(8, '2024-11-30', '09:00:00', 'bautista', 'bautista@gmail.com', 'Risk Management Consultation', 'bautista', 'In-Person', '2024-11-17 07:26:31', 5, '09876787654'),
(9, '2024-11-18', '09:00:00', 'rueras', 'ruerasritchelle@gmail.com', 'Organizational Development Advisory', 'org', 'Video Call', '2024-11-17 07:29:01', 5, '09876543211');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
