-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Янв 12 2021 г., 21:02
-- Версия сервера: 10.4.14-MariaDB
-- Версия PHP: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `social_network`
--

-- --------------------------------------------------------

--
-- Структура таблицы `background`
--

CREATE TABLE `background` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `background_path` varchar(45) DEFAULT NULL,
  `active` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `background`
--

INSERT INTO `background` (`ID`, `user_id`, `background_path`, `active`) VALUES
(7, 3, '', '0'),
(8, 3, '1610404736573217', '1'),
(9, 4, '', '0'),
(10, 4, '1610404921600208', '1'),
(11, 5, '', '0'),
(12, 5, '1610407001440583', '0'),
(13, 5, '1610407236551307', '0'),
(14, 5, '1610409189694339', '1'),
(15, 6, '', '1'),
(16, 7, '', '1');

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `ID` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment` varchar(1000) DEFAULT NULL,
  `time` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `comments`
--

INSERT INTO `comments` (`ID`, `post_id`, `user_id`, `comment`, `time`) VALUES
(10, 10, 4, '123', '2021-01-11 23:01:37'),
(11, 10, 3, '1234', '2021-01-11 23:01:43'),
(12, 12, 4, 'коммент от чужого акка', '2021-01-11 23:43:10'),
(13, 12, 5, 'Коммент от мего акк', '2021-01-11 23:43:22'),
(14, 11, 4, 'второй комментарий из чужого акка', '2021-01-11 23:43:47'),
(15, 12, 5, '123123', '2021-01-11 23:44:29'),
(16, 10, 4, '999999999999999', '2021-01-11 23:44:46');

-- --------------------------------------------------------

--
-- Структура таблицы `friends`
--

CREATE TABLE `friends` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `friend_id` int(11) DEFAULT NULL,
  `active` varchar(255) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `friends`
--

INSERT INTO `friends` (`ID`, `user_id`, `friend_id`, `active`) VALUES
(2, 4, 3, '1'),
(4, 4, 5, '1');

-- --------------------------------------------------------

--
-- Структура таблицы `interests`
--

CREATE TABLE `interests` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `interest` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `interests`
--

INSERT INTO `interests` (`ID`, `user_id`, `interest`) VALUES
(9, 5, 'Я'),
(10, 5, 'люблю'),
(11, 5, 'свою'),
(12, 5, 'чудесную'),
(13, 5, 'Маньюсетьку'),
(14, 5, 'Фотографирование'),
(15, 5, 'танцы'),
(16, 5, 'бег');

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE `messages` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `time` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `messages`
--

INSERT INTO `messages` (`ID`, `user_id`, `receiver_id`, `message`, `time`) VALUES
(12, 3, 4, 'adas<br/>\r\n', '2021-01-11 22:50:43'),
(13, 4, 3, 'asdfasdf<br/>\r\n', '2021-01-11 22:50:46'),
(14, 3, 4, 'xxxxx', '2021-01-11 22:50:59'),
(15, 3, 4, '515153<br/>\r\n', '2021-01-11 22:51:39'),
(16, 5, 4, 'Привет мой старый друг<br/>\r\n', '2021-01-11 23:28:48'),
(17, 4, 5, 'Приветики <br/>\r\n', '2021-01-11 23:28:57'),
(18, 4, 5, 'куда ты пропал далбаеб<br/>\r\n', '2021-01-11 23:29:06'),
(19, 5, 4, 'сам ты далбаеб<br/>\r\n', '2021-01-11 23:29:15'),
(20, 4, 5, 'нет ты<br/>\r\n', '2021-01-11 23:29:20'),
(21, 4, 5, 'фыварфыоварфывафыва', '2021-01-11 23:35:29'),
(22, 5, 4, '123<br/>\r\n', '2021-01-11 23:35:42'),
(23, 4, 5, 'фыварфыоварфывафыва', '2021-01-11 23:35:54'),
(24, 4, 5, 'фыварфыоварфывафыва<br/>\r\n', '2021-01-11 23:35:56'),
(25, 5, 4, 'фыва<br/>\r\n', '2021-01-11 23:36:16'),
(26, 5, 4, 'фывафыавфыв<br/>\r\n', '2021-01-11 23:37:01'),
(27, 4, 5, '123<br/>\r\n', '2021-01-11 23:37:07'),
(28, 5, 4, '545646546<br/>\r\n', '2021-01-11 23:48:55'),
(29, 5, 4, '1564564<br/>\r\n', '2021-01-11 23:49:33'),
(30, 4, 5, '12211<br/>\r\n', '2021-01-11 23:49:37'),
(31, 5, 4, 'Hello<br/>\r\n', '2021-01-11 23:50:10'),
(32, 4, 5, 'asdfasdf<br/>\r\n', '2021-01-11 23:50:26'),
(33, 5, 4, 'asdfasdfasdf<br/>\r\n', '2021-01-11 23:52:35');

-- --------------------------------------------------------

--
-- Структура таблицы `photos`
--

CREATE TABLE `photos` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `active` varchar(255) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `photos`
--

INSERT INTO `photos` (`ID`, `user_id`, `photo_path`, `active`) VALUES
(12, 3, 'anonymous', '0'),
(15, 3, '1610404680492749', '0'),
(16, 3, '1610404680645905', '0'),
(17, 3, '1610404681412608', '1'),
(18, 4, 'anonymous', '0'),
(19, 4, '1610404893787406', '1'),
(20, 5, 'anonymous', '0'),
(22, 5, '1610407032532358', '0'),
(23, 5, '1610407032776681', '0'),
(24, 5, '1610407045531780', '0'),
(25, 5, '1610407045625555', '0'),
(26, 5, '161040704568699', '0'),
(27, 5, '1610407046551022', '0'),
(28, 5, '1610407046777764', '0'),
(29, 5, '1610407046919643', '0'),
(30, 5, '1610407046381370', '0'),
(31, 5, '1610407046285714', '0'),
(32, 5, '1610407046117561', '0'),
(33, 5, '1610407046125498', '0'),
(34, 5, '1610407046101324', '0'),
(35, 5, '1610407046348058', '0'),
(36, 5, '1610407046214724', '0'),
(37, 5, '1610407047289393', '0'),
(38, 5, '1610407047276087', '0'),
(39, 5, '1610409199532206', '1'),
(40, 6, 'anonymous', '1'),
(41, 7, 'anonymous', '1');

-- --------------------------------------------------------

--
-- Структура таблицы `posts`
--

CREATE TABLE `posts` (
  `ID` int(11) NOT NULL,
  `post_description` varchar(10000) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `time` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `posts`
--

INSERT INTO `posts` (`ID`, `post_description`, `user_id`, `time`, `picture`) VALUES
(10, 'asdfasdfasd', 4, '2021-01-11 22:58:53', '1610405933611620'),
(11, 'Здрасте моя любимая Мария', 5, '2021-01-11 23:39:08', NULL),
(12, 'феыапфгынпаофванрфжывдалдфывафывафывафывафывавфвфывафывафыва', 5, '2021-01-11 23:40:52', '1610408452661911'),
(13, 'SADFASDFasdf', 5, '2021-01-11 23:53:38', '1610409218283433');

-- --------------------------------------------------------

--
-- Структура таблицы `post_dislikes`
--

CREATE TABLE `post_dislikes` (
  `ID` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `post_dislikes`
--

INSERT INTO `post_dislikes` (`ID`, `post_id`, `user_id`) VALUES
(12, 10, 5),
(14, 12, 5);

-- --------------------------------------------------------

--
-- Структура таблицы `post_likes`
--

CREATE TABLE `post_likes` (
  `ID` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

--
-- Дамп данных таблицы `post_likes`
--

INSERT INTO `post_likes` (`ID`, `post_id`, `user_id`) VALUES
(13, 10, 3),
(14, 10, 4),
(15, 11, 4),
(17, 12, 4),
(18, 10, 5);

-- --------------------------------------------------------

--
-- Структура таблицы `requests`
--

CREATE TABLE `requests` (
  `ID` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `friend_id` int(11) DEFAULT NULL,
  `active` varchar(255) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `session` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `about` varchar(10000) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `day` varchar(255) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `settingsCheck` int(1) DEFAULT 0,
  `online` int(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`ID`, `name`, `surname`, `email`, `password`, `session`, `city`, `country`, `phone`, `about`, `gender`, `day`, `month`, `year`, `settingsCheck`, `online`) VALUES
(3, 'TestUser1', 'Surname', 'qwerty@mail.com', '$2y$11$RK.g6QIUGVTQTY1QNGBoLOhQvAR7hx4oTF7lII9H/EvQFpJCyApG.', '', 'erevab', 'BOL', '999999999', 'asdfasdfasdfasdfasdf', 'male', '2', 'Mar', '1989', 1, 0),
(4, 'Tewrqwer', 'qwerqwer', 'admin@example.com', '$2y$11$qCiHRWKgCd/qAndHjo0Jqev6ryO7IJ/XAsyUFWHR1wZrrBxctOOJi', '', 'asdfasdf', 'AND', '999999999', 'asdfasdfasdfasdfasdfasdfsadfsadfsadf', 'male', '4', 'Feb', '1989', 1, 0),
(5, 'asdfasdf', 'qweqdqwdqw', 'qwerty@mail.ru', '$2y$11$3OzRiWSnXf8NmiJp6WJsie8V2QTpheSIinsGop6lerr.vnm5KOlV2', '1610406874658891', 'Mogilyov', 'BLR', '216515615', 'asdfasdfasdfasdfasdfasdfasdfadsfasdfads', 'male', '4', 'Mar', '1991', 1, 1),
(6, 'admin', 'asdfasdf', 'ovsepanrik@gmail.com', '$2y$11$EAoRHFqmpN1tjIzbiDQhcOKz0Ax3MpImdZGIWnD6l78mDNwynG21S', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0),
(7, 'mogfil', 'asdfasdf', 'superadminuser@example.com', '$2y$11$8OwI7TFudmPs4AOsaj8/HOytuXdWBRLFMR53giaNVKDYTsNPNUQEi', '', 'asdfasd', 'AIA', '098077928', '', 'male', '1', 'Apr', '1991', 1, 0);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `background`
--
ALTER TABLE `background`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `user_id_idx` (`user_id`) USING BTREE;

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `post_id` (`post_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Индексы таблицы `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE,
  ADD KEY `friend_id` (`friend_id`) USING BTREE;

--
-- Индексы таблицы `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Индексы таблицы `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE,
  ADD KEY `receiver_id` (`receiver_id`) USING BTREE;

--
-- Индексы таблицы `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Индексы таблицы `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Индексы таблицы `post_dislikes`
--
ALTER TABLE `post_dislikes`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `post_id` (`post_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Индексы таблицы `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `post_id` (`post_id`) USING BTREE,
  ADD KEY `user_id` (`user_id`) USING BTREE;

--
-- Индексы таблицы `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`ID`) USING BTREE,
  ADD KEY `friend_id` (`friend_id`) USING BTREE;

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `background`
--
ALTER TABLE `background`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `comments`
--
ALTER TABLE `comments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `friends`
--
ALTER TABLE `friends`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `interests`
--
ALTER TABLE `interests`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT для таблицы `photos`
--
ALTER TABLE `photos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT для таблицы `posts`
--
ALTER TABLE `posts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `post_dislikes`
--
ALTER TABLE `post_dislikes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT для таблицы `requests`
--
ALTER TABLE `requests`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `background`
--
ALTER TABLE `background`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Ограничения внешнего ключа таблицы `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `interests`
--
ALTER TABLE `interests`
  ADD CONSTRAINT `interests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `post_dislikes`
--
ALTER TABLE `post_dislikes`
  ADD CONSTRAINT `post_dislikes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_dislikes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`friend_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
