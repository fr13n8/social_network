<?php 
session_start();
if(isset($_SESSION["u_session"])){
}
else{
    header('Location: index.php');
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    UName <span id="u_name"></span><br>
    USurname <span id="u_surname"></span><br>
    UAge <span id="u_age"></span><br>
    UEmail <span id="u_email"></span><br>
    name:<input type="text" id="u_nameChange"><br>
    surname:<input type="text" id="u_surnameChange"><br>
    age:<input type="text" id="u_ageChange"><br>
    email:<input type="text" id="u_emailChange"><br>
    password:<input type="text" id="u_password"><br>
    <button id="u_dataChange">Change</button>
<br><br>
    password: <input type="text" id="u_passwordChange"><br>
    new password <input type="text" id="u_newPass"><br>
    confirm_password <input type="text" name="" id="u_confirmPass"><br>
    <button id="u_passChange">Password Change</button>
    <br><br>
    <button id="u_logout">LogOut</button>
</body>
<script src="./js/jquery-3.4.1.min.js"></script>
<script src="./js/uProfile.js"></script>
</html>