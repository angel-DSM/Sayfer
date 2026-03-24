-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: sayfer
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

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

--
-- Table structure for table `admi_alimento`
--

DROP TABLE IF EXISTS `admi_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admi_alimento` (
  `id_admi_alimento` int NOT NULL AUTO_INCREMENT,
  `cantidad_utilizada` bigint NOT NULL,
  `fecha_alimentacion` date NOT NULL,
  `id_ciclo` int NOT NULL,
  `id_galpon` int NOT NULL,
  `id_tipo_alimento` int NOT NULL,
  `id_unidad` int NOT NULL,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id_admi_alimento`),
  KEY `id_ciclo` (`id_ciclo`),
  KEY `id_galpon` (`id_galpon`),
  KEY `id_tipo_alimento` (`id_tipo_alimento`),
  KEY `id_unidad` (`id_unidad`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `admi_alimento_ibfk_1` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `admi_alimento_ibfk_2` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`),
  CONSTRAINT `admi_alimento_ibfk_3` FOREIGN KEY (`id_tipo_alimento`) REFERENCES `tipo_alimento` (`id_tipo_alimento`),
  CONSTRAINT `admi_alimento_ibfk_4` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`),
  CONSTRAINT `admi_alimento_ibfk_5` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`cedula`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admi_alimento`
--

LOCK TABLES `admi_alimento` WRITE;
/*!40000 ALTER TABLE `admi_alimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `admi_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admi_medicamento`
--

DROP TABLE IF EXISTS `admi_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admi_medicamento` (
  `id_admin_medicamento` int NOT NULL AUTO_INCREMENT,
  `cantidad_utilizada_medi` decimal(20,0) NOT NULL,
  `fecha_medicacion` date NOT NULL,
  `id_ciclo` int NOT NULL,
  `id_galpon` int NOT NULL,
  `id_unidad` int NOT NULL,
  `id_usuario` bigint NOT NULL,
  `id_tipo_medicamento` int NOT NULL,
  PRIMARY KEY (`id_admin_medicamento`),
  KEY `id_ciclo` (`id_ciclo`),
  KEY `id_galpon` (`id_galpon`),
  KEY `id_unidad` (`id_unidad`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_tipo_medicamento` (`id_tipo_medicamento`),
  CONSTRAINT `admi_medicamento_ibfk_1` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `admi_medicamento_ibfk_2` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`),
  CONSTRAINT `admi_medicamento_ibfk_3` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`),
  CONSTRAINT `admi_medicamento_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`cedula`),
  CONSTRAINT `admi_medicamento_ibfk_5` FOREIGN KEY (`id_tipo_medicamento`) REFERENCES `tipo_medicamento` (`id_tipo_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admi_medicamento`
--

LOCK TABLES `admi_medicamento` WRITE;
/*!40000 ALTER TABLE `admi_medicamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `admi_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciclo_produccion`
--

DROP TABLE IF EXISTS `ciclo_produccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciclo_produccion` (
  `id_ciclo` int NOT NULL AUTO_INCREMENT,
  `nombre_ciclo` varchar(20) NOT NULL,
  PRIMARY KEY (`id_ciclo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclo_produccion`
--

LOCK TABLES `ciclo_produccion` WRITE;
/*!40000 ALTER TABLE `ciclo_produccion` DISABLE KEYS */;
INSERT INTO `ciclo_produccion` VALUES (1,'Ciclo 2026-A'),(2,'Ciclo 2026-B'),(3,'Ciclo 2025-D');
/*!40000 ALTER TABLE `ciclo_produccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `galpon`
--

DROP TABLE IF EXISTS `galpon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `galpon` (
  `id_galpon` int NOT NULL AUTO_INCREMENT,
  `ancho` bigint NOT NULL,
  `capacidad` bigint NOT NULL,
  `dimension` bigint NOT NULL,
  `largo` bigint NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_galpon`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galpon`
--

LOCK TABLES `galpon` WRITE;
/*!40000 ALTER TABLE `galpon` DISABLE KEYS */;
INSERT INTO `galpon` VALUES (1,12,12000,1200,100,'Galpón Norte 1'),(2,12,10000,960,80,'Galpón Norte 2'),(3,14,15000,1680,120,'Galpón Sur 1'),(4,12,12000,1200,100,'Galpón Sur 2');
/*!40000 ALTER TABLE `galpon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `galpon_ciclo_produccion`
--

DROP TABLE IF EXISTS `galpon_ciclo_produccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `galpon_ciclo_produccion` (
  `id_galpon_ciclo_produccion` int NOT NULL AUTO_INCREMENT,
  `fecha_fin` date DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `id_ciclo` int DEFAULT NULL,
  `id_galpon` int DEFAULT NULL,
  PRIMARY KEY (`id_galpon_ciclo_produccion`),
  KEY `id_ciclo` (`id_ciclo`),
  KEY `id_galpon` (`id_galpon`),
  CONSTRAINT `galpon_ciclo_produccion_ibfk_1` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `galpon_ciclo_produccion_ibfk_2` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galpon_ciclo_produccion`
--

LOCK TABLES `galpon_ciclo_produccion` WRITE;
/*!40000 ALTER TABLE `galpon_ciclo_produccion` DISABLE KEYS */;
INSERT INTO `galpon_ciclo_produccion` VALUES (1,NULL,'2026-01-10',1,1),(2,NULL,'2026-01-10',1,2),(3,NULL,'2026-02-01',2,3),(4,NULL,'2026-02-01',2,4);
/*!40000 ALTER TABLE `galpon_ciclo_produccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_alimento`
--

DROP TABLE IF EXISTS `historial_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_alimento` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `cantidad_anterior` bigint DEFAULT NULL,
  `cantidad_movida` decimal(10,2) DEFAULT NULL,
  `cantidad_nueva` bigint DEFAULT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `fecha_movimiento` date DEFAULT NULL,
  `tipo_operacion` varchar(20) DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL,
  `valor_unitario` decimal(10,2) DEFAULT NULL,
  `id_ciclo` int DEFAULT NULL,
  `id_galpon` int DEFAULT NULL,
  `id_tipo_alimento` int DEFAULT NULL,
  `id_usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_ciclo` (`id_ciclo`),
  KEY `id_galpon` (`id_galpon`),
  KEY `id_tipo_alimento` (`id_tipo_alimento`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `historial_alimento_ibfk_1` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `historial_alimento_ibfk_2` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`),
  CONSTRAINT `historial_alimento_ibfk_3` FOREIGN KEY (`id_tipo_alimento`) REFERENCES `tipo_alimento` (`id_tipo_alimento`),
  CONSTRAINT `historial_alimento_ibfk_4` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_alimento`
--

LOCK TABLES `historial_alimento` WRITE;
/*!40000 ALTER TABLE `historial_alimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_medicamento`
--

DROP TABLE IF EXISTS `historial_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_medicamento` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `cantidad_anterior` bigint DEFAULT NULL,
  `cantidad_movida` decimal(10,2) DEFAULT NULL,
  `cantidad_nueva` bigint DEFAULT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `fecha_movimiento` date DEFAULT NULL,
  `tipo_operacion` varchar(20) DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL,
  `valor_unitario` decimal(10,2) DEFAULT NULL,
  `id_ciclo` int DEFAULT NULL,
  `id_galpon` int DEFAULT NULL,
  `id_tipo_medicamento` int DEFAULT NULL,
  `id_unidad` int DEFAULT NULL,
  `id_usuario` bigint DEFAULT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_ciclo` (`id_ciclo`),
  KEY `id_galpon` (`id_galpon`),
  KEY `id_tipo_medicamento` (`id_tipo_medicamento`),
  KEY `id_unidad` (`id_unidad`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `historial_medicamento_ibfk_1` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `historial_medicamento_ibfk_2` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`),
  CONSTRAINT `historial_medicamento_ibfk_3` FOREIGN KEY (`id_tipo_medicamento`) REFERENCES `tipo_medicamento` (`id_tipo_medicamento`),
  CONSTRAINT `historial_medicamento_ibfk_4` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`),
  CONSTRAINT `historial_medicamento_ibfk_5` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_medicamento`
--

LOCK TABLES `historial_medicamento` WRITE;
/*!40000 ALTER TABLE `historial_medicamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ing_alimento`
--

DROP TABLE IF EXISTS `ing_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ing_alimento` (
  `id_ing_alimento` int NOT NULL AUTO_INCREMENT,
  `cantidad` decimal(10,2) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `modificacion` decimal(10,2) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `id_tipo_alimento` int DEFAULT NULL,
  `ancho` date NOT NULL,
  `largo` date NOT NULL,
  `valor_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_ing_alimento`),
  KEY `id_tipo_alimento` (`id_tipo_alimento`),
  CONSTRAINT `ing_alimento_ibfk_1` FOREIGN KEY (`id_tipo_alimento`) REFERENCES `tipo_alimento` (`id_tipo_alimento`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ing_alimento`
--

LOCK TABLES `ing_alimento` WRITE;
/*!40000 ALTER TABLE `ing_alimento` DISABLE KEYS */;
INSERT INTO `ing_alimento` VALUES (1,5000.00,'2026-03-19',0.00,9000000.00,2,'2026-03-19','2026-03-19',1800.00),(2,2000.00,'2026-03-10',0.00,4200000.00,1,'2026-03-10','2026-03-10',2100.00),(3,3000.00,'2026-02-28',0.00,4800000.00,3,'2026-02-28','2026-02-28',1600.00);
/*!40000 ALTER TABLE `ing_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ing_medicamento`
--

DROP TABLE IF EXISTS `ing_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ing_medicamento` (
  `id_ing_medicamento` int NOT NULL AUTO_INCREMENT,
  `cantidad` float NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `modificacion` decimal(30,2) NOT NULL,
  `valor_total` decimal(30,2) NOT NULL,
  `id_tipo_medicamento` int NOT NULL,
  `id_unidad` int NOT NULL,
  PRIMARY KEY (`id_ing_medicamento`),
  KEY `id_tipo_medicamento` (`id_tipo_medicamento`),
  KEY `id_unidad` (`id_unidad`),
  CONSTRAINT `ing_medicamento_ibfk_1` FOREIGN KEY (`id_tipo_medicamento`) REFERENCES `tipo_medicamento` (`id_tipo_medicamento`),
  CONSTRAINT `ing_medicamento_ibfk_2` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ing_medicamento`
--

LOCK TABLES `ing_medicamento` WRITE;
/*!40000 ALTER TABLE `ing_medicamento` DISABLE KEYS */;
INSERT INTO `ing_medicamento` VALUES (1,500,'2026-02-20',0.00,400000.00,1,3),(2,10,'2026-02-15',0.00,450000.00,2,2),(3,5,'2026-01-30',0.00,600000.00,3,1);
/*!40000 ALTER TABLE `ing_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mortalidad`
--

DROP TABLE IF EXISTS `mortalidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mortalidad` (
  `id_mortalidad` int NOT NULL AUTO_INCREMENT,
  `causa` varchar(20) NOT NULL,
  `fecha_de_muerte` date NOT NULL,
  `cantidad_muertos` varchar(20) NOT NULL,
  `id_ciclo` int NOT NULL,
  `id_galpon` int NOT NULL,
  `id_tipo_muerte` int NOT NULL,
  PRIMARY KEY (`id_mortalidad`),
  KEY `id_ciclo` (`id_ciclo`),
  KEY `id_galpon` (`id_galpon`),
  KEY `id_tipo_muerte` (`id_tipo_muerte`),
  CONSTRAINT `mortalidad_ibfk_1` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `mortalidad_ibfk_2` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`),
  CONSTRAINT `mortalidad_ibfk_3` FOREIGN KEY (`id_tipo_muerte`) REFERENCES `tipo_muerte` (`id_tipo_muerte`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mortalidad`
--

LOCK TABLES `mortalidad` WRITE;
/*!40000 ALTER TABLE `mortalidad` DISABLE KEYS */;
INSERT INTO `mortalidad` VALUES (1,'Baja ventilación','2026-03-19','18',1,2,3),(2,'Aplastamiento','2026-03-18','12',1,1,1),(3,'Respiratorio','2026-03-17','9',2,4,2),(4,'Colibacilossis','2026-03-16','22',1,2,2),(5,'Calor','2026-03-15','7',1,1,4),(6,'Aplastamiento','2026-03-14','11',2,3,1),(7,'Ascitis','2026-03-13','14',1,2,3);
/*!40000 ALTER TABLE `mortalidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_alimento`
--

DROP TABLE IF EXISTS `stock_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_alimento` (
  `id_stock_alimento` int NOT NULL AUTO_INCREMENT,
  `cantidad` bigint DEFAULT NULL,
  `id_tipo_alimento` int DEFAULT NULL,
  `id_unidad` int DEFAULT NULL,
  PRIMARY KEY (`id_stock_alimento`),
  KEY `id_tipo_alimento` (`id_tipo_alimento`),
  KEY `id_unidad` (`id_unidad`),
  CONSTRAINT `stock_alimento_ibfk_1` FOREIGN KEY (`id_tipo_alimento`) REFERENCES `tipo_alimento` (`id_tipo_alimento`),
  CONSTRAINT `stock_alimento_ibfk_2` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_alimento`
--

LOCK TABLES `stock_alimento` WRITE;
/*!40000 ALTER TABLE `stock_alimento` DISABLE KEYS */;
INSERT INTO `stock_alimento` VALUES (1,2100,1,1),(2,8300,2,1),(3,8000,3,1);
/*!40000 ALTER TABLE `stock_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_medicamento`
--

DROP TABLE IF EXISTS `stock_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_medicamento` (
  `id_stock_medicamento` int NOT NULL AUTO_INCREMENT,
  `cantidad_actual` decimal(10,2) NOT NULL,
  `id_tipo_medicamento` int NOT NULL,
  `id_unidad` int NOT NULL,
  PRIMARY KEY (`id_stock_medicamento`),
  KEY `id_tipo_medicamento` (`id_tipo_medicamento`),
  KEY `id_unidad` (`id_unidad`),
  CONSTRAINT `stock_medicamento_ibfk_1` FOREIGN KEY (`id_tipo_medicamento`) REFERENCES `tipo_medicamento` (`id_tipo_medicamento`),
  CONSTRAINT `stock_medicamento_ibfk_2` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_medicamento`
--

LOCK TABLES `stock_medicamento` WRITE;
/*!40000 ALTER TABLE `stock_medicamento` DISABLE KEYS */;
INSERT INTO `stock_medicamento` VALUES (1,450.00,1,3),(2,2.00,2,2),(3,1.00,3,1),(4,8.00,4,2);
/*!40000 ALTER TABLE `stock_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_alimento`
--

DROP TABLE IF EXISTS `tipo_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_alimento` (
  `id_tipo_alimento` int NOT NULL AUTO_INCREMENT,
  `descripcion_alimento` varchar(200) DEFAULT NULL,
  `nombre_alimento` varchar(30) NOT NULL,
  PRIMARY KEY (`id_tipo_alimento`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_alimento`
--

LOCK TABLES `tipo_alimento` WRITE;
/*!40000 ALTER TABLE `tipo_alimento` DISABLE KEYS */;
INSERT INTO `tipo_alimento` VALUES (1,'Concentrado para pollos de 0-21 días','Iniciador'),(2,'Concentrado para pollos de 22-42 días','Engorde'),(3,'Concentrado para pollos de 43+ días','Finalizador');
/*!40000 ALTER TABLE `tipo_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_medicamento`
--

DROP TABLE IF EXISTS `tipo_medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_medicamento` (
  `id_tipo_medicamento` int NOT NULL AUTO_INCREMENT,
  `descripcion_medi` varchar(200) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  PRIMARY KEY (`id_tipo_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_medicamento`
--

LOCK TABLES `tipo_medicamento` WRITE;
/*!40000 ALTER TABLE `tipo_medicamento` DISABLE KEYS */;
INSERT INTO `tipo_medicamento` VALUES (1,'Vacuna contra Newcastle','Newcastle Multivalente'),(2,'Complejo vitamínico','Vitamina A-D-E'),(3,'Antiparasitario','Coccidiostato'),(4,'Suplemento de hidratación','Electrolitos');
/*!40000 ALTER TABLE `tipo_medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_muerte`
--

DROP TABLE IF EXISTS `tipo_muerte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_muerte` (
  `id_tipo_muerte` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(200) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_tipo_muerte`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_muerte`
--

LOCK TABLES `tipo_muerte` WRITE;
/*!40000 ALTER TABLE `tipo_muerte` DISABLE KEYS */;
INSERT INTO `tipo_muerte` VALUES (1,'Muerte por manejo','Aplastamiento'),(2,'Enfermedad respiratoria','Respiratorio'),(3,'Causa metabólica','Síndrome Ascitis'),(4,'Estrés por calor','Calor'),(5,'Sin diagnóstico','Causa desconocida');
/*!40000 ALTER TABLE `tipo_muerte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidad_medida`
--

DROP TABLE IF EXISTS `unidad_medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidad_medida` (
  `id_unidad` int NOT NULL AUTO_INCREMENT,
  `nombre_unidad` varchar(20) NOT NULL,
  PRIMARY KEY (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidad_medida`
--

LOCK TABLES `unidad_medida` WRITE;
/*!40000 ALTER TABLE `unidad_medida` DISABLE KEYS */;
INSERT INTO `unidad_medida` VALUES (1,'kg'),(2,'litros'),(3,'dosis'),(4,'gramos'),(5,'unidades');
/*!40000 ALTER TABLE `unidad_medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `cedula` bigint NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_registro` date NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `rol` varchar(10) NOT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-24  3:32:06
