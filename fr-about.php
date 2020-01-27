<?php


session_start();
if(isset($_SESSION["u_session"]) && $_SESSION["fr_email"]){
    require_once("modules/top_header.php");
    require_once("modules/fr_modules/fr_header.php");
    require_once("modules/fr_modules/fr_about.php");
    require_once("modules/fr_modules/fr_footer.php");
}
else{
    header('Location: index.php');
}



?>