<?php
require_once '../jevix/jevix.class.php';
session_start();
    class userProfileInfo{
        private $db;
        private $jevix;

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");
            
            $this -> jevix = new Jevix();
            // Устанавливаем разрешённые теги. (Все не разрешенные теги считаются запрещенными.)
            $this -> jevix->cfgAllowTags(array('strong', 'ul', 'li', 'h1', 'h2'));
            
            // Устанавливаем разрешённые параметры тегов.
            // $this -> jevix->cfgAllowTagParams('a', array('title', 'href'));
            
            // Устанавливаем параметры тегов являющиеся обязяательными. Без них вырезает тег оставляя содержимое.
            // $this -> jevix->cfgSetTagParamsRequired('a', 'href');
            
            // Устанавливаем теги которые может содержать тег контейнер
            $this -> jevix->cfgSetTagChilds('ul', 'li', true, false);
            
            // Устанавливаем атрибуты тегов, которые будут добавлятся автоматически
            // $this -> jevix->cfgSetTagParamsAutoAdd('a', array('rel' => 'nofollow'));

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'u_info':
                        $this->u_getinfo();
                    break;
                    case 'fr_info':
                        $this->fr_getinfo();
                    break;
                    case 'new_post':
                        // var_dump($_POST);
                        $this->new_post();
                    break;
                    case 'snd_comment':
                        $this->post_comment();
                    break;
                    case 'p_like':
                        $this->post_like();
                    break;
                    case 'p_dislike':
                        $this->post_dislike();
                    break;
                }
            }
        }

        function u_getinfo(){
            $u_session = $_SESSION['u_session'];
            // echo $u_session;
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $u_info = $this->db->query("SELECT
                                            user.NAME AS u_name,
                                            user.surname AS u_surname,
                                            user.email AS u_email,
                                            user.gender AS u_gender,
                                            user.city AS u_city,
                                            user.country AS u_country,
                                            user.phone AS u_phone,
                                            user.about AS u_about,
                                            user.session AS u_session,
                                            user.day AS birth_day,
                                            user.month AS birth_month,
                                            user.year AS birth_year,
                                            user.id AS userId,
                                            photos.photo_path,
                                            back.background_path
                                        FROM
                                            photos
                                        INNER JOIN users user ON user.ID = photos.user_id
                                        INNER JOIN background back ON user.ID = back.user_id
                                        WHERE
                                            session = $u_session
                                            AND photos.active = 1
                                            AND back.active = 1")->fetch_all(true);
            $u_photos = $this->db->query("SELECT photo_path FROM photos WHERE user_id = (SELECT ID FROM users WHERE session = $u_session)")->fetch_all(true);
            $u_requests = $this->db->query("SELECT 
                                                users.name,
                                                users.surname,
                                                users.email,
                                                photos.photo_path,
                                                users.ID
                                            FROM
                                                users
                                                INNER JOIN photos ON photos.user_id = users.ID
                                            WHERE
                                                photos.active = 1
                                                AND
                                                users.ID IN ( SELECT user_id FROM requests WHERE friend_id = '$id' )")->fetch_all(true);
            $u_friends = $this->db->query("SELECT
                                                users.name,
                                                users.surname,
                                                users.email,
                                                photos.photo_path,
                                                users.ID,
                                                users.online
                                            FROM
                                                users
                                            INNER JOIN photos ON photos.user_id = users.ID
                                            WHERE
                                                users.ID IN (
                                                    SELECT
                                                        user_id
                                                    FROM
                                                        friends
                                                    WHERE
                                                        friend_id = '$id'
                                                    UNION
                                                        SELECT
                                                            friend_id
                                                        FROM
                                                            friends
                                                        WHERE
                                                            user_id = '$id'
                                                )
                                            AND photos.active = 1")->fetch_all(true);
            $u_info['u_photos'] = $u_photos;
            $u_info["u_requests"] = $u_requests;
            $u_info["u_friends"] = $u_friends;
            $u_info = json_encode($u_info);
            print $u_info;
        }

        function fr_getinfo(){
            $fr_email = $_SESSION['fr_email'];
            $u_session = $_SESSION['u_session'];
            // echo $u_session;
            // echo($fr_email);
            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
            
            $fr_id = $this -> db -> query("SELECT ID FROM users WHERE email = '$fr_email'")->fetch_all(true);
            $fr_id = $fr_id[0]["ID"];
            $fr_info = $this->db->query("SELECT
                                            user.NAME AS u_name,
                                            user.surname AS u_surname,
                                            user.email AS u_email,
                                            user.gender AS u_gender,
                                            user.city AS u_city,
                                            user.country AS u_country,
                                            user.phone AS u_phone,
                                            user.about AS u_about,
                                            user.day AS birth_day,
                                            user.month AS birth_month,
                                            user.year AS birth_year,
                                            photos.photo_path,
                                            back.background_path
                                        FROM
                                            photos
                                        INNER JOIN users user ON user.ID = photos.user_id
                                        INNER JOIN background back ON user.ID = back.user_id
                                        WHERE
                                            email = '$fr_email'
                                            AND photos.active = 1
                                            AND back.active = 1")->fetch_all(true);
            $req_active = $this -> db -> query("SELECT active FROM requests WHERE user_id = '$u_id' AND friend_id = '$fr_id' OR user_id = '$fr_id' AND friend_id = '$u_id'")->fetch_all(true);
            $check_friend = $this -> db -> query("SELECT active FROM friends WHERE user_id = '$u_id' AND friend_id = '$fr_id' UNION SELECT active FROM friends WHERE user_id = '$fr_id' AND friend_id = '$u_id'")->fetch_all(true);
            $fr_photos = $this->db->query("SELECT photo_path FROM photos WHERE user_id = (SELECT ID FROM users WHERE email = '$fr_email')")->fetch_all(true);
            $fr_friends = $this->db->query("SELECT
                                            users.name,
                                            users.surname,
                                            users.email,
                                            photos.photo_path,
                                            users.ID
                                        FROM
                                            users
                                        INNER JOIN photos ON photos.user_id = users.ID
                                        WHERE
                                            users.ID IN (
                                                SELECT
                                                    user_id
                                                FROM
                                                    friends
                                                WHERE
                                                    friend_id = $fr_id 
                                                    AND
                                                    user_id <> $u_id
                                                UNION
                                                    SELECT
                                                        friend_id
                                                    FROM
                                                        friends
                                                    WHERE
                                                        user_id = $fr_id 
                                                        AND
                                                        friend_id <> $u_id
                                            )
                                        AND photos.active = 1 ")->fetch_all(true);
            $fr_info['fr_photos'] = $fr_photos;
            $fr_info['req_active'] = $req_active;
            $fr_info['fr_check'] = $check_friend;
            $fr_info['fr_friends'] = $fr_friends;
            $fr_info = json_encode($fr_info);
            print $fr_info;
        }

        function new_post(){
            $p_desc = $_POST["p_description"];
            $p_desc =$this->jevix->parse($p_desc,$errors);
            $p_desc = mysqli_real_escape_string($this->db, $p_desc);
            $u_session = $_SESSION['u_session'];
            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
    
            if($_FILES){
                $uploaddir = './uploads'; 
                $uploaddirResized = './uploads/posts';
            
                if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir);
                if( ! is_dir( $uploaddirResized ) ) mkdir( $uploaddirResized);
            
                $file = $_FILES; 
                
                $salt = time().$rand = random_int(1, 1000000);
                $file_name = $salt;
                move_uploaded_file( $file[0]['tmp_name'], "$uploaddirResized/$file_name".".jpg");
                $this -> db -> query("INSERT INTO posts(post_description, user_id, picture) VALUES('$p_desc', '$u_id', '$file_name')");
            }
            else{
                $this -> db -> query("INSERT INTO posts(post_description, user_id) VALUES('$p_desc', '$u_id')");
            }
    
            $last_id = mysqli_insert_id($this -> db);
            $new_post = $this -> db -> query("SELECT posts.post_description,
                                                     posts.time,
                                                     posts.picture,
                                                     posts.ID,
                                                     users.name,
                                                     users.surname,
                                                     photos.photo_path
                                                     FROM posts 
                                                     INNER JOIN users ON posts.user_id = users.ID
                                                     INNER JOIN photos ON photos.user_id = users.ID
                                                     WHERE posts.ID = '$last_id' 
                                                     AND users.id = posts.user_id 
                                                     AND photos.user_id = posts.user_id 
                                                     AND photos.active = 1")->fetch_all(true);
            // var_dump($new_post);
            $new_post = json_encode($new_post);
            echo $new_post;
        }

        function post_comment(){
            $u_session = $_SESSION['u_session'];
            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
            $post_id = $_POST["post_id"];
            $post_comment = $_POST["post_comment"];
            $post_comment =$this->jevix->parse($post_comment,$errors);
            $post_comment = mysqli_real_escape_string($this->db, $post_comment);
            $this->db->query("INSERT INTO comments(post_id, user_id, comment) VALUES('$post_id', '$u_id', '$post_comment')");
            // $p_comments = $this->db->query("SELECT
            //                                     users.name,
            //                                     users.surname,
            //                                     photos.photo_path,
            //                                     comments.comment,
            //                                     comments.time,
            //                                     comments.post_id
            //                                 FROM
            //                                     comments
            //                                 INNER JOIN users ON users.ID = comments.user_id
            //                                 INNER JOIN photos ON photos.user_id = users.ID
            //                                 WHERE
            //                                     comments.post_id = $post_id
            //                                 AND photos.active = 1")->fetch_all(true);
            // $p_comments = json_encode($p_comments);
            // echo $p_comments;
        }

        function post_like(){
            $u_session = $_SESSION['u_session'];
            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
    
            $post_id = $_POST["post_id"];
            $check_list = $this-> db -> query("SELECT user_id FROM post_likes WHERE user_id = '$u_id' AND post_id = '$post_id'")->fetch_all(true);
            // print_r($check_list);
            if(!empty($check_list)){
                $this->db->query("DELETE FROM post_likes WHERE user_id = $u_id AND post_id = $post_id");
            }
            else{
                $this->db->query("INSERT INTO post_likes(post_id, user_id) VALUES($post_id, $u_id)");
            }
            // $like_data = $this -> db -> query("SELECT post_id, COUNT(*) 
            //                                     FROM post_likes
            //                                     WHERE post_id = $post_id
            //                                     GROUP BY post_id
            //                                     ")->fetch_all(true);
            // if(!empty($like_data)){
            //     $like_data = json_encode($like_data);
            //     echo $like_data;
            // }
        }
    
        function post_dislike(){
            $u_session = $_SESSION['u_session'];
            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
    
            $post_id = $_POST["post_id"];
            $check_list = $this-> db -> query("SELECT user_id FROM post_dislikes WHERE user_id = '$u_id' AND post_id = '$post_id'")->fetch_all(true);
            if(!empty($check_list)){
                $this->db->query("DELETE FROM post_dislikes WHERE user_id = $u_id AND post_id = $post_id");
            }
            else{
                $this->db->query("INSERT INTO post_dislikes(post_id, user_id) VALUES($post_id, $u_id)");
            }
            // $dislike_data = $this -> db -> query("SELECT post_id, COUNT(*) 
            //                                     FROM post_dislikes
            //                                     WHERE post_id = $post_id
            //                                     GROUP BY post_id
            //                                     ")->fetch_all(true);
            // if(!empty($dislike_data)){
            //     $dislike_data = json_encode($dislike_data);
            //     echo $dislike_data;
            // }
        }
    }

    $userInfo = new userProfileInfo;

?>