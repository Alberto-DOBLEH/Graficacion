-- MySQL dump 10.13  Distrib 9.7.0, for Linux (x86_64)
--
-- Host: localhost    Database: graficacion
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

CREATE DATABASE IF NOT EXISTS `graficacion`;
USE `graficacion`;

--
-- GTID state at the beginning of the backup 
--

-- SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '807f7920-04bc-11f1-a1c3-e6d0b4b50cfd:1-20';

--
-- Table structure for table `Analisis_Requerimientos`
--

DROP TABLE IF EXISTS `Analisis_Requerimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Analisis_Requerimientos` (
  `id_analisis` int NOT NULL AUTO_INCREMENT,
  `id_proyecto` int NOT NULL,
  `tipo_metodo` enum('entrevista','cuestionario','historias_usuarios','focus_group','observaciones','documentos','seguimiento_transaccional') NOT NULL,
  `contenido` json NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_analisis`),
  KEY `id_proyecto` (`id_proyecto`),
  CONSTRAINT `Analisis_Requerimientos_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `Proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Analisis_Requerimientos`
--

LOCK TABLES `Analisis_Requerimientos` WRITE;
/*!40000 ALTER TABLE `Analisis_Requerimientos` DISABLE KEYS */;
/*!40000 ALTER TABLE `Analisis_Requerimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Diagramas_Generados`
--

DROP TABLE IF EXISTS `Diagramas_Generados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Diagramas_Generados` (
  `id_diagrama` int NOT NULL AUTO_INCREMENT,
  `id_proyecto` int NOT NULL,
  `tipo_diagrama` varchar(50) NOT NULL,
  `codigo_generado` text NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_diagrama`),
  KEY `id_proyecto` (`id_proyecto`),
  CONSTRAINT `Diagramas_Generados_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `Proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Diagramas_Generados`
--

LOCK TABLES `Diagramas_Generados` WRITE;
/*!40000 ALTER TABLE `Diagramas_Generados` DISABLE KEYS */;
/*!40000 ALTER TABLE `Diagramas_Generados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Participantes`
--

DROP TABLE IF EXISTS `Participantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Participantes` (
  `id_participante` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_participante`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Participantes`
--

LOCK TABLES `Participantes` WRITE;
/*!40000 ALTER TABLE `Participantes` DISABLE KEYS */;
INSERT INTO `Participantes` VALUES (1,'Alberto Hernandez','alberto@gmail.com','$2b$10$NoB8DjbH9FtPiazTkulueujKwkF7bwVuDqPXCReTogS7BPNBsrElO','2026-06-08 14:58:57'),(2,'Cristhian Marquez','cris@gmail.com','$2b$10$84KNMMX2Vbi6ib7ZmMgyEe6GrjgO/G8lOMP.n1KToqbPF07xAnYc.','2026-06-08 15:34:02'),(3,'Admin','admin@gmail.com','$2b$10$1JPC0hOkoGgCaBY0jplujuAvF0aXrxzWqGhDRalmFFhgnwn9Sds/u','2026-06-10 00:00:00');
/*!40000 ALTER TABLE `Participantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prompts_Finales`
--

DROP TABLE IF EXISTS `Prompts_Finales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Prompts_Finales` (
  `id_prompt` int NOT NULL AUTO_INCREMENT,
  `id_proyecto` int NOT NULL,
  `contenido_prompt` text NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_prompt`),
  KEY `id_proyecto` (`id_proyecto`),
  CONSTRAINT `Prompts_Finales_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `Proyectos` (`id_proyecto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prompts_Finales`
--

LOCK TABLES `Prompts_Finales` WRITE;
/*!40000 ALTER TABLE `Prompts_Finales` DISABLE KEYS */;
/*!40000 ALTER TABLE `Prompts_Finales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Proyecto_Participantes`
--

DROP TABLE IF EXISTS `Proyecto_Participantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Proyecto_Participantes` (
  `id_proyecto` int NOT NULL,
  `id_participante` int NOT NULL,
  `id_rol` int DEFAULT NULL,
  PRIMARY KEY (`id_proyecto`,`id_participante`),
  KEY `id_participante` (`id_participante`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `Proyecto_Participantes_ibfk_1` FOREIGN KEY (`id_proyecto`) REFERENCES `Proyectos` (`id_proyecto`) ON DELETE CASCADE,
  CONSTRAINT `Proyecto_Participantes_ibfk_2` FOREIGN KEY (`id_participante`) REFERENCES `Participantes` (`id_participante`) ON DELETE CASCADE,
  CONSTRAINT `Proyecto_Participantes_ibfk_3` FOREIGN KEY (`id_rol`) REFERENCES `Roles` (`id_rol`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Proyecto_Participantes`
--

LOCK TABLES `Proyecto_Participantes` WRITE;
/*!40000 ALTER TABLE `Proyecto_Participantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `Proyecto_Participantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Proyectos`
--

DROP TABLE IF EXISTS `Proyectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Proyectos` (
  `id_proyecto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `estado` varchar(50) DEFAULT 'En progreso',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_participante` int DEFAULT NULL,
  PRIMARY KEY (`id_proyecto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Proyectos`
--

LOCK TABLES `Proyectos` WRITE;
/*!40000 ALTER TABLE `Proyectos` DISABLE KEYS */;
INSERT INTO `Proyectos` VALUES (1,'Sistema pruebas','pruebas','activo','2026-06-08 18:14:40',1),(2,'Sistema prueba 2','tilines','activo','2026-06-08 19:18:50',1);
/*!40000 ALTER TABLE `Proyectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'Administrador'),(2,'Analista Lider'),(3,'Cliente');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 12:32:14
