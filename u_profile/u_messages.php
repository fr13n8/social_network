<?php

require_once './jevix/jevix.class.php';

// session_start();

    class MessagesController{
        private $db;
        public $data;
        public $callback;
        private $jevix;

        function __construct($data){
            $this -> db = new mysqli("localhost", "root", "", "social_network");
            $this -> data = $data;

            $this -> jevix = new Jevix();
            // Устанавливаем разрешённые теги. (Все не разрешенные теги считаются запрещенными.)
            $this -> jevix->cfgAllowTags(array('strong'));
            
            // Устанавливаем разрешённые параметры тегов.
            // $this -> jevix->cfgAllowTagParams('a', array('title', 'href'));
            
            // Устанавливаем параметры тегов являющиеся обязяательными. Без них вырезает тег оставляя содержимое.
            // $this -> jevix->cfgSetTagParamsRequired('a', 'href');
            
            // Устанавливаем теги которые может содержать тег контейнер
            // $this -> jevix->cfgSetTagChilds('ul', 'li', true, false);
            
            // Устанавливаем атрибуты тегов, которые будут добавлятся автоматически
            // $this -> jevix->cfgSetTagParamsAutoAdd('a', array('rel' => 'nofollow'));
            if(isset($this -> data)){
                switch ($this -> data["action"]) {
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
            $u_session = $this -> data["u_session"];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $friend_id = $this -> data["friend_id"];

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
            $msgs_data["action"] = "msgs-data";
            $msgs_data = json_encode($msgs_data);
            // echo $msgs_data;
            return $this -> callback = $msgs_data;
        }

        function snd_message(){
            $u_session = $this -> data["u_session"];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $friend_id = $this -> data["friend_id"];
            $message = $this -> data["message"];
            $message =$this->jevix->parse($message,$errors);
            $this->db->query("INSERT INTO messages(user_id, receiver_id, message) VALUES('$id', '$friend_id', '$message')");
        }

        function get_messages(){
            $friend_id = $this -> data["friend_id"];
            $u_session = $this -> data["u_session"];
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
            $messages["action"] = "messages";
            $messages["fr_photo_phath"] = $this -> data["fr_photo_phath"];
            $messages["u_photo_phath"] = $this -> data["u_photo_phath"];
            $messages["fr_id"] = $this -> data["friend_id"];
            $messages = json_encode($messages);
            // echo $messages;
            return $this -> callback = $messages;
        }
    }

    // $messages = new MessagesController;

?>