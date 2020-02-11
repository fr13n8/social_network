<?php 
require_once '../jevix/jevix.class.php';
    class RegisterController{
        private $db;
        private $inp_errors = [];

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'u_reg':
                        $u_data = [
                            "name" => $_POST["name"],
                            "surname" => $_POST["surname"],
                            "age" => $_POST["age"],
                            "email" => $_POST["email"],
                            "password" => $_POST["password"],
                            "confirm_password" => $_POST["confirm_password"]
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
                    $this->age_valid($u_data["age"]);
                    $this->email_valid($u_data["email"]);
                    $this->length_valid($u_data);
                    $this->password_confirm($u_data["password"], $u_data["confirm_password"]);
                }
            }
            
            if(!empty($this->inp_errors)){
                $inp_errors = json_encode($this->inp_errors);
                echo $inp_errors;    
            }
            else{
                $this->RegisterUser($u_data);
            }
            
        }

        function length_valid($u_data){
            foreach ($u_data as $key => $value) {
                switch ($key) {
                    case 'name':
                        $min = 3;
                        $max = 15;
                        $this->name_length($u_data[$key], $min, $max);
                        break;
                    case 'surname':
                        $min = 4;
                        $max = 20;
                        $this->surname_length($u_data[$key], $min, $max);
                        break;
                    case 'password':
                        $min = 7;
                        $max = 30;
                        $this->password_length($u_data[$key], $min, $max);
                        break;
                }
            }
        }

        function name_length($u_name, $min, $max){
            if(strlen($u_name) <= $min){
                $this->inp_errors["name"] = "Your name is too short";
            }
            else if(strlen($u_name) >= $max){
                $this->inp_errors["name"] = "Your name is too long";
            }
        }

        function surname_length($u_surname, $min, $max){
            if(strlen($u_surname) <= $min){
                $this->inp_errors["surname"] = "Your surname is too short";
            }
            else if(strlen($u_surname) >= $max){
                $this->inp_errors["surname"] = "Your surname is too long";
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

        function age_valid($u_age){
            if(filter_var($u_age, FILTER_VALIDATE_INT)){
                return;
            }
            else{
                $this->inp_errors["age"] = "Please input the correct age";
            }
        }

        function email_valid($u_email){
            $u_email = str_replace(' ', '', $u_email);
            $u_emails = $this->db->query("SELECT email FROM users")->fetch_all(true);
            $check = false;
            
            for($i = 0; $i < count($u_emails); $i++){
                if($u_emails[$i]["email"] === $u_email){
                    $check = true;
                }
            }

            if($check){
                $this->inp_errors["email"] = "Please input a valid email";;
            }
            else if(filter_var($u_email, FILTER_VALIDATE_EMAIL)){
                return;
            }
            else{
                $this->inp_errors["email"] = "Please input the correct email";
            }
        }

        function password_confirm($u_password, $u_password_confirm){
            $u_password = str_replace(' ', '', $u_password);
            $u_password_confirm = str_replace(' ', '', $u_password_confirm);
            if($u_password !== $u_password_confirm){
                $this->inp_errors["password"] = "Passwords do not match";
            }
        }

        function RegisterUser($u_data){
            $options = [
                'cost' => 11
            ];
            $u_password = password_hash($u_data["password"], PASSWORD_BCRYPT, $options);
            $u_name = $u_data["name"];
            $u_surname = $u_data["surname"];
            $u_age = $u_data["age"];
            $u_email = $u_data["email"];
            $u_name = mysqli_real_escape.string($this->db, $u_name);
            $u_password = mysqli_real_escape.string($this->db, $u_password);
            $u_surname = mysqli_real_escape.string($this->db, $u_surname);
            $u_age = mysqli_real_escape.string($this->db, $u_age);
            $u_email = mysqli_real_escape.string($this->db, $u_email);
            $this -> db -> query("INSERT INTO users(name, surname, age, email, password) 
                                VALUES('$u_name', '$u_surname', '$u_age', '$u_email', '$u_password')");

            $jd_photo = "anonymous";
            
            $last_index = $this -> db ->query("SELECT LAST_INSERT_ID() as last_id")->fetch_all(true);
            $last_index = $last_index[0]['last_id'];
            // print_r($last_index);
            $this -> db -> query("INSERT INTO photos(photo_path, user_id, active) VALUES('$jd_photo', $last_index, 1)");
            $this -> db -> query("INSERT INTO background(background_path, user_id, active) VALUES('', $last_index, 1)");
        }

    }

    $u_reg = new RegisterController;

?>