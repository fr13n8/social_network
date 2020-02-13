<?php 
session_start();
    class uLogOut{
        private $db;

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'u_logout':
                        $this->u_logOut();
                        break;
                }
            }
        }

        function u_logOut(){
            // $this->db->query("UPDATE users SET session = '$u_session' WHERE email = '$u_email'");
            $u_session = $_SESSION['u_session'];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $this -> db -> query("UPDATE users SET session = '', online = 0 WHERE ID = '$id'");
            session_destroy();
        }
    }

    $userLogOut = new uLogOut;

?>