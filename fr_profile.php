<?php


session_start();
if(isset($_SESSION["u_session"])){
    require_once("modules/fr_modules/fr_header.php");
    require_once("modules/fr_modules/fr_news-line.php");
    require_once("modules/fr_modules/fr_footer.php");
}
else{
    header('Location: index.php');
}



?>