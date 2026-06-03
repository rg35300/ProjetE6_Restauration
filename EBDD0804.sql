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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Balance`
--

LOCK TABLES `Balance` WRITE;
/*!40000 ALTER TABLE `Balance` DISABLE KEYS */;
INSERT INTO `Balance` VALUES (1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DonneeCollecte`
--

LOCK TABLES `DonneeCollecte` WRITE;
/*!40000 ALTER TABLE `DonneeCollecte` DISABLE KEYS */;
INSERT INTO `DonneeCollecte` VALUES (1,'Dechets non organiques',12.5,'2026-02-04 17:02:22',NULL),(3,'Plastique',5.5,'2026-02-09 12:24:47',NULL),(4,'Plastique',110,'2026-02-09 12:24:53',NULL),(5,'Plastique',35,'2026-02-09 12:24:57',NULL),(6,'Plastique',9,'2026-02-09 12:25:04',NULL),(7,'Plastique',150,'2026-02-09 12:25:08',NULL),(8,'Plastique',6.5,'2026-02-09 14:01:58',NULL),(9,'Plastique',5.5,'2026-02-09 14:07:42',NULL),(10,'Plastique',9.5,'2026-02-09 14:07:54',NULL),(11,'Plastique',0,'2026-02-09 14:08:08',NULL),(12,'Plastique',10.5,'2026-02-09 14:19:18',NULL),(13,'Plastique',4.5,'2026-02-09 14:19:37',NULL),(14,'Plastique',0,'2026-02-09 14:20:28',NULL),(15,'Plastique',4,'2026-02-09 14:22:16',NULL),(22,'Plastique',5.5,'2026-02-09 16:05:11',1),(23,'Plastique',90,'2026-02-11 12:20:47',1),(24,'Organique',10.5,'2026-03-11 09:26:12',1),(25,'Plastique',7,'2026-03-11 09:26:38',1),(26,'Plastique',4,'2026-03-11 09:26:42',1),(27,'Plastique',17.5,'2026-03-11 09:26:48',1),(28,'Plastique',14,'2026-03-11 09:45:26',1),(29,'Plastique',7,'2026-03-13 12:51:54',1),(32,'Organique',12,'2026-03-13 12:55:51',1),(33,'Plastique',150,'2026-03-13 13:07:50',1),(34,'Dechet organique',12,'2026-03-13 13:15:00',1),(35,'Dechet organique',12,'2026-03-13 13:15:39',1),(36,'Organique',150,'2026-03-18 13:23:52',1),(37,'Dechet organique',6,'2026-04-01 08:11:40',1),(38,'Dechet organique',15.6,'2026-04-01 09:19:12',1),(39,'Plastique',9,'2026-04-01 14:38:59',1),(40,'Dechet organique',12,'2026-04-07 15:12:09',1),(41,'Dechet organique',78.5,'2026-04-07 15:18:53',1),(42,'Dechet organique',15.4,'2026-04-08 13:57:40',1),(43,'Plastique',17,'2026-04-08 13:01:54',1),(44,'Plastique',25,'2026-04-08 13:04:52',1),(45,'Plastique',18.5,'2026-04-08 13:20:00',1),(46,'Plastique',28.5,'2026-04-08 13:34:07',1),(47,'Plastique',16,'2026-04-08 13:48:48',1);
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
INSERT INTO `IP_BAN` VALUES ('10.160.112.14','2026-04-08 12:51:16');
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
INSERT INTO `Utilisateur` VALUES (25,'Grace','Ronan','rg@gmail.com','webadmin','$2b$10$CCPBYXej21vkoE3NVcCv.OrblpGV./aNqHEtwbPqIlBRANSKVqNLS'),(26,'ah','ah','ah@ah.ah','AgentDeRestauration','$2b$10$TlbyDEjgjj7Ax5v0MiAMReLXfIPavV6V/gcxDEXW4LL46Rq6YByFK'),(27,'','','','AgentDeRestauration','$2b$10$LjHPch9q.0XgPIcMwpnLfuxIIz0njF7hevSFZm7C2/L6hyurVIKBy'),(28,'test','test','test@test.test','AgentDeRestauration','$2b$10$AWLOiCz/IRm9V.ePrgTVl.b.JLE/Efz5/.f8sN0CmePgugzeigMoS'),(30,'yt','dstj','dtj@gmail.com','AgentDeRestauration','$2b$10$uQU.qrbTPbGZsoT3RHOApu3Xz7rZ1p0AbuhmoaFmxr08JfKpKC4p.'),(31,'jean','jean','jean@gmail.com','AgentDeRestauration','$2b$10$SPTlnhYjZ2jRZj41XVdlmOrG2.QV43l/Hkay.J2oiBVCeDSpWwI4u'),(32,'Aballea','KIllian','aballeak@lacroixrouge-brest.fr','AgentDeRestauration','$2b$10$ridknjJOwmDfTksunEahUuPoU8a/caxUq1Z3nkT.MydDZ0YgwFRqy'),(33,'deschamp','didier','didier@gmail.com','AgentDeRestauration','$2b$10$YQlZ80rX0/5nV78tzyreKOpq4yW5dZCGjFszQnNDIJNZZSUCv5MwG'),(34,'dorval','younn','y.d@gmail.com','webadmin','1234'),(35,'ergrg','tshtzh','egqge@gmail.com','AgentDeRestauration','$2b$10$ZiZy6M0BaTZMZShGdljJ0.kWhHCAUhcgOk/4aN4nB6Hv3j3AGgl9a');
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (15,'Carotte','entree',0.9,'Lundi'),(16,'Carotte','entree',0.9,'Mardi'),(17,'Sandwich Jambon','plat',0.6,'Lundi'),(18,'Sandwich Jambon','plat',0.6,'Mardi'),(19,'Sandwich Jambon','plat',1.3,'Vendredi'),(20,'Poire','dessert',1.4,'Lundi'),(21,'Poire','dessert',0.7,'Lundi'),(22,'Poire','dessert',1.4,'Lundi'),(23,'Poire','dessert',1.3,'Mardi'),(24,'Banane','dessert',1.1,'Jeudi'),(25,'Banane','dessert',0.8,'Mardi');
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

-- Dump completed on 2026-04-08 15:01:27
