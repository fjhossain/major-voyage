-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema csi_4999projectset
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema csi_4999projectset
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `csi_4999projectset` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `csi_4999projectset` ;

-- -----------------------------------------------------
-- Table `csi_4999projectset`.`degree`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csi_4999projectset`.`degree` ;

CREATE TABLE IF NOT EXISTS `csi_4999projectset`.`degree` (
  `DEGREE_NO` INT NOT NULL AUTO_INCREMENT,
  `PERSONA_1_PREF` TINYINT NULL DEFAULT NULL,
  `PERSONA_2_PREF` TINYINT NULL DEFAULT NULL,
  `PERSONA_3_PREF` TINYINT NULL DEFAULT NULL,
  `PERSONA_4_PREF` TINYINT NULL DEFAULT NULL,
  `DEGREE_NAME` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`DEGREE_NO`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csi_4999projectset`.`students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csi_4999projectset`.`students` ;

CREATE TABLE IF NOT EXISTS `csi_4999projectset`.`students` (
  `STUDENT_NO` INT NOT NULL AUTO_INCREMENT,
  `STUDENT_EMAIL` VARCHAR(50) NOT NULL,
  `STUDENT_USERNAME` VARCHAR(45) NOT NULL DEFAULT 'John Doe',
  `PASSWORD_ENCRYPT` VARCHAR(10000) NOT NULL,
  `PERSONA_TEST_1` TINYINT NULL DEFAULT NULL,
  `PERSONA_TEST_2` TINYINT NULL DEFAULT NULL,
  `PERSONA_TEST_3` TINYINT NULL DEFAULT NULL,
  `PERSONA_TEST_4` TINYINT NULL DEFAULT NULL,
  `STUDENT_CREATION_TIME` DATETIME NOT NULL,
  `DEGREE_LINK_NO` VARCHAR(450) NULL DEFAULT NULL,
  PRIMARY KEY (`STUDENT_NO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `STUDENT_NO_UNIQUE` ON `csi_4999projectset`.`students` (`STUDENT_NO` ASC) VISIBLE;

CREATE UNIQUE INDEX `STUDENT_EMAIL_UNIQUE` ON `csi_4999projectset`.`students` (`STUDENT_EMAIL` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `csi_4999projectset`.`carrerscores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csi_4999projectset`.`carrerscores` ;

CREATE TABLE IF NOT EXISTS `csi_4999projectset`.`carrerscores` (
  `SCORE_SET_NO` INT NOT NULL,
  `SCORE_PERCENT` DECIMAL(3,0) NULL DEFAULT NULL,
  `degree_DEGREE_NO` INT NOT NULL,
  `students_STUDENT_NO` INT NOT NULL,
  PRIMARY KEY (`SCORE_SET_NO`),
  CONSTRAINT `fk_CarrerScores_degree`
    FOREIGN KEY (`degree_DEGREE_NO`)
    REFERENCES `csi_4999projectset`.`degree` (`DEGREE_NO`),
  CONSTRAINT `fk_CarrerScores_students1`
    FOREIGN KEY (`students_STUDENT_NO`)
    REFERENCES `csi_4999projectset`.`students` (`STUDENT_NO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_CarrerScores_degree_idx` ON `csi_4999projectset`.`carrerscores` (`degree_DEGREE_NO` ASC) VISIBLE;

CREATE INDEX `fk_CarrerScores_students1_idx` ON `csi_4999projectset`.`carrerscores` (`students_STUDENT_NO` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
