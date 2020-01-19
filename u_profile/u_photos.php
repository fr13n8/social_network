<?php
session_start();
require_once("photo-resize.php");
require_once("photo-cut.php");


    class   addPhoto{
        private $db;

        function __construct(){
            $this -> db = new mysqli("localhost", "root", "", "social_network");


            switch ($_POST['my_photo_upload']) {
                case 'avatar':
                    // TODO
                    $this -> avatar_save();
                    break;
                
                case 'background':
                    // TODO
                    $this -> background_save();
                    break;
            }

        }

        function avatar_save(){
            // $image = new SimpleImage();
            $uploaddir = './uploads'; 
            $uploaddirResized = './uploads/resized';
        
            if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir);
            if( ! is_dir( $uploaddirResized ) ) mkdir( $uploaddirResized);
        
            $file = $_FILES; 
            
            $salt = time().$rand = random_int(1, 1000000);
            $file_name = $salt;
            move_uploaded_file( $file[0]['tmp_name'], "$uploaddir/$file_name".".jpg");
            $u_session = $_SESSION['u_session'];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $this-> db -> query("UPDATE photos SET active = 0 WHERE user_id = $id");
            $this -> db -> query("INSERT INTO photos(user_id, photo_path, active) VALUES ('$id', '$file_name', 1)");
            $this -> photo_resize($uploaddir, $file_name, $uploaddirResized);
        }

        function background_save(){
            $uploaddir = './uploads'; 
            $uploaddirResized = './uploads/resized';
        
            if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir);
            if( ! is_dir( $uploaddirResized ) ) mkdir( $uploaddirResized);
        
            $file = $_FILES; 
            
            $salt = time().$rand = random_int(1, 1000000);
            $file_name = $salt;
            move_uploaded_file( $file[0]['tmp_name'], "$uploaddir/$file_name".".jpg");
            $u_session = $_SESSION['u_session'];
            $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
            $id = $id[0]["ID"];
            $this-> db -> query("UPDATE background SET active = 0 WHERE user_id = $id");
            $this -> db -> query("INSERT INTO background(user_id, background_path, active) VALUES ('$id', '$file_name', 1)");
            $this -> backround_resize($uploaddir, $file_name, $uploaddirResized);


        }

        function backround_resize($uploaddir, $file_name, $uploaddirResized){
            $width = imagesx(imagecreatefromjpeg($uploaddir."/".$file_name.".jpg"));
            cropImage($uploaddir."/".$file_name.".jpg", $uploaddirResized."/".$file_name."_background.jpg", $width, 550);
            echo $file_name;
        }

        function photo_resize($uploaddir, $file_name, $uploaddirResized){
            cropImage($uploaddir."/".$file_name.".jpg", $uploaddirResized."/".$file_name."_avatar.jpg", 219, 214);
            cropImage($uploaddir."/".$file_name.".jpg", $uploaddirResized."/".$file_name."_min.jpg", 45, 45);
            $height = imagesy(imagecreatefromjpeg($uploaddir."/".$file_name.".jpg"));
            cropImage($uploaddir."/".$file_name.".jpg", $uploaddirResized."/".$file_name."_gall_min.jpg", 600, $height);
            echo $file_name;
        }
    }


    $newPhoto = new addPhoto;

?>