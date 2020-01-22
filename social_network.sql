/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100138
 Source Host           : 127.0.0.1:3306
 Source Schema         : social_network

 Target Server Type    : MySQL
 Target Server Version : 100138
 File Encoding         : 65001

 Date: 23/01/2020 00:36:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for background
-- ----------------------------
DROP TABLE IF EXISTS `background`;
CREATE TABLE `background`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `background_path` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `active` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `user_id_idx`(`user_id`) USING BTREE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of background
-- ----------------------------
INSERT INTO `background` VALUES (12, 29, '', '0');
INSERT INTO `background` VALUES (13, 29, '1579713520899685', '1');

-- ----------------------------
-- Table structure for photos
-- ----------------------------
DROP TABLE IF EXISTS `photos`;
CREATE TABLE `photos`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL,
  `photo_path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `active` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0',
  PRIMARY KEY (`ID`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 95 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of photos
-- ----------------------------
INSERT INTO `photos` VALUES (31, 29, 'anonymous', '0');
INSERT INTO `photos` VALUES (32, 29, '157971341674681', '1');
INSERT INTO `photos` VALUES (33, 29, '1579713468116352', '0');
INSERT INTO `photos` VALUES (34, 29, '1579713469466580', '0');
INSERT INTO `photos` VALUES (35, 29, '1579713469894836', '0');
INSERT INTO `photos` VALUES (36, 29, '1579713469453793', '0');
INSERT INTO `photos` VALUES (37, 29, '1579713469252872', '0');
INSERT INTO `photos` VALUES (38, 29, '1579713469510261', '0');
INSERT INTO `photos` VALUES (39, 29, '1579713469738122', '0');
INSERT INTO `photos` VALUES (40, 29, '1579714677459585', '0');
INSERT INTO `photos` VALUES (41, 29, '157971467859779', '0');
INSERT INTO `photos` VALUES (42, 29, '1579714678137997', '0');
INSERT INTO `photos` VALUES (43, 29, '1579714678270908', '0');
INSERT INTO `photos` VALUES (44, 29, '1579714743158190', '0');
INSERT INTO `photos` VALUES (45, 29, '1579714743671551', '0');
INSERT INTO `photos` VALUES (46, 29, '1579714743146160', '0');
INSERT INTO `photos` VALUES (47, 29, '1579714795236423', '0');
INSERT INTO `photos` VALUES (48, 29, '1579714795722562', '0');
INSERT INTO `photos` VALUES (49, 29, '1579714796961522', '0');
INSERT INTO `photos` VALUES (50, 29, '1579714897699128', '0');
INSERT INTO `photos` VALUES (51, 29, '1579714897311669', '0');
INSERT INTO `photos` VALUES (52, 29, '157971489787489', '0');
INSERT INTO `photos` VALUES (53, 29, '1579714944482173', '0');
INSERT INTO `photos` VALUES (54, 29, '1579714944399348', '0');
INSERT INTO `photos` VALUES (55, 29, '157971494497092', '0');
INSERT INTO `photos` VALUES (56, 29, '1579714984182763', '0');
INSERT INTO `photos` VALUES (57, 29, '157971498477761', '0');
INSERT INTO `photos` VALUES (58, 29, '157971498432635', '0');
INSERT INTO `photos` VALUES (59, 29, '1579715131904717', '0');
INSERT INTO `photos` VALUES (60, 29, '1579715131792064', '0');
INSERT INTO `photos` VALUES (61, 29, '1579715131305208', '0');
INSERT INTO `photos` VALUES (62, 29, '1579715262534335', '0');
INSERT INTO `photos` VALUES (63, 29, '157971526293280', '0');
INSERT INTO `photos` VALUES (64, 29, '1579715262536888', '0');
INSERT INTO `photos` VALUES (65, 29, '1579715317843407', '0');
INSERT INTO `photos` VALUES (66, 29, '1579715317888564', '0');
INSERT INTO `photos` VALUES (67, 29, '1579715317949912', '0');
INSERT INTO `photos` VALUES (68, 29, '157971543598541', '0');
INSERT INTO `photos` VALUES (69, 29, '1579715435408549', '0');
INSERT INTO `photos` VALUES (70, 29, '1579715435491492', '0');
INSERT INTO `photos` VALUES (71, 29, '1579715538682555', '0');
INSERT INTO `photos` VALUES (72, 29, '1579715538160659', '0');
INSERT INTO `photos` VALUES (73, 29, '1579715538421290', '0');
INSERT INTO `photos` VALUES (74, 29, '1579715538237374', '0');
INSERT INTO `photos` VALUES (75, 29, '1579715538598230', '0');
INSERT INTO `photos` VALUES (76, 29, '1579715538412386', '0');
INSERT INTO `photos` VALUES (77, 29, '1579715539823418', '0');
INSERT INTO `photos` VALUES (78, 29, '157971553939940', '0');
INSERT INTO `photos` VALUES (79, 29, '1579715539128450', '0');
INSERT INTO `photos` VALUES (80, 29, '157971555153675', '0');
INSERT INTO `photos` VALUES (81, 29, '1579715551399618', '0');
INSERT INTO `photos` VALUES (82, 29, '157971555156135', '0');
INSERT INTO `photos` VALUES (83, 29, '1579715582526948', '0');
INSERT INTO `photos` VALUES (84, 29, '1579715582526332', '0');
INSERT INTO `photos` VALUES (85, 29, '1579715582942014', '0');
INSERT INTO `photos` VALUES (86, 29, '1579715612927208', '0');
INSERT INTO `photos` VALUES (87, 29, '1579715612621984', '0');
INSERT INTO `photos` VALUES (88, 29, '157971561269078', '0');
INSERT INTO `photos` VALUES (89, 29, '157971600194969', '0');
INSERT INTO `photos` VALUES (90, 29, '1579716001822058', '0');
INSERT INTO `photos` VALUES (91, 29, '1579716001425495', '0');
INSERT INTO `photos` VALUES (92, 29, '1579716062725591', '0');
INSERT INTO `photos` VALUES (93, 29, '1579716062395579', '0');
INSERT INTO `photos` VALUES (94, 29, '1579716062232791', '0');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `surname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `age` int(11) NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `session` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `about` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (29, 'Erik', 'Hovsepyan', 21, 'hovsepyan@mail.ru', '$2y$11$zyDmVUZSSBQtVKODrluoueghHTD193yYQ5uCcrzaH/cS2FxkMlBnW', '1579713360709842', NULL, NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
