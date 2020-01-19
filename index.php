<?php 
session_start();
session_destroy();
?>
<!DOCTYPE html>
<html>
<head>
	<link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700,900" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="css/logRegStyle.css">
	<title>user login</title>
</head>
<body>
	<div class="align">
		<!-- <img class="logo" src="img/logo.svg"> -->
		<h1 class="logo"><span class="logo_night">night</span>&nbsp;<span class="logo_hub">Hub</span></h1>
		<div class="card">
			<div class="head">
				<!-- <div></div> -->
				<a id="login" class="selected" href="#login">Login</a>
				<a id="register" href="#register">Register</a>
				<!-- <div></div> -->
			</div>
			<div class="tabs">
				<div class="trigger_tables">
					<div class="inputs">
						<div class="input">
							<input placeholder="Email" type="text" id="l_email">
							<img src="images/mail.svg">
						</div>
						<div class="input">
							<input placeholder="Password" type="password" id="l_password">
							<img src="images/pass.svg">
						</div>
						<!-- <label class="checkbox">
							<input type="checkbox">
							<span>Remember me</span>
						</label> -->
					</div>
					<button id="u_data_log">Login</button>
				</div>
				<div class="trigger_tables">
					<div class="inputs">
						<div class="input">
							<input placeholder="Name" type="text" id="name">
							<img src="images/user.svg">
						</div>
						<div class="input">
							<input placeholder="Surname" type="text" id="surname">
							<img src="images/user.svg">
						</div>
						<div class="input">
							<input placeholder="Age" type="text" id="age">
							<img src="images/user.svg">
						</div>
						<div class="input">
							<input placeholder="Email" type="text" id="email">
							<img src="images/mail.svg">
						</div>
						<div class="input">
							<input placeholder="Password" type="password" id="password">
							<img src="images/pass.svg">
						</div>
						<div class="input">
							<input placeholder="Confirm password" type="password" id="confirm_password">
							<img src="images/pass.svg">
						</div>
					</div>
					<button id="u_data_reg">Register</button>
				</div>
			</div>
		</div>
	</div>
	<script src="js/jquery-3.4.1.min.js"></script>
	<script src="js/trigger-table.js"></script>
	<script src="js/uLogReg.js"></script>
</body>
</html>
