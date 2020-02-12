<?php
require_once '../jevix/jevix.class.php';
session_start();

    class uChangeData{
        private $db;
        private $inp_errors = [];
        private $jevix;

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");

            $this -> jevix = new Jevix();
            // Устанавливаем разрешённые теги. (Все не разрешенные теги считаются запрещенными.)
            $this -> jevix->cfgAllowTags(array('a', 'strong'));
            
            // Устанавливаем разрешённые параметры тегов.
            $this -> jevix->cfgAllowTagParams('a', array('title', 'href'));
            
            // Устанавливаем параметры тегов являющиеся обязяательными. Без них вырезает тег оставляя содержимое.
            $this -> jevix->cfgSetTagParamsRequired('a', 'href');
            
            // Устанавливаем теги которые может содержать тег контейнер
            // $this -> jevix->cfgSetTagChilds('ul', 'li', true, false);
            
            // Устанавливаем атрибуты тегов, которые будут добавлятся автоматически
            // $this -> jevix->cfgSetTagParamsAutoAdd('a', array('rel' => 'nofollow'));
            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'u_dataChange':
                        $u_data = [
                            "name" => $_POST["name"],
                            "surname" => $_POST["surname"],
                            // "age" => $_POST["age"],
                            "email" => $_POST["email"],
                            "phone" => $_POST["phone"],
                            "about" => $_POST["about"],
                            "city" => $_POST["city"],
                            "country" => $_POST["country"],
                            "password" => $_POST["password"],
                            "gender" => $_POST["gender"]
                        ];
                        $this->data_clean($u_data);
                        $this->u_changeValid($u_data);
                        break;
                     case 'u_passChange':
                        $u_data = [
                            "password" => $_POST["password"],
                            "new_password" => $_POST["new_password"],
                            "confirm_password" => $_POST["confirm_password"]
                        ];
                        // $this->data_clean($u_data);
                        $this->u_changePassValid($u_data);
                        break;
                    case 'add_interest':
                        $u_data = [
                            "interest" => $_POST["interest"]
                        ];
                        $this->data_clean($u_data);
                        $this->add_interest($u_data);
                    break;
                    case 'del_interest':
                        $u_data = [
                            "interest" => $_POST["interest"]
                        ];
                        $this->del_interest($u_data);
                    break;
                    case 'get_interests':
                        $u_session = $_SESSION["u_session"];
                        $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
                        $id = $id[0]["ID"];
                        $interests = $this -> get_interests($id);

                        echo $interests;
                    break;
                    case 'get_FRinterests':
                        $fr_email = $_SESSION["fr_email"];
                        $fr_id = $this -> db -> query("SELECT ID FROM users WHERE email = '$fr_email'")->fetch_all(true);
                        $fr_id = $fr_id[0]["ID"];
                        $interests = $this -> get_interests($fr_id);

                        echo $interests;
                    break;
                }
            }
        }

        function data_clean($u_data){
            foreach ($u_data as $key => $value) {
                switch ($key) {
                    case 'about':
                        $value = trim($value);
                        $value = stripslashes($value);
                        $value = strip_tags($value);
                        // $value = htmlspecialchars($value);
                        $value =$this->jevix->parse($value,$errors);
                        $u_data[$key] = $value;
                        return;
                        break;
                    case 'city':
                        return;
                        break;
                    case 'country':
                        return;
                        break;
                    default:
                        $u_data[$key] = $this->clean($value);
                        break;
                }
            }
        }

        function clean($value) {
            $value = trim($value);
            $value = preg_replace('/\s+/', '', $value);
            $value = stripslashes($value);
            $value = strip_tags($value);
            $value = htmlspecialchars($value);
            $value =$this->jevix->parse($value,$errors);

            return $value;
        }

        function u_changeValid($u_data){

            foreach ($u_data as $key => $value) {

                switch ($key) {
                    case 'about':
                        // return;
                        break;
                    case 'country':
                        // return;
                        break;
                    case 'gender':
                        // return;
                        break;
                    case 'name':
                        // return;
                        break;
                    case 'surname':
                        // return;
                        break;
                    case 'email':
                        // return;
                        break;
                    default:
                        if(empty($u_data[$key]) || $u_data[$key] == "" || $u_data[$key] == " "){
                            $this->inp_errors[$key] = "Please input your {$key}";
                        }
                        else{
                            // $this->age_valid($u_data["age"]);
                            $this->email_valid($u_data["email"]);
                            $this->length_valid($u_data);
                            $this->password_confirm($u_data);
                        }
                        break;
                }

                
            }

            
            if(!empty($this->inp_errors)){
                $this->inp_errors["action"] = "errors";
                $inp_errors = json_encode($this->inp_errors);
                echo $inp_errors;    
            }
            else{
                $this->UserDataChange($u_data);
            }

        }
        
        function u_changePassValid($u_data){

            foreach ($u_data as $key => $value) {
                if(empty($u_data[$key])){
                    $this->inp_errors[$key] = "Please input your {$key}";
                }
                else{
                    $this->length_valid($u_data);
                    $this->newPassword_confirm($u_data);
                    $this->password_confirm($u_data);
                }
            }

            
            if(!empty($this->inp_errors)){
                $inp_errors = json_encode($this->inp_errors);
                echo $inp_errors;    
            }
            else{
                $this->u_changePass($u_data);
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
                    case 'new_password':
                        $min = 7;
                        $max = 30;
                        $this->newPassword_length($u_data[$key], $min, $max);
                        break;
                    case 'about':
                        $min = 15;
                        $max = 150;
                        if(empty($u_data[$key])){
                            break;
                        }
                        else{
                            $this->about_length($u_data[$key], $min, $max);
                        }       
                }
            }
        }

        function about_length($u_about, $min, $max){
            if(strlen($u_about) <= $min){
                $this->inp_errors["about"] = "Text must contain at least 15 characters";
            }
            else if(strlen($u_about) >= $max){
                $this->inp_errors["about"] = "Text should contain no more than 150 characters";
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

        function newPassword_length($u_password, $min, $max){
            if(strlen($u_password) <= $min){
                $this->inp_errors["new_password"] = "Your new password is too short";
            }
            else if(strlen($u_password) >= $max){
                $this->inp_errors["new_password"] = "Your new password is too long";
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
            $u_session = $_SESSION['u_session'];
            $u_baseEmail = $this -> db -> query("SELECT email FROM users WHERE session = $u_session")->fetch_all(true);
            if($u_email === $u_baseEmail[0]["email"]){
                return;
            }
            else{
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
        }

        function password_confirm($u_data){
            $u_session = $_SESSION['u_session'];
            $u_password = $u_data["password"];
            $u_password_hash = $this->db->query("SELECT password FROM users WHERE session = $u_session")->fetch_all(true);
            if(password_verify($u_password, $u_password_hash[0]["password"])){
                return;
            }
            else{
                $this->inp_errors["password"] = "Incorrect password";
            }
        }

        function newPassword_confirm($u_data){
            $u_newPassword = $u_data["new_password"];
            $u_password_confirm = $u_data["confirm_password"];

            if($u_newPassword === $u_password_confirm){
               return;
            }
            else{
                $this->inp_errors["new_password"] = "Passwords do not match";
            }

        }

        function UserDataChange($u_data){
            $u_session = $_SESSION['u_session'];
            $u_name = $u_data["name"];
            $u_surname = $u_data["surname"];
            // $u_age = $u_data["age"];
            $u_phone = $u_data["phone"];
            $u_email = $u_data["email"];
            $u_city = $u_data ["city"];
            $u_country = $u_data["country"];
            $u_gender = $u_data["gender"];
            $u_about = $u_data["about"];
            $this -> db -> query("UPDATE users SET 
                                name = '$u_name', 
                                surname = '$u_surname', 
                                email = '$u_email',
                                phone = '$u_phone',
                                gender = '$u_gender',
                                city = '$u_city',
                                country = '$u_country',
                                about = '$u_about' 
                                WHERE session = $u_session");
            $u_info = $this->db->query("SELECT 
                                        name as u_name, 
                                        surname as u_surname, 
                                        -- age as u_age, 
                                        email as u_email,
                                        phone as u_phone,
                                        gender as u_gender,
                                        city as u_city,
                                        country as u_country,
                                        about as u_about FROM users WHERE session = $u_session")->fetch_all(true);
            $u_info["action"] = "u_updInfo";
            $u_info = json_encode($u_info);
            echo $u_info;
        }

        function u_changePass($u_data){
            $u_session = $_SESSION['u_session'];
            $u_newPassword = $u_data["new_password"];
            $options = [
                'cost' => 11
            ];
            $u_newPassHash = password_hash($u_newPassword, PASSWORD_BCRYPT, $options);      
            $this->db->query("UPDATE users SET password = '$u_newPassHash' WHERE session = $u_session");   
        }

        function add_interest($u_data){
            $u_session = $_SESSION["u_session"];
            $interest = $u_data["interest"];
            $interest =$this->jevix->parse($interest,$errors);
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $this -> db -> query("INSERT INTO interests(interest, user_id) VALUES('$interest', '$id')");
            $interests = $this -> get_interests($id);

            echo $interests;
        }

        function del_interest($u_data){
            $u_session = $_SESSION["u_session"];
            $interest = $u_data["interest"];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];

            $this->db->query("DELETE FROM interests WHERE user_id = '$id' AND interest = '$interest'");
            $interests = $this -> get_interests($id);

            echo $interests;
        }

        function get_interests($id){
            $interests = $this -> db -> query("SELECT interest FROM interests WHERE user_id = '$id'")->fetch_all(true);
            $interests = json_encode($interests);
            return $interests;
        }
    }

    $uChange = new uChangeData;

?>