/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.22-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Restauration
-- ------------------------------------------------------
-- Server version	10.6.22-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Balance`
--

DROP TABLE IF EXISTS `Balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Balance` (
  `idBalance` int(11) NOT NULL AUTO_INCREMENT,
  `Etat` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`idBalance`),
  CONSTRAINT `chk_etat` CHECK (`Etat` in (0,1))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Balance`
--

LOCK TABLES `Balance` WRITE;
/*!40000 ALTER TABLE `Balance` DISABLE KEYS */;
INSERT INTO `Balance` VALUES (1,1),(2,1);
/*!40000 ALTER TABLE `Balance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DonneeCollecte`
--

DROP TABLE IF EXISTS `DonneeCollecte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `DonneeCollecte` (
  `idDonnee` int(11) NOT NULL AUTO_INCREMENT,
  `TypeDechet` varchar(45) DEFAULT NULL,
  `Valeur` float NOT NULL,
  `DateDeCollecte` timestamp NOT NULL DEFAULT current_timestamp(),
  `idBalance` int(11),
  PRIMARY KEY (`idDonnee`),
  KEY `idx_donnee_balance` (`idBalance`),
  CONSTRAINT `fk_balance` FOREIGN KEY (`idBalance`) REFERENCES `Balance` (`idBalance`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_valeur` CHECK (`Valeur` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=357 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DonneeCollecte`
--

LOCK TABLES `DonneeCollecte` WRITE;
/*!40000 ALTER TABLE `DonneeCollecte` DISABLE KEYS */;
INSERT INTO `DonneeCollecte` VALUES (22,'Plastique',5.5,'2026-02-09 16:05:11',1),(23,'Plastique',90,'2026-02-11 12:20:47',1),(24,'Organique',10.5,'2026-03-11 09:26:12',1),(25,'Plastique',7,'2026-03-11 09:26:38',1),(26,'Plastique',4,'2026-03-11 09:26:42',1),(27,'Plastique',17.5,'2026-03-11 09:26:48',1),(28,'Plastique',14,'2026-03-11 09:45:26',1),(29,'Plastique',7,'2026-03-13 12:51:54',1),(32,'Organique',12,'2026-03-13 12:55:51',1),(39,'Plastique',9,'2026-04-01 14:38:59',1),(43,'Plastique',17,'2026-04-08 13:01:54',1),(44,'Plastique',25,'2026-04-08 13:04:52',1),(45,'Plastique',18.5,'2026-04-08 13:20:00',1),(46,'Plastique',28.5,'2026-04-08 13:34:07',1),(47,'Plastique',16,'2026-04-08 13:48:48',1),(55,'Organique',1.35,'2026-05-06 15:15:46',1),(56,'Organique',1.55,'2026-05-06 15:15:47',1),(57,'Organique',1.41,'2026-05-06 15:15:48',1),(58,'Organique',0.08,'2026-05-06 15:15:49',1),(59,'Organique',1.01,'2026-05-06 15:15:50',1),(60,'Organique',68.78,'2026-05-06 15:15:51',1),(76,'Organique',0.001,'2026-05-07 15:05:58',1),(78,'Organique',0.002,'2026-05-07 15:06:10',1),(79,'Organique',0.596,'2026-05-07 14:12:45',1),(83,'Organique',2.099,'2026-05-07 14:14:46',1),(84,'Organique',7.673,'2026-05-07 14:14:48',1),(85,'Organique',0.02,'2026-05-07 14:14:50',1),(86,'Organique',0.001,'2026-05-07 14:15:00',1),(88,'Organique',0.001,'2026-05-07 14:16:20',1),(94,'Organique',0.211,'2026-05-07 14:16:35',1),(95,'Organique',5.312,'2026-05-07 14:16:37',1),(96,'Organique',0.003,'2026-05-07 14:16:39',1),(99,'Organique',0.601,'2026-05-22 09:39:42',2),(100,'Organique',0.601,'2026-05-22 09:39:44',2),(101,'Organique',0.602,'2026-05-22 09:39:46',2),(106,'Organique',0.001,'2026-05-26 10:56:40',2),(107,'Organique',0.001,'2026-05-26 10:56:40',2),(108,'Organique',0.006,'2026-05-26 10:56:42',2),(109,'Organique',0.006,'2026-05-26 10:56:42',2),(110,'Organique',0.007,'2026-05-26 10:56:44',2),(111,'Organique',0.007,'2026-05-26 10:56:44',2),(112,'Organique',0.005,'2026-05-26 10:56:46',2),(113,'Organique',0.007,'2026-05-26 10:56:48',2),(114,'Organique',1.013,'2026-05-26 10:56:50',2),(116,'Organique',0.002,'2026-05-26 10:57:17',2),(117,'Organique',0.001,'2026-05-26 10:57:19',2),(118,'Organique',12.266,'2026-05-26 10:57:21',2),(119,'Organique',0.271,'2026-05-26 10:57:23',2),(120,'Organique',15.317,'2026-05-26 10:57:25',2),(121,'Organique',0.567,'2026-05-26 10:58:58',2),(122,'Organique',2.299,'2026-05-26 10:59:00',2),(123,'Organique',5.449,'2026-05-26 10:59:02',2),(129,'Organique',3.9,'2026-05-26 13:02:13',2),(143,'Organique',0.8,'2026-05-27 09:25:56',2),(144,'Organique',1,'2026-05-27 09:25:58',2),(145,'Organique',1,'2026-05-27 09:26:00',2),(146,'Organique',1.2,'2026-05-27 09:26:02',2),(147,'Organique',2,'2026-05-27 09:26:04',2),(148,'Organique',0.1,'2026-05-27 09:26:06',2),(153,'Organique',0.1,'2026-05-27 09:34:13',2),(157,'Organique',0.1,'2026-05-27 09:34:21',2),(169,'Organique',0.1,'2026-05-27 12:39:52',2),(170,'Organique',0.1,'2026-05-27 12:40:11',2),(172,'Organique',7.43,'2026-05-27 12:47:34',2),(173,'Plastique',1,'2026-05-28 08:03:52',1),(174,'Organique',0.16,'2026-05-28 08:04:45',2),(175,'Plastique',0.1,'2026-05-28 08:04:47',2),(176,'Organique',0.02,'2026-05-28 08:06:58',2),(177,'Plastique',0.97,'2026-05-28 08:07:06',2),(178,'Organique',4.59,'2026-05-28 08:07:21',2),(179,'Plastique',2.29,'2026-05-28 08:10:49',2),(180,'Organique',1.71,'2026-05-28 08:10:51',2),(181,'Organique',1.44,'2026-05-28 08:10:54',2),(182,'Organique',0.75,'2026-05-28 08:10:57',2),(183,'Plastique',0.5,'2026-05-28 08:11:00',2),(184,'Organique',1.07,'2026-05-28 08:11:03',2),(185,'Plastique',10.75,'2026-05-28 08:11:07',2),(186,'Organique',16.33,'2026-05-28 08:11:13',2),(187,'Plastique',50,'2026-05-28 08:11:56',1),(189,'Organique',50,'2026-05-28 08:18:04',1),(190,'Plastique',0.01,'2026-05-28 08:20:53',2),(193,'Plastique',0.1,'2026-05-28 08:21:08',2),(194,'Organique',3.6,'2026-05-28 08:21:13',2),(197,'Organique',7.53,'2026-05-28 08:54:52',2),(198,'Plastique',0.37,'2026-05-28 12:30:10',2),(200,'Plastique',1,'2026-05-29 07:18:59',1),(201,'Organique',1.8,'2026-05-29 08:14:14',2),(202,'Organique',1.53,'2026-05-29 08:15:00',2),(203,'Organique',1.16,'2026-05-29 08:15:04',2),(204,'Plastique',0.99,'2026-05-29 08:15:06',2),(205,'Organique',1.03,'2026-05-29 08:15:13',2),(206,'Plastique',0.86,'2026-05-29 08:15:17',2),(207,'Organique',0.78,'2026-05-29 08:15:19',2),(208,'Plastique',1.11,'2026-05-29 08:15:21',2),(209,'Organique',0.81,'2026-05-29 08:16:33',2),(210,'Plastique',0.8,'2026-05-29 08:16:36',2),(211,'Organique',0.8,'2026-05-29 08:16:40',2),(212,'Organique',0.73,'2026-05-29 08:16:51',2),(213,'Plastique',10.4,'2026-05-29 08:39:47',1),(214,'Plastique',10,'2026-05-29 08:41:20',1),(215,'Plastique',0.42,'2026-05-29 08:59:25',2),(216,'Organique',0.43,'2026-05-29 08:59:50',2),(217,'Plastique',0.42,'2026-05-29 09:04:10',2),(218,'Organique',0.36,'2026-05-29 09:09:05',2),(219,'Plastique',0.07,'2026-05-29 09:09:19',2),(220,'Organique',0.33,'2026-05-29 09:09:45',2),(221,'Organique',0.05,'2026-05-29 09:09:49',2),(222,'Organique',0.29,'2026-05-29 09:10:27',2),(223,'Organique',0.35,'2026-05-29 09:10:39',2),(224,'Organique',0.29,'2026-05-29 09:15:40',2),(225,'Organique',0.32,'2026-05-29 09:16:13',2),(226,'Plastique',0.35,'2026-05-29 09:16:34',2),(227,'Plastique',0.3,'2026-05-29 09:16:44',2),(228,'Organique',0.34,'2026-05-29 09:24:17',2),(229,'Organique',0,'2026-05-29 09:24:39',2),(230,'Organique',0,'2026-05-29 09:24:59',2),(231,'Organique',0.25,'2026-05-29 09:25:04',2),(232,'Organique',0.48,'2026-05-29 09:25:14',2),(233,'Organique',0.04,'2026-05-29 09:25:28',2),(234,'Plastique',0.22,'2026-05-29 09:25:53',2),(235,'Plastique',1.4,'2026-05-29 11:31:03',1),(236,'Plastique',1.4,'2026-05-29 09:31:03',1),(237,'Plastique',1.5,'2026-05-29 09:44:06',1),(238,'Organique',0.76,'2026-05-29 09:45:42',2),(239,'Organique',0.75,'2026-05-29 09:46:00',2),(240,'Plastique',0.76,'2026-05-29 09:46:21',2),(241,'Organique',0.38,'2026-05-29 11:28:14',2),(242,'Plastique',0.54,'2026-05-29 11:28:23',2),(243,'Organique',0,'2026-05-29 11:28:37',2),(244,'Plastique',0.76,'2026-05-29 11:28:42',2),(245,'Organique',0.73,'2026-05-29 11:28:53',2),(246,'Plastique',0.73,'2026-05-29 11:28:59',2),(247,'Plastique',0.74,'2026-05-29 11:29:07',2),(248,'Organique',0.68,'2026-05-29 11:29:11',2),(249,'Organique',0.73,'2026-05-29 11:29:15',2),(250,'Plastique',0.71,'2026-05-29 11:29:26',2),(251,'Plastique',0.56,'2026-05-29 11:29:32',2),(252,'Organique',0.73,'2026-05-29 11:30:05',2),(253,'Plastique',0.73,'2026-05-29 11:30:10',2),(254,'Organique',0.91,'2026-05-29 11:30:18',2),(255,'Organique',0.91,'2026-05-29 11:30:36',2),(256,'Organique',0.71,'2026-05-29 11:30:40',2),(257,'Plastique',0.71,'2026-05-29 11:30:54',2),(258,'Organique',6.35,'2026-05-29 11:31:32',2),(259,'Organique',0.72,'2026-05-29 11:33:56',2),(260,'Plastique',0.72,'2026-05-29 11:35:36',2),(261,'Organique',0.72,'2026-05-29 11:36:03',2),(262,'Organique',0,'2026-05-29 11:36:08',2),(263,'Organique',4.47,'2026-05-29 11:36:39',2),(264,'Plastique',0.72,'2026-05-29 11:36:58',2),(265,'Organique',0.72,'2026-05-29 11:39:59',2),(266,'Plastique',0.72,'2026-05-29 11:41:50',2),(267,'Plastique',2.05,'2026-05-29 11:53:32',2),(268,'Plastique',0.04,'2026-05-29 11:53:32',2),(269,'Plastique',0.03,'2026-05-29 11:53:38',2),(270,'Organique',0,'2026-05-29 11:53:48',2),(271,'Plastique',1.92,'2026-05-29 11:53:55',2),(272,'Plastique',1.04,'2026-05-29 11:54:00',2),(273,'Plastique',0.06,'2026-05-29 11:54:05',2),(274,'Organique',0.95,'2026-05-29 11:54:10',2),(275,'Organique',2.04,'2026-05-29 11:54:24',2),(276,'Plastique',2.19,'2026-05-29 11:54:24',2),(277,'Plastique',2.23,'2026-05-29 11:54:58',2),(278,'Plastique',2.02,'2026-05-29 11:55:03',2),(279,'Organique',2.15,'2026-05-29 11:55:06',2),(280,'Organique',2.01,'2026-05-29 11:55:07',2),(281,'Organique',7.12,'2026-05-29 11:55:10',2),(282,'Organique',7.47,'2026-05-29 11:56:11',2),(283,'Plastique',7.47,'2026-05-29 11:56:17',2),(284,'Organique',7.47,'2026-05-29 11:56:29',2),(285,'Organique',2.07,'2026-05-29 11:57:03',2),(286,'Plastique',0.85,'2026-05-29 11:57:09',2),(287,'Organique',0.72,'2026-05-29 11:57:27',2),(288,'Organique',0.75,'2026-05-29 11:58:41',2),(289,'Plastique',0.8,'2026-05-29 11:58:57',2),(290,'Organique',1.5,'2026-05-29 12:01:28',1),(291,'Organique',1.16,'2026-05-29 12:01:42',2),(292,'Plastique',1.46,'2026-05-29 12:01:47',2),(293,'Organique',1.15,'2026-05-29 12:01:51',2),(294,'Plastique',7.38,'2026-05-29 12:01:53',2),(295,'Organique',1.27,'2026-05-29 12:02:01',2),(296,'Organique',1.17,'2026-05-29 12:02:07',2),(297,'Organique',0.61,'2026-05-29 12:02:25',2),(298,'Organique',0.71,'2026-05-29 12:02:52',2),(299,'Plastique',0.72,'2026-05-29 12:02:56',2),(300,'Plastique',0.72,'2026-05-29 12:02:57',2),(301,'Plastique',0.72,'2026-05-29 12:03:20',2),(302,'Plastique',0.72,'2026-05-29 12:03:21',2),(303,'Plastique',0.72,'2026-05-29 12:03:22',2),(304,'Plastique',0.59,'2026-05-29 12:03:23',2),(305,'Plastique',0.01,'2026-05-29 12:03:24',2),(306,'Plastique',0.01,'2026-05-29 12:03:25',2),(307,'Plastique',0.01,'2026-05-29 12:03:26',2),(308,'Organique',0.71,'2026-05-29 12:03:46',2),(309,'Organique',2.97,'2026-05-29 12:04:53',2),(310,'Organique',0.75,'2026-05-29 12:04:53',2),(311,'Organique',1.41,'2026-05-29 12:10:09',2),(312,'Organique',0.69,'2026-05-29 12:10:13',2),(313,'Plastique',0.72,'2026-05-29 12:10:19',2),(314,'Plastique',0.74,'2026-05-29 12:10:24',2),(315,'Plastique',0.74,'2026-05-29 12:10:25',2),(316,'Plastique',0.74,'2026-05-29 12:10:26',2),(317,'Plastique',0.74,'2026-05-29 12:10:28',2),(318,'Organique',0.74,'2026-05-29 12:10:28',2),(319,'Organique',0.74,'2026-05-29 12:10:30',2),(320,'Organique',0.74,'2026-05-29 12:10:31',2),(321,'Organique',2.72,'2026-05-29 12:15:17',2),(322,'Organique',0.75,'2026-05-29 12:15:19',2),(323,'Plastique',0.75,'2026-05-29 12:15:22',2),(324,'Organique',0.71,'2026-05-29 12:15:40',2),(325,'Organique',0.75,'2026-05-29 12:25:36',2),(326,'Organique',0.73,'2026-05-29 12:29:44',2),(327,'Plastique',0.73,'2026-05-29 12:29:49',2),(328,'Organique',1.24,'2026-05-29 12:36:11',2),(329,'Plastique',0.76,'2026-05-29 12:36:15',2),(330,'Plastique',0.02,'2026-05-29 12:36:25',2),(331,'Organique',0.67,'2026-05-29 12:36:33',2),(332,'Organique',0.68,'2026-05-29 12:36:39',2),(333,'Organique',1,'2026-05-29 12:54:12',1),(334,'Organique',0.15,'2026-05-29 12:56:36',2),(335,'Plastique',0.11,'2026-05-29 12:56:41',2),(336,'Organique',0.45,'2026-05-29 12:57:03',2),(337,'Plastique',0.48,'2026-05-29 12:57:05',2),(338,'Organique',0.46,'2026-05-29 12:57:11',2),(339,'Organique',0.54,'2026-05-29 12:57:36',2),(340,'Plastique',0.53,'2026-05-29 12:57:39',2),(341,'Organique',0,'2026-05-29 12:58:49',2),(342,'Organique',0.68,'2026-05-29 12:58:49',2),(343,'Organique',38.4,'2026-05-29 12:59:18',2),(344,'Organique',0.01,'2026-05-29 13:00:00',2),(345,'Plastique',0.19,'2026-05-29 13:00:18',2),(346,'Plastique',0.67,'2026-05-29 13:00:32',2),(347,'Organique',0.66,'2026-05-29 13:01:17',2),(348,'Organique',0.03,'2026-05-29 13:03:04',2),(349,'Plastique',0.03,'2026-05-29 13:03:11',2),(350,'Organique',0.71,'2026-05-29 13:03:20',2),(351,'Organique',0.73,'2026-05-29 13:04:16',2),(352,'Organique',0,'2026-05-29 13:05:20',2),(353,'Organique',1,'2026-06-01 11:56:50',1),(354,'Plastique',3.1,'2026-06-01 11:57:54',1),(355,'Organique',1,'2026-06-02 07:25:35',1),(356,'Organique',1,'2026-06-02 14:06:31',1);
/*!40000 ALTER TABLE `DonneeCollecte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IP_BAN`
--

DROP TABLE IF EXISTS `IP_BAN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `IP_BAN` (
  `Adresse_IP` varchar(100) NOT NULL,
  `Date_Ban` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`Adresse_IP`),
  KEY `idx_ipban` (`Adresse_IP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IP_BAN`
--

LOCK TABLES `IP_BAN` WRITE;
/*!40000 ALTER TABLE `IP_BAN` DISABLE KEYS */;
/*!40000 ALTER TABLE `IP_BAN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Utilisateur`
--

DROP TABLE IF EXISTS `Utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Utilisateur` (
  `idUtilisateur` int(11) NOT NULL AUTO_INCREMENT,
  `Nom` varchar(100) NOT NULL,
  `Prenom` varchar(100) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `Role` varchar(50) NOT NULL DEFAULT 'user',
  `MotDePasse` varchar(225) NOT NULL,
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
INSERT INTO `Utilisateur` VALUES (25,'Grace','Ronan','rg@gmail.com','webadmin','$2b$10$CCPBYXej21vkoE3NVcCv.OrblpGV./aNqHEtwbPqIlBRANSKVqNLS'),(97,'Paul','Lemoine','p.lemoin@lacroixrouge-brest.fr','AgentDeRestauration','$2b$10$5RmVA0D9eJZVxNRpJY3Fzeg0XClb6oM.bzfFhXqGjqNtBTjsYDUfe'),(98,'john','smith','j.smith@lacroixrouge-brest.fr','AgentDeRestauration','$2b$10$rxbll4ldhlHg4Pn/kL109O24big0.7mtHNXJaRF8HdfXppr7xWdcm');
/*!40000 ALTER TABLE `Utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `IdMenu` int(11) NOT NULL AUTO_INCREMENT,
  `NomPlat` varchar(100) NOT NULL,
  `TypePlat` enum('entree','plat','dessert','boisson') NOT NULL,
  `MassePlat` float NOT NULL,
  `Jour` enum('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche') NOT NULL,
  PRIMARY KEY (`IdMenu`),
  CONSTRAINT `chk_masse` CHECK (`MassePlat` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (15,'Carotte','entree',0.9,'Lundi'),(16,'Carotte','entree',0.9,'Mardi'),(17,'Sandwich Jambon','plat',0.83,'Lundi'),(18,'Sandwich Jambon','plat',0.83,'Mardi'),(19,'Sandwich Jambon','plat',0.83,'Vendredi'),(20,'Poire','dessert',1.4,'Lundi'),(21,'Poire','dessert',0.7,'Lundi'),(22,'Poire','dessert',1.4,'Lundi'),(23,'Poire','dessert',1.2,'Mardi'),(24,'Banane','dessert',0.95,'Jeudi'),(25,'Banane','dessert',0.95,'Mardi'),(26,'Oeuf','entree',50,'Lundi'),(27,'Carotte','entree',0.9,'Jeudi'),(28,'Carotte','entree',0.9,'Vendredi'),(29,'Sandwich Jambon','plat',0.83,'Jeudi'),(30,'Banane','dessert',0.95,'Lundi'),(31,'Poire','dessert',1.2,'Vendredi'),(32,'Nuggets','plat',45,'Vendredi'),(33,'Patate','entree',30,'Mardi'),(34,'Pomme','dessert',19,'Lundi'),(35,'Danette','dessert',10,'Mardi'),(36,'Fraise','dessert',5,'Lundi'),(37,'Ruttabagha','plat',25,'Mardi'),(38,'Pomme','dessert',19,'Jeudi');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-03 14:58:38
