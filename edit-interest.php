<?php

session_start();
if(isset($_SESSION["u_session"])){
    if($_SESSION["checkSettings"] == 1){
        require_once("modules/top_header.php");
        require_once("modules/header.php");
        require_once("modules/edit-interests.php");
        require_once("modules/footer.php");
    }
    else{
        header('Location: profile-setting.php');
    }
}
else{
    header('Location: index.php');
}

?>