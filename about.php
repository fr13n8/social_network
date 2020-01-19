<?php 

session_start();
if(isset($_SESSION["u_session"])){
}
else{
    header('Location: index.php');
}

require_once("modules/header.php");
require_once("modules/about-user.php");
require_once("modules/footer.php");

?>