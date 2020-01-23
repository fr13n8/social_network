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
            $u_info['u_photos'] = $u_photos;
            $u_info = json_encode($u_info);
            print $u_info;
        }

        function fr_getinfo(){
            
        }
    }

    $userInfo = new userProfileInfo;

?>