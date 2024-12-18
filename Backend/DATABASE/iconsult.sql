-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2024 at 01:40 PM
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
  `date` date NOT NULL,
  `time` time NOT NULL,
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
(1, '2024-11-20', '09:00:00', 'hsgad', 'ruerasritchelle@gmail.com', 'Legal Advisory', 'pupu', 'In-Person', '2024-11-17 06:04:36', NULL, NULL, NULL, NULL),
(2, '2024-11-20', '08:00:00', 'rITCHELLE RUERAS', 'ritchellerueras@gmail.com', 'Employee Benefits and Compliance Advisory', 'HAKDOG', 'In-Person', '2024-11-17 06:29:33', 0, NULL, NULL, NULL),
(3, '2024-12-04', '10:00:00', 'CLARIEZA BAUTISTA', 'ritchellerueras@gmail.com', 'Strategic Planning Consultation', 'STARTS', 'Video Call', '2024-11-17 06:42:00', 0, NULL, NULL, NULL),
(4, '2024-11-22', '14:00:00', 'CHELLE', 'ruerasritchelle@gmail.com', 'Risk Management Consultation', 'RISKY', 'Video Call', '2024-11-17 06:46:26', 0, NULL, NULL, NULL),
(5, '2024-11-19', '16:00:00', 'MONIK', 'ritchellerueras@gmail.com', 'Risk Management Consultation', 'RISKYYY', 'Video Call', '2024-11-17 06:55:32', 3, NULL, NULL, NULL),
(6, '2024-11-28', '11:00:00', 'CLARIEZA BAUTISTA', 'CLAIRE@gmail.com', 'Legal Advisory', 'hakdog', 'In-Person', '2024-11-17 07:05:42', 5, '09876543212', NULL, NULL),
(7, '2024-11-24', '15:00:00', 'claire', 'ritchellerueras@gmail.com', 'Organizational Development Advisory', 'haha', 'Video Call', '2024-11-17 07:21:06', 5, '09876543212', NULL, NULL),
(8, '2024-11-30', '09:00:00', 'bautista', 'bautista@gmail.com', 'Risk Management Consultation', 'bautista', 'In-Person', '2024-11-17 07:26:31', 5, '09876787654', NULL, NULL),
(9, '2024-11-18', '09:00:00', 'rueras', 'ruerasritchelle@gmail.com', 'Organizational Development Advisory', 'org', 'Video Call', '2024-11-17 07:29:01', 5, '09876543211', NULL, NULL),
(10, '2024-12-28', '11:00:00', 'hgj', 'ruerasritchelle@gmail.com', 'Corporate Governance Review', 'gjhg', 'In-Person', '2024-12-15 19:06:39', 5, '09876543212', NULL, NULL),
(11, '2024-12-25', '13:00:00', 'Ninong Ry', 'ruerasritchelle@gmail.com', 'Others', 'vlog ideas', 'In-Person', '2024-12-17 08:00:16', 5, '09876543212', 'Ninong Ry TV', '30 minutes before'),
(12, '2024-12-26', '14:00:00', 'Julien Cohen', 'ritchellerueras@gmail.com', 'music type', 'music reco', 'Video Call', '2024-12-17 08:29:32', 5, '09876543212', 'Tiktok', '2 hours before'),
(13, '2024-12-25', '11:00:00', 'Jerome Ponce', 'jerome.gmail.com', 'Risk Management Consultation', 'very demure', 'Phone Call', '2024-12-18 06:00:44', 5, '09876543456', 'Sir Allon ALba TV', '5 minutes before'),
(14, '2024-12-18', '15:00:00', 'Ritchelle Rueras', 'ruerasritchelle@gmail.com', 'Accounting Consultation', 'payroll', 'In-Person', '2024-12-18 06:26:20', 5, '09876543212', 'Table Tennis', 'At Time of Event'),
(15, '2024-12-18', '13:00:00', 'Monique Cabigting', 'ruerasritchelle@gmail.com', 'Tax Advisory', 'tax payment', 'In-Person', '2024-12-18 06:37:39', 5, '09876543212', 'Food vlog', '5 minutes before'),
(16, '2024-12-18', '14:00:00', 'Julie Joy', 'ritchellerueras@gmail.com', 'Payroll System Setup Consultation', 'employee pay', 'Phone Call', '2024-12-18 07:40:53', 5, '09876543234', 'Bora', '10 minutes before'),
(17, '2024-12-18', '14:00:00', 'Kyle Rueras', 'ritchellerueras@gmail.com', 'Financial Advisory', 'haha', 'Video Call', '2024-12-18 07:51:02', 5, '09878987654', 'Sir Allon ALba TV', '5 minutes before'),
(18, '2024-12-18', '16:00:00', 'jdsjk', 'ritchellerueras@gmail.com', 'Corporate Governance Review', 'dasd', 'In-Person', '2024-12-18 07:59:23', 5, '09876543212', 'Sir Allon ALba TV', 'At Time of Event');

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
(2, 'Jane', 'Smith', 'B', '1985-08-15', '09234567890', 'jane.smith@example.com', '456 Elm St, Townsville', 'password12345', '', 'inactive', NULL, 0),
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
(14, 'Julie', 'Rueras', 'T', '2006-07-30', '09876543212', 'ritchellerueras@gmail.com', 'Dasmarinas, Cavite', 'RUERAS12345', 'rueras.julie', 'active', NULL, 0),
(15, 'Monique', 'Cabigting', 'T', '2023-06-08', '09709573613', 'ritchellerueras@gmail.com', 'santa mesa', 'CABIGTING12345', 'cabigting.monique', 'active', NULL, 0),
(16, 'claireza', 'bautista', 's', '2023-09-13', '09876543212', 'ritchellerueras@gmail.com', 'pasig city', 'BAUTISTA12345', 'bautista.claireza', 'active', NULL, 0),
(17, 'kmdlke', 'mema', 'm', '2022-04-11', '09709573613', 'ritchellerueras@gmail.com', 'Surigao Citylalala', 'MEMA12345', 'mema.kmdlke', 'active', NULL, 0),
(18, 'Monique', 'rueras', 'h', '2000-05-21', '09709573613', 'ritchellerueras@gmail.com', 'surigao city', 'RUERAS12345', 'rueras.monique', 'active', NULL, 0),
(19, 'Jen', 'Paclibar', 'j', '1980-05-22', '09876543212', 'ritchellerueras@gmail.com', 'bulacan', 'PACLIBAR12345', 'paclibar.jen', 'active', NULL, 0),
(20, 'Alba', 'Allon', 's', '2024-06-05', '09876543212', 'ritchellerueras@gmail.com', 'rilles street', 'ALLON12345', 'allon.alba', 'active', NULL, 0),
(21, 'Poca', 'Poca', 'P', '2022-12-07', '09709573613', 'ritchellerueras@gmail.com', 'boracay', 'POCA12345', 'poca.poca', 'active', 'Bora', 0),
(22, 'christ', 'Christopher', 'm', '2021-03-02', '09876567898', 'ritchellerueras@gmail.com', 'Pangasinan', 'CHRISTOPHER12345', 'christopher.christ', 'active', 'Food vlog', 0);

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
  `isRead` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `description`, `timestamp`, `isRead`) VALUES
(1, 'New Client Added', 'Client christ Christopher has been successfully created.', '2024-12-17 19:56:38', 1),
(2, 'New Employee Added', 'Employee Julliana Arante has been successfully created.', '2024-12-17 20:47:33', 1),
(3, 'New Appointment Created', 'Appointment with Jerome Ponce (jerome.gmail.com) on 2024-12-25 at 11:00.', '2024-12-18 14:00:44', 0),
(4, 'Appointment by Monique Cabigting', 'Appointment with Monique Cabigting (ruerasritchelle@gmail.com) on 2024-12-18 at 13:00.', '2024-12-18 14:37:39', 0),
(5, 'Appointment', 'Appointment with Julie Joy (ritchellerueras@gmail.com) on 2024-12-18 at 14:00.', '2024-12-18 15:40:53', 1),
(6, 'Appointment', 'Appointment with Kyle Rueras (ritchellerueras@gmail.com) on 2024-12-18 at 14:00.', '2024-12-18 15:51:02', 0),
(7, 'Appointment', 'Appointment with jdsjk (ritchellerueras@gmail.com) on 2024-12-18 at 16:00.', '2024-12-18 15:59:23', 0);

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
  `client_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `transaction_id`, `payer_name`, `payer_email`, `amount`, `currency`, `payed_to_email`, `created_at`, `client_id`) VALUES
(1, '82V683108H2375644', 'John Doe', 'sb-x2i47834694194@personal.example.com', 20.00, 'USD', 'Sharp Minds', '2024-12-18 12:01:36', NULL),
(2, '44902679CF354034B', 'John Doe', 'sb-x2i47834694194@personal.example.com', 21.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2024-12-18 12:14:45', NULL),
(3, '29S25917Y89617702', 'John Doe', 'sb-x2i47834694194@personal.example.com', 15.00, 'USD', 'ritchelle.rueras@tup.edu.ph', '2024-12-18 12:36:44', 3);

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
  `clientId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `clientName`, `projectName`, `description`, `startDate`, `endDate`, `status`, `created_at`, `isDeleted`, `clientId`) VALUES
(6, 'John Doe', 'qwqw', 'dnasjdjs', '2024-11-15', '2024-11-22', 'ongoing', '2024-11-14 07:29:16', 1, 0),
(7, 'Monique Cabigting', 'Coffee Project', 'kapehan', '2024-11-29', '2025-01-10', 'ongoing', '2024-11-14 09:49:23', 0, 0),
(8, 'Ritchelle Rueras', 'APT', 'rose blk', '2024-11-15', '2024-12-07', 'ongoing', '2024-11-14 10:06:23', 0, 0),
(9, 'John Doe', 'PRMS', 'project management system ', '2024-11-16', '2025-04-15', 'ongoing', '2024-11-14 16:52:07', 0, 0),
(10, 'Jane Smith', 'DBMS', 'hahahaha', '2024-11-16', '2024-12-05', 'ongoing', '2024-11-14 17:05:19', 0, 0),
(11, 'mimi mema', 'qwer', 'dmsd ,', '2024-11-16', '2024-11-23', 'ongoing', '2024-11-14 17:24:15', 0, 0),
(12, 'John Doe', 'mema', 'lapapapa', '2024-11-23', '2024-12-07', 'ongoing', '2024-11-16 08:12:45', 0, 0),
(13, 'Ritchelle Rueras', 'Rrr', 'rrrrrrrr', '2024-11-19', '2024-12-07', 'ongoing', '2024-11-17 16:49:45', 0, 0),
(14, 'Jane Smith', 'qqqqqq', 'please make it work', '2024-11-21', '2025-06-26', 'ongoing', '2024-11-17 17:12:09', 0, 2),
(15, 'Jane Smith', 'jdkasd', 'hhahahaha', '2024-11-30', '2025-05-01', 'ongoing', '2024-11-21 02:28:43', 0, 2),
(16, 'sbh sdjas', 'ndjas', 'lalalalala', '2024-11-28', '2025-05-01', 'ongoing', '2024-11-21 02:29:14', 0, 8),
(17, 'claireza bautista', 'trishia', 'lalalla', '2024-11-21', '2024-12-07', 'ongoing', '2024-11-21 06:52:07', 1, 5);

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
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
