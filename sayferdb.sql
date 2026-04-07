-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: proyecto_sayfer
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
  `id_unidad` int DEFAULT NULL,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id_admi_alimento`),
  KEY `FKmh1249mwmk6ves3gb0gf0mnll` (`id_ciclo`),
  KEY `FKevckuq5kyc223jpkdwx3tsh0p` (`id_galpon`),
  KEY `FKti962n6u6g2ju1lxfk0t2r6eg` (`id_tipo_alimento`),
  KEY `FKj8ynj7sk5sd7ou9g47ju9lfx0` (`id_unidad`),
  KEY `FKrnnm34xpvn7s22x1oal29taw4` (`id_usuario`),
  CONSTRAINT `FKevckuq5kyc223jpkdwx3tsh0p` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`),
  CONSTRAINT `FKj8ynj7sk5sd7ou9g47ju9lfx0` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`),
  CONSTRAINT `FKmh1249mwmk6ves3gb0gf0mnll` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `FKrnnm34xpvn7s22x1oal29taw4` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`cedula`),
  CONSTRAINT `FKti962n6u6g2ju1lxfk0t2r6eg` FOREIGN KEY (`id_tipo_alimento`) REFERENCES `tipo_alimento` (`id_tipo_alimento`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admi_alimento`
--

LOCK TABLES `admi_alimento` WRITE;
/*!40000 ALTER TABLE `admi_alimento` DISABLE KEYS */;
INSERT INTO `admi_alimento` VALUES (1,150,'2026-02-05',1,1,1,NULL,1000000000),(2,150,'2026-02-12',1,1,1,NULL,1000000000),(3,200,'2026-02-22',1,1,2,NULL,1000000000),(4,200,'2026-03-05',1,1,2,NULL,1000000000),(5,300,'2026-03-18',1,1,3,NULL,1000000000),(6,180,'2026-03-14',2,2,1,NULL,1000000000),(7,170,'2026-03-21',2,2,1,NULL,1000000000),(8,250,'2026-04-01',2,2,2,NULL,1000000000),(9,200,'2026-04-05',2,2,3,NULL,1000000000),(10,380,'2025-09-10',3,3,1,NULL,1000000000),(11,580,'2025-10-01',3,3,2,NULL,1000000000),(12,790,'2025-10-25',3,3,3,NULL,1000000000),(13,490,'2025-11-15',3,3,4,NULL,1000000000);
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
  `id_unidad` int DEFAULT NULL,
  `id_usuario` bigint NOT NULL,
  `id_tipo_medicamento` int NOT NULL,
  PRIMARY KEY (`id_admin_medicamento`),
  KEY `FKovha5328873fbj5p6f86asyn6` (`id_ciclo`),
  KEY `FKtbg5y0bq6ilq4m8ghbbrhk9u1` (`id_galpon`),
  KEY `FK2e83ywe4hn4pm8fs9h6v1wqnv` (`id_unidad`),
  KEY `FKhsds2t2a0fwtw1399o3vvp0ha` (`id_usuario`),
  KEY `FKm4i3byep590gxctpxqtrxsrde` (`id_tipo_medicamento`),
  CONSTRAINT `FK2e83ywe4hn4pm8fs9h6v1wqnv` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`),
  CONSTRAINT `FKhsds2t2a0fwtw1399o3vvp0ha` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`cedula`),
  CONSTRAINT `FKm4i3byep590gxctpxqtrxsrde` FOREIGN KEY (`id_tipo_medicamento`) REFERENCES `tipo_medicamento` (`id_tipo_medicamento`),
  CONSTRAINT `FKovha5328873fbj5p6f86asyn6` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `FKtbg5y0bq6ilq4m8ghbbrhk9u1` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admi_medicamento`
--

LOCK TABLES `admi_medicamento` WRITE;
/*!40000 ALTER TABLE `admi_medicamento` DISABLE KEYS */;
INSERT INTO `admi_medicamento` VALUES (1,30,'2026-02-03',1,1,NULL,1000000000,1),(2,15,'2026-02-22',1,1,NULL,1000000000,2),(3,50,'2026-03-01',1,1,NULL,1000000000,3),(4,35,'2026-03-12',2,2,NULL,1000000000,1),(5,20,'2026-03-22',2,2,NULL,1000000000,2),(6,60,'2026-03-28',2,2,NULL,1000000000,3),(7,25,'2025-09-03',3,3,NULL,1000000000,1),(8,12,'2025-09-18',3,3,NULL,1000000000,2),(9,40,'2025-10-01',3,3,NULL,1000000000,3),(10,20,'2025-10-22',3,3,NULL,1000000000,4);
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
  `duracion` int DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `id_galpon` int DEFAULT NULL,
  `cantidad_pollos` int DEFAULT NULL,
  `valor_pollo` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id_ciclo`),
  KEY `FKfi8he898glcpipx0b0orcgne5` (`id_galpon`),
  CONSTRAINT `FKfi8he898glcpipx0b0orcgne5` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclo_produccion`
--

LOCK TABLES `ciclo_produccion` WRITE;
/*!40000 ALTER TABLE `ciclo_produccion` DISABLE KEYS */;
INSERT INTO `ciclo_produccion` VALUES (1,'Lote A-2026',NULL,NULL,'2026-02-01',NULL,1150,3800.00),(2,'Lote B-2026',NULL,NULL,'2026-03-10',NULL,1400,3800.00),(3,'Lote Z-2025',90,'2025-11-30','2025-09-01',NULL,950,3500.00);
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
  `capacidad` bigint NOT NULL,
  `metros_cuadrados` decimal(10,2) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id_galpon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galpon`
--

LOCK TABLES `galpon` WRITE;
/*!40000 ALTER TABLE `galpon` DISABLE KEYS */;
INSERT INTO `galpon` VALUES (1,1200,120.00,'Galpón El Porvenir'),(2,1500,150.00,'Galpón La Esperanza'),(3,1000,100.00,'Galpón San José');
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
  `nombre_ciclo` varchar(20) NOT NULL,
  PRIMARY KEY (`id_galpon_ciclo_produccion`),
  KEY `FKp5kdte2r1huy74gt4rs207oj5` (`id_ciclo`),
  KEY `FKrcxbvkl7a4bprx6mf0tmr7d44` (`id_galpon`),
  CONSTRAINT `FKp5kdte2r1huy74gt4rs207oj5` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `FKrcxbvkl7a4bprx6mf0tmr7d44` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `galpon_ciclo_produccion`
--

LOCK TABLES `galpon_ciclo_produccion` WRITE;
/*!40000 ALTER TABLE `galpon_ciclo_produccion` DISABLE KEYS */;
INSERT INTO `galpon_ciclo_produccion` VALUES (1,NULL,'2026-02-01',1,1,'Lote A-2026'),(2,NULL,'2026-03-10',2,2,'Lote B-2026'),(3,'2025-11-30','2025-09-01',3,3,'Lote Z-2025');
/*!40000 ALTER TABLE `galpon_ciclo_produccion` ENABLE KEYS */;
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
  `fecha_vencimiento` date DEFAULT NULL,
  `valor_total` decimal(10,2) DEFAULT NULL,
  `valor_unitario` decimal(10,2) DEFAULT NULL,
  `id_tipo_alimento` int DEFAULT NULL,
  `id_unidad` int DEFAULT NULL,
  PRIMARY KEY (`id_ing_alimento`),
  KEY `FKgh7b5yuiki3709yugsxmeodug` (`id_tipo_alimento`),
  KEY `FKkhrixy3s23u1p4026h15amb02` (`id_unidad`),
  CONSTRAINT `FKgh7b5yuiki3709yugsxmeodug` FOREIGN KEY (`id_tipo_alimento`) REFERENCES `tipo_alimento` (`id_tipo_alimento`),
  CONSTRAINT `FKkhrixy3s23u1p4026h15amb02` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ing_alimento`
--

LOCK TABLES `ing_alimento` WRITE;
/*!40000 ALTER TABLE `ing_alimento` DISABLE KEYS */;
INSERT INTO `ing_alimento` VALUES (1,500.00,'2026-02-03','2026-08-03',725000.00,1450.00,1,NULL),(2,800.00,'2026-02-18','2026-08-18',1104000.00,1380.00,2,NULL),(3,1200.00,'2026-03-12','2026-09-12',1584000.00,1320.00,3,NULL),(4,600.00,'2026-03-12','2026-09-12',870000.00,1450.00,1,NULL),(5,900.00,'2026-03-25','2026-09-25',1242000.00,1380.00,2,NULL),(6,1000.00,'2026-04-01','2026-10-01',1320000.00,1320.00,3,NULL),(7,400.00,'2025-09-03','2026-03-03',568000.00,1420.00,1,NULL),(8,600.00,'2025-09-18','2026-03-18',816000.00,1360.00,2,NULL),(9,800.00,'2025-10-08','2026-04-08',1040000.00,1300.00,3,NULL),(10,500.00,'2025-11-01','2026-05-01',640000.00,1280.00,4,NULL);
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
  `fecha_vencimiento` date DEFAULT NULL,
  `valor_total` decimal(30,2) DEFAULT NULL,
  `id_tipo_medicamento` int NOT NULL,
  `id_unidad` int DEFAULT NULL,
  PRIMARY KEY (`id_ing_medicamento`),
  KEY `FKpwv05mbkmar9xs6hn4gbw9g4` (`id_tipo_medicamento`),
  KEY `FKkdw7c4j17tmac91l9ar1gf455` (`id_unidad`),
  CONSTRAINT `FKkdw7c4j17tmac91l9ar1gf455` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`),
  CONSTRAINT `FKpwv05mbkmar9xs6hn4gbw9g4` FOREIGN KEY (`id_tipo_medicamento`) REFERENCES `tipo_medicamento` (`id_tipo_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ing_medicamento`
--

LOCK TABLES `ing_medicamento` WRITE;
/*!40000 ALTER TABLE `ing_medicamento` DISABLE KEYS */;
INSERT INTO `ing_medicamento` VALUES (1,100,'2026-01-10','2027-01-10',850000.00,1,NULL),(2,50,'2026-01-15','2026-07-15',600000.00,2,NULL),(3,200,'2026-02-01','2027-02-01',700000.00,3,NULL),(4,80,'2026-02-10','2026-08-10',760000.00,4,NULL);
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
  KEY `FK5mo5k30gbj4wyjeyd9i69sv8x` (`id_ciclo`),
  KEY `FKchoh2b7b3d0axgvnsnphc27gl` (`id_galpon`),
  KEY `FKs901hofs57j0dggqko9t0m5so` (`id_tipo_muerte`),
  CONSTRAINT `FK5mo5k30gbj4wyjeyd9i69sv8x` FOREIGN KEY (`id_ciclo`) REFERENCES `ciclo_produccion` (`id_ciclo`),
  CONSTRAINT `FKchoh2b7b3d0axgvnsnphc27gl` FOREIGN KEY (`id_galpon`) REFERENCES `galpon` (`id_galpon`),
  CONSTRAINT `FKs901hofs57j0dggqko9t0m5so` FOREIGN KEY (`id_tipo_muerte`) REFERENCES `tipo_muerte` (`id_tipo_muerte`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mortalidad`
--

LOCK TABLES `mortalidad` WRITE;
/*!40000 ALTER TABLE `mortalidad` DISABLE KEYS */;
INSERT INTO `mortalidad` VALUES (1,'Enfermedad','2026-02-08','5',1,1,1),(2,'Aplastamiento','2026-02-25','3',1,1,2),(3,'Calor','2026-03-12','4',1,1,3),(4,'Desconocida','2026-03-28','2',1,1,4),(5,'Enfermedad','2026-03-18','6',2,2,1),(6,'Aplastamiento','2026-03-30','2',2,2,2),(7,'Calor','2026-04-05','3',2,2,3),(8,'Enfermedad','2025-09-10','8',3,3,1),(9,'Desconocida','2025-09-28','4',3,3,4),(10,'Aplastamiento','2025-10-15','5',3,3,2),(11,'Calor','2025-11-05','3',3,3,3);
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
  KEY `FKeis1i5rydnrj4eru0xurtk1v` (`id_tipo_alimento`),
  KEY `FKmnhckv0opj73pwnadee7txwaf` (`id_unidad`),
  CONSTRAINT `FKeis1i5rydnrj4eru0xurtk1v` FOREIGN KEY (`id_tipo_alimento`) REFERENCES `tipo_alimento` (`id_tipo_alimento`),
  CONSTRAINT `FKmnhckv0opj73pwnadee7txwaf` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_alimento`
--

LOCK TABLES `stock_alimento` WRITE;
/*!40000 ALTER TABLE `stock_alimento` DISABLE KEYS */;
INSERT INTO `stock_alimento` VALUES (1,470,1,NULL),(2,1070,2,NULL),(3,1710,3,NULL),(4,10,4,NULL);
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
  `id_unidad` int DEFAULT NULL,
  PRIMARY KEY (`id_stock_medicamento`),
  KEY `FK169g5itap4h2axhnh0wvfm0ae` (`id_tipo_medicamento`),
  KEY `FKgkmn9cq4pljf95hv2ssgt2te3` (`id_unidad`),
  CONSTRAINT `FK169g5itap4h2axhnh0wvfm0ae` FOREIGN KEY (`id_tipo_medicamento`) REFERENCES `tipo_medicamento` (`id_tipo_medicamento`),
  CONSTRAINT `FKgkmn9cq4pljf95hv2ssgt2te3` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_medicamento`
--

LOCK TABLES `stock_medicamento` WRITE;
/*!40000 ALTER TABLE `stock_medicamento` DISABLE KEYS */;
INSERT INTO `stock_medicamento` VALUES (1,10.00,1,NULL),(2,3.00,2,NULL),(3,50.00,3,NULL),(4,60.00,4,NULL);
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
  `categoria` varchar(20) DEFAULT NULL,
  `nombre_alimento` varchar(30) NOT NULL,
  PRIMARY KEY (`id_tipo_alimento`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_alimento`
--

LOCK TABLES `tipo_alimento` WRITE;
/*!40000 ALTER TABLE `tipo_alimento` DISABLE KEYS */;
INSERT INTO `tipo_alimento` VALUES (1,'Preiniciador de alta densidad nutricional, pollitos 1-7 días','preiniciador','Contegral Pre-Inicio 500'),(2,'Iniciador con aminoácidos balanceados, pollos 8-21 días','iniciador','Contegral Inicio Plus'),(3,'Concentrado de engorde para máxima ganancia de peso, días 22-35','engorde','Solla Engorde Total'),(4,'Finalización sin promotores de crecimiento, días 36-45','finalización','Italcol Finalización Pro');
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
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `condiciones_almacenamiento` varchar(200) DEFAULT NULL,
  `periodo_retiro` int DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_medicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_medicamento`
--

LOCK TABLES `tipo_medicamento` WRITE;
/*!40000 ALTER TABLE `tipo_medicamento` DISABLE KEYS */;
INSERT INTO `tipo_medicamento` VALUES (1,'Vacuna viva liofilizada contra enfermedad de Newcastle','Vacuna Newcastle B1','vacuna','Refrigerar entre 2°C y 8°C',0,'dosis'),(2,'Antibiótico de amplio espectro para infecciones respiratorias','Enrofloxacina 10%','antibiótico','Conservar en lugar fresco y seco',7,'ml'),(3,'Complejo vitamínico y electrolitos para estrés y recuperación','Vitaplex AD3E + K','vitamínico','Conservar en lugar fresco',0,'g'),(4,'Antiparasitario interno de amplio espectro','Albendazol 10%','desparasitante','Conservar en lugar fresco y seco',14,'ml');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_muerte`
--

LOCK TABLES `tipo_muerte` WRITE;
/*!40000 ALTER TABLE `tipo_muerte` DISABLE KEYS */;
INSERT INTO `tipo_muerte` VALUES (1,'Bajas por enfermedades del sistema respiratorio','Enfermedad respiratoria'),(2,'Pollos aplastados por aglomeración en el galpón','Aplastamiento'),(3,'Mortalidad causada por altas temperaturas','Golpe de calor'),(4,'Muerte sin diagnóstico determinado','Causa desconocida');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidad_medida`
--

LOCK TABLES `unidad_medida` WRITE;
/*!40000 ALTER TABLE `unidad_medida` DISABLE KEYS */;
INSERT INTO `unidad_medida` VALUES (1,'kg'),(2,'g'),(3,'L'),(4,'mL'),(5,'Dosis'),(6,'Frasco');
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
  `reset_token` varchar(6) DEFAULT NULL,
  `reset_token_expiry` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1000000000,'Sayfer','admin@sayfer.com',1,'2026-04-05','Admin','admin123','admin',NULL,NULL),(2000000000,'Sayfer','Angelsantiagomaldonado7@gmail.com',1,'2026-04-05','Trabajador','nuevaclave123','operador',NULL,NULL);
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

-- Dump completed on 2026-04-07  5:05:30
