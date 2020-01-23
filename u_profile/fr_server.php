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
    }

    $request = new requestController;

?>