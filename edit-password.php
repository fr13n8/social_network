<?php

session_start();
if(isset($_SESSION["u_session"])){
}
else{
    header('Location: index.php');
}

require_once("modules/header.php");
require_once("modules/edit-password.php");
require_once("modules/footer.php");
?>