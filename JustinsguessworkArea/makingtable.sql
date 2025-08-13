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
DROP SCHEMA IF EXISTS `csi_4999projectset` ;

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
AUTO_INCREMENT = 7
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
  `DEGREE_LINK_NO` INT NOT NULL DEFAULT '0',
  PRIMARY KEY (`STUDENT_NO`),
  UNIQUE INDEX `STUDENT_NO_UNIQUE` (`STUDENT_NO` ASC) VISIBLE,
  UNIQUE INDEX `STUDENT_EMAIL_UNIQUE` (`STUDENT_EMAIL` ASC) VISIBLE,
  INDEX `fk_students_degree1_idx` (`DEGREE_LINK_NO` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `csi_4999projectset`.`carrerscores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `csi_4999projectset`.`carrerscores` ;

CREATE TABLE IF NOT EXISTS `csi_4999projectset`.`carrerscores` (
  `SCORE_SET_NO` INT NOT NULL AUTO_INCREMENT,
  `SCORE_PERCENT` DECIMAL(3,0) NULL DEFAULT NULL,
  `degree_DEGREE_NO` INT NOT NULL,
  `students_STUDENT_NO` INT NOT NULL,
  PRIMARY KEY (`SCORE_SET_NO`),
  UNIQUE INDEX `degree_DEGREE_NO_UNIQUE` (`degree_DEGREE_NO` ASC) VISIBLE,
  UNIQUE INDEX `students_STUDENT_NO_UNIQUE` (`students_STUDENT_NO` ASC) VISIBLE,
  INDEX `fk_CarrerScores_degree_idx` (`degree_DEGREE_NO` ASC) VISIBLE,
  INDEX `fk_CarrerScores_students1_idx` (`students_STUDENT_NO` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `csi_4999projectset`.`degree`
-- -----------------------------------------------------
START TRANSACTION;
USE `csi_4999projectset`;
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEGREE_NO, PERSONA_1_PREF, PERSONA_2_PREF, PERSONA_3_PREF, PERSONA_4_PREF, 'DEGREE_NAME');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (1, 0, 0, 1, 1, 'Performing Arts');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (2, 0, 0, 0, 1, 'Business Administration');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (3, 0, 0, 0, 1, 'Sports Management');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (4, 0, 0, 1, 1, 'Hospitality Management');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (5, NULL, NULL, 0, NULL, 'Undecided');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (6, 1, 0, 0, 1, 'Information_technology');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 0, 0, 0, 'Accounting');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 0, 0, 0, 'Criminal Justice');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 0, 1, 0, 'Nursing');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 0, 1, 0, 'Social Work');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 1, 0, 'Psychology');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 1, 0, 'Education');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 0, 0, 'Engineering');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 0, 0, 'Data Science');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 0, 0, 1, 'Mechanical Engineering');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 0, 1, 1, 'Graphic Design');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 0, 1, 1, 'Interior Design');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 1, 1, 'Creative Writing');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 1, 1, 'Human Services');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 0, 1, 'Computer Science');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 1, 1, 0, 1, 'Philosophy');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 1, 1, 'Marketing');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 1, 1, 'Journalism');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 0, 1, 'Entrepreneurship');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 0, 1, 'Political Science');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 0, 0, 0, 'Management');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 0, 0, 0, 'Public Administration');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 0, 1, 0, 'Nursing');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 0, 1, 0, 'Elementary Education');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 1, 0, 'Counseling');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 1, 0, 'Communications');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 0, 0, 'Law');
INSERT INTO `csi_4999projectset`.`degree` (`DEGREE_NO`, `PERSONA_1_PREF`, `PERSONA_2_PREF`, `PERSONA_3_PREF`, `PERSONA_4_PREF`, `DEGREE_NAME`) VALUES (DEFAULT, 0, 1, 0, 0, 'Finance');

COMMIT;

