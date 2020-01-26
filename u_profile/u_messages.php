<?php

session_start();

    class MessagesController{
        private $db;

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'show_msgs':
                        $this->msgs_getinfo();
                    break;
                    case "snd_msg":
                        $this->snd_message();
                    break;
                    case "get_messages":
                        $this->get_messages();
                    break;
                }
            }
        }


        function msgs_getinfo(){
            $u_session = $_SESSION['u_session'];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $friend_id = $_POST["friend_id"];

            $msgs_data = $this->db->query("SELECT
                                                users.name,
                                                users.surname,
                                                photos.photo_path,
                                                users.ID
                                            FROM
                                                users
                                            INNER JOIN photos ON photos.user_id = users.ID
                                            WHERE
                                                users.ID = '$friend_id'
                                            AND photos.active = 1")->fetch_all(true);
            $msgs_data = json_encode($msgs_data);
            echo $msgs_data;
        }

        function snd_message(){
            $u_session = $_SESSION['u_session'];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $friend_id = $_POST["friend_id"];
            $message = $_POST["message"];
            $this->db->query("INSERT INTO messages(user_id, receiver_id, message) VALUES('$id', '$friend_id', '$message')");
        }

        function get_messages(){
            $friend_id = $_POST["friend_id"];
            $u_session = $_SESSION['u_session'];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $messages = $this->db->query("SELECT
                                            message,
                                            receiver_id,
                                            time
                                        FROM
                                            messages
                                        WHERE
                                            (
                                                user_id = '$id'
                                                AND receiver_id = '$friend_id'
                                            )
                                        OR (
                                            user_id = '$friend_id'
                                            AND receiver_id = '$id'
                                        ) ")->fetch_all(true);
            $messages = json_encode($messages);
            echo $messages;
        }
    }

    $messages = new MessagesController;

?>