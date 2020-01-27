<?php

session_start();
    class requestController{
        private $db;

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'request':
                        $this->fr_getRequest();
                    break;
                    case 'del_request':
                        $this->fr_delRequest();
                    break;
                    case 'fr_accept':
                        $this->fr_accept();
                    break;
                    case 'fr_reject':
                        $this->fr_reject();
                    break;
                }
            }
        }

        function fr_getRequest(){
            $u_session = $_SESSION["u_session"];
            $fr_email = $_SESSION["fr_email"];

            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
            
            $fr_id = $this -> db -> query("SELECT ID FROM users WHERE email = '$fr_email'")->fetch_all(true);
            $fr_id = $fr_id[0]["ID"];

            $this -> db -> query ("INSERT INTO requests(user_id, friend_id, active) VALUES ('$u_id', '$fr_id', 1)");
        }

        function fr_delRequest(){
            $u_session = $_SESSION["u_session"];
            $fr_email = $_SESSION["fr_email"];

            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
            
            $fr_id = $this -> db -> query("SELECT ID FROM users WHERE email = '$fr_email'")->fetch_all(true);
            $fr_id = $fr_id[0]["ID"];

            $this -> db -> query ("DELETE FROM requests WHERE user_id = '$u_id' AND friend_id = '$fr_id'");
        }

        function fr_accept(){
            $fr_id = $_POST["id"];
            $u_session = $_SESSION["u_session"];
            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
            $this->db->query("DELETE 
                                FROM
                                    requests 
                                WHERE
                                    user_id = '$fr_id' 
                                    AND friend_id = '$u_id'");
            $this->db->query("INSERT INTO friends(user_id, friend_id) VALUES ('$fr_id', '$u_id')");
        }

        function fr_reject(){
            $fr_id = $_POST["id"];
            $u_session = $_SESSION["u_session"];
            $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $u_id = $u_id[0]["ID"];
            $this->db->query("DELETE 
                                FROM
                                    requests 
                                WHERE
                                    user_id = '$fr_id' 
                                    AND friend_id = '$u_id'");
        }
    }

    $request = new requestController;

?>