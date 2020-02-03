<?php 
session_start();
    class userProfileInfo{
        private $db;

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'u_info':
                        $this->u_getinfo();
                    break;
                    case 'fr_info':
                        $this->fr_getinfo();
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
            $req_active = $this -> db -> query("SELECT active FROM requests WHERE user_id = '$u_id' AND friend_id = '$fr_id' ")->fetch_all(true);
            $fr_photos = $this->db->query("SELECT photo_path FROM photos WHERE user_id = (SELECT ID FROM users WHERE email = '$fr_email')")->fetch_all(true);
            $fr_info['fr_photos'] = $fr_photos;
            $fr_info['req_active'] = $req_active;
            $fr_info = json_encode($fr_info);
            print $fr_info;
        }
    }

    $userInfo = new userProfileInfo;

?>