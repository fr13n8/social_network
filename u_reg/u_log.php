<?php
session_start();

    class LoginController {
        private $db;
        private $inp_errors = [];

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'u_log':
                        $u_data = [
                            "email" => $_POST["email"],
                            "password" => $_POST["password"]
                        ];
                        $this->data_clean($u_data);
                        $this->u_validate($u_data);
                        break;
                }
            }
        }

        function data_clean($u_data){
            foreach ($u_data as $key => $value) {
                $u_data[$key] = $this->clean($value);
            }
        }

        function clean($value) {
            $value = trim($value);
            $value = preg_replace('/\s+/', '', $value);
            $value = stripslashes($value);
            $value = strip_tags($value);
            $value = htmlspecialchars($value);
            
            return $value;
        }

        function u_validate($u_data){
            
            foreach ($u_data as $key => $value) {
                if(empty($u_data[$key])){
                    $this->inp_errors[$key] = "Please input your {$key}";
                }
                else{
                    $this->email_valid($u_data["email"]);
                    $this->length_valid($u_data);
                }
            }
            
            if(!empty($this->inp_errors)){
                $inp_errors = json_encode($this->inp_errors);
                echo $inp_errors;    
            }
            else{
                $this->u_auth($u_data);
            }
            
        }

        function email_valid($u_email){
            $u_email = str_replace(' ', '', $u_email);
            $u_emails = $this->db->query("SELECT email FROM users")->fetch_all(true);
            $check = false;

            if(filter_var($u_email, FILTER_VALIDATE_EMAIL)){
                for($i = 0; $i < count($u_emails); $i++){
                    if($u_emails[$i]["email"] === $u_email){
                        $check = true;
                    }
                }
            }
            else{
                $this->inp_errors["email"] = "Please input the correct email";
            }     

            if($check){
                return;
            }
            else{
                $this->inp_errors["email"] = "Such user does not exist";
            }
        }

        function length_valid($u_data){
            foreach ($u_data as $key => $value) {
                switch ($key) {
                    case 'password':
                        $min = 7;
                        $max = 30;
                        $this->password_length($u_data[$key], $min, $max);
                        break;
                }
            }
        }

        function password_length($u_password, $min, $max){
            if(strlen($u_password) <= $min){
                $this->inp_errors["password"] = "Your password is too short";
            }
            else if(strlen($u_password) >= $max){
                $this->inp_errors["password"] = "Your password is too long";
            }
        }

        function u_auth($u_data){
            $u_email = $u_data["email"];
            $u_password = $u_data["password"];
            $u_password_hash = $this->db->query("SELECT password FROM users WHERE email = '$u_email'")->fetch_all(true);
            if(password_verify($u_password, $u_password_hash[0]["password"])){
                $tok = time();
                $rand = random_int(1, 1000000);
                $u_session = $tok.$rand;

                $this->db->query("UPDATE users SET session = '$u_session' WHERE email = '$u_email'");
                $u_session = json_encode($u_session);
                $_SESSION["u_session"] = $u_session;
            }
            else{
                $this->inp_errors["password"] = "Your password is not correct";
                $inp_errors = json_encode($this->inp_errors);
                echo $inp_errors;    
            }
        }

    }

    $u_log = new LoginController;

?>