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
  `idCapteur` int(11) NOT NULL AUTO_INCREMENT,
  `date_mise_service` date DEFAULT NULL,
  `date_fin_service` date DEFAULT NULL,
  PRIMARY KEY (`idCapteur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Balance`
--

LOCK TABLES `Balance` WRITE;
/*!40000 ALTER TABLE `Balance` DISABLE KEYS */;
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
  `Type` varchar(45) DEFAULT NULL,
  `Valeur` float NOT NULL,
  `DateDeCollecte` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`idDonnee`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DonneeCollecte`
--

LOCK TABLES `DonneeCollecte` WRITE;
/*!40000 ALTER TABLE `DonneeCollecte` DISABLE KEYS */;
INSERT INTO `DonneeCollecte` VALUES (1,'Plastique',40,'2026-01-19 14:39:40'),(2,'Organique',80,'2026-01-19 14:40:25'),(3,'Organique',15.75,'2026-01-19 14:40:59'),(4,'Plastique',170,'2026-01-19 15:59:07'),(5,'Plastique',170,'2026-01-19 15:59:12'),(6,'Plastique',170,'2026-01-19 15:59:17'),(7,'Option1',6,'2026-01-20 14:58:00'),(8,'Plastique',8,'2026-01-20 14:59:20'),(9,'Plastique',0,'2026-01-20 15:03:00'),(10,'Plastique',0,'2026-01-20 15:03:00'),(11,'Plastique',0,'2026-01-20 15:03:01'),(12,'Plastique',0,'2026-01-20 15:03:01'),(13,'Plastique',0,'2026-01-20 15:03:01'),(14,'Plastique',12,'2026-01-20 15:31:14'),(15,'Plastique',0,'2026-01-20 15:45:00'),(16,'Plastique',0,'2026-01-20 15:45:41'),(17,'Plastique',0,'2026-01-20 15:45:41'),(18,'Plastique',0,'2026-01-20 15:45:41'),(19,'Plastique',0,'2026-01-20 15:45:42'),(20,'Plastique',0,'2026-01-20 15:45:42'),(21,'Plastique',0,'2026-01-20 15:45:42'),(22,'Plastique',0,'2026-01-20 15:45:42'),(23,'Plastique',0,'2026-01-20 15:45:42'),(24,'Plastique',0,'2026-01-20 15:45:42'),(25,'Plastique',0,'2026-01-20 15:45:43'),(26,'Plastique',0,'2026-01-20 15:45:43'),(27,'Plastique',0,'2026-01-20 15:45:43'),(28,'Plastique',0,'2026-01-20 15:45:43'),(29,'Plastique',0,'2026-01-20 15:45:43'),(30,'Plastique',0,'2026-01-20 15:45:43'),(31,'Plastique',0,'2026-01-20 15:45:44'),(32,'Plastique',0,'2026-01-20 15:45:48'),(33,'Plastique',0,'2026-01-20 15:45:48'),(34,'Organique',0,'2026-01-20 15:45:50'),(35,'Plastique',0,'2026-01-20 15:45:50'),(36,'Plastique',0,'2026-01-20 15:45:50'),(37,'Plastique',0,'2026-01-20 15:45:50'),(38,'Plastique',0,'2026-01-20 15:45:51'),(39,'Plastique',10,'2026-01-20 15:46:07'),(40,'Plastique',10,'2026-01-20 15:46:22'),(41,'Plastique',10,'2026-01-20 15:46:29'),(42,'Plastique',26,'2026-01-20 16:01:38'),(43,'Plastique',13.5,'2026-01-21 10:13:38'),(44,'Plastique',50,'2026-01-21 14:49:43'),(45,'Plastique',0,'2026-01-27 15:34:26'),(46,'Plastique',0,'2026-01-27 15:34:27'),(47,'Plastique',0,'2026-01-27 15:34:27'),(48,'Plastique',0,'2026-01-27 15:34:27'),(49,'Plastique',0,'2026-01-27 15:34:27'),(50,'Plastique',0,'2026-01-27 15:34:27'),(51,'Plastique',0,'2026-01-27 15:34:27'),(52,'Plastique',0,'2026-01-27 15:34:28'),(53,'Plastique',0,'2026-01-27 15:34:28'),(54,'Plastique',0,'2026-01-27 15:34:28'),(55,'Plastique',0,'2026-01-27 15:34:28'),(56,'Plastique',0,'2026-01-27 15:34:28'),(57,'Plastique',0,'2026-01-27 15:34:28'),(58,'Plastique',0,'2026-01-27 15:34:29'),(59,'Plastique',0,'2026-01-27 15:34:29'),(60,'Plastique',0,'2026-01-27 15:34:29'),(61,'Plastique',0,'2026-01-27 15:34:29'),(62,'Plastique',0,'2026-01-27 15:34:29'),(63,'Plastique',0,'2026-01-27 15:34:30'),(64,'Plastique',14.5,'2026-01-27 15:57:59'),(65,'Plastique',0,'2026-01-27 15:58:00'),(66,'Plastique',0,'2026-01-27 15:58:00'),(67,'Plastique',0,'2026-01-27 15:58:01'),(68,'Plastique',0,'2026-01-27 15:58:01'),(69,'Organique',10,'2026-01-27 15:58:05'),(70,'Plastique',0,'2026-01-27 15:58:05'),(71,'Plastique',0.5,'2026-01-27 15:58:11'),(72,'Plastique',150,'2026-01-27 15:58:20'),(73,'Organique',15,'2026-01-27 16:05:30'),(74,'Plastique',0,'2026-01-27 16:05:30'),(75,'Plastique',0,'2026-01-27 16:05:31');
/*!40000 ALTER TABLE `DonneeCollecte` ENABLE KEYS */;
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
  `Role` varchar(50) NOT NULL,
  `MotDePasse` varchar(225) NOT NULL,
  PRIMARY KEY (`idUtilisateur`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
INSERT INTO `Utilisateur` VALUES (1,'Grace','Ronan','r.grace@lacroixrouge-brest.fr','webadmin','mvF1NxKJZ1'),(2,'Aballea','Killian','aballeak@lacroixrouge-brest.fr','AdminBDD','Va#j5jNcM!P'),(8,'A','A','A','AgentDeRestauration','A'),(9,'B','B','B','AgentDeRestauration','B'),(10,'Mignot','Ewen','ah@ah.com','AgentDeRestauration','ah'),(12,'gdmr','cycy','godmerc@lacroixrouge-brest.fr','AgentDeRestauration','pipi'),(13,'','','','AgentDeRestauration','');
/*!40000 ALTER TABLE `Utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-28 14:41:09
