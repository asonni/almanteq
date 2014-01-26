SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `almanteq` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `almanteq` ;

-- -----------------------------------------------------
-- Table `almanteq`.`package`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `almanteq`.`package` (
  `idpackage` INT NOT NULL AUTO_INCREMENT ,
  `packageno` VARCHAR(45) NOT NULL ,
  `date` DATE NOT NULL ,
  `resource` VARCHAR(45) NULL ,
  `type` VARCHAR(45) NULL ,
  PRIMARY KEY (`idpackage`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `almanteq`.`offer`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `almanteq`.`offer` (
  `idoffer` INT NOT NULL AUTO_INCREMENT ,
  `offern` VARCHAR(150) NULL ,
  `sapordern` VARCHAR(150) NULL ,
  `ordern` VARCHAR(150) NULL ,
  `date` DATE NULL ,
  `producv` VARCHAR(150) NULL ,
  `note` TEXT NULL ,
  PRIMARY KEY (`idoffer`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `almanteq`.`system`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `almanteq`.`system` (
  `iditem` INT NOT NULL AUTO_INCREMENT ,
  `system` VARCHAR(150) NULL ,
  `barcode` VARCHAR(250) NULL ,
  `currency` VARCHAR(45) NULL ,
  `itemprice` DOUBLE NULL ,
  `quantity` INT NULL ,
  `totalprice` DOUBLE NULL ,
  `offer_idoffer` INT NOT NULL ,
  PRIMARY KEY (`iditem`, `offer_idoffer`) ,
  INDEX `fk_system_offer1` (`offer_idoffer` ASC) ,
  CONSTRAINT `fk_system_offer1`
    FOREIGN KEY (`offer_idoffer` )
    REFERENCES `almanteq`.`offer` (`idoffer` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `almanteq`.`specs`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `almanteq`.`specs` (
  `idspecs` INT NOT NULL AUTO_INCREMENT ,
  `system_iditem` INT NOT NULL ,
  `productn` VARCHAR(150) NULL ,
  `name` TEXT NULL ,
  `quantity` INT NULL ,
  PRIMARY KEY (`idspecs`, `system_iditem`) ,
  INDEX `fk_specs_system` (`system_iditem` ASC) ,
  CONSTRAINT `fk_specs_system`
    FOREIGN KEY (`system_iditem` )
    REFERENCES `almanteq`.`system` (`iditem` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
