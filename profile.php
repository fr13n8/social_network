<?php

session_start();
if(isset($_SESSION["u_session"])){
    require_once("modules/top_header.php");
    require_once("modules/header.php");
    require_once("modules/news-line.php");
    require_once("modules/footer.php");
}
else{
    header('Location: index.php');
}

?>