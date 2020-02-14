$(document).ready(function () {
    
    $("#u_data_reg").click(function () {
        let u_name = $("#name").val();
        let u_surname = $("#surname").val();
        let u_age = $("#age").val();
        let u_email = $("#email").val();
        let u_password = $("#password").val();
        let u_confirmPassword = $("#confirm_password").val();
        let u_data = {
                name : u_name,
                surname : u_surname,
                age : u_age,
                email : u_email,
                password : u_password,
                confirm_password : u_confirmPassword
        };
        u_data.action = "u_reg";

        $.ajax({
            type: "post",
            url: "u_reg/u_register.php",
            data: u_data,
            success: function (response) {
                if(response){
                    response = JSON.parse(response);
                    console.log(response);

                    $("input").css({border : "none"});
                    for (const key in response) {
                        if (response.hasOwnProperty(key)) {
                            const element = response[key];
                            $(`#${key}`)
                            .val("")
                            .css({
                                border : "2px solid red"
                            })
                            .attr("placeholder", `${element}`);
                        }
                    }
                    $("#confirm_password")
                    .val("")
                    .attr("placeholder", "Confirm password");
                }
                else{
                    $("input").val("");
                    $("input").css({border : "none"});
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'You have successfully registered',
                        showConfirmButton: false,
                        timer: 1500
                      })
                }
            }
        });
    });

    $("#u_data_log").click(function () {
        let u_email = $("#l_email").val();
        let u_password = $("#l_password").val();

        $.ajax({
            type: "post",
            url: "u_reg/u_log.php",
            data: {
                email : u_email,
                password : u_password,
                action : "u_log"
            },
            success: function (response) {
                // sessionStorage.setItem("u_session", response);
                if(response){
                    response = JSON.parse(response);
                    console.log(response);
                    if(response[0]){
                        if(response[0].settingsCheck){
                        console.log("redirecting")
                        response[0].settingsCheck == 1?location.href = './profile.php':location.href = './profile-setting.php';
                        }
                    }

                    $("input").css({border : "none"});
                    for (const key in response) {
                        if (response.hasOwnProperty(key)) {
                            const element = response[key];
                            $(`#l_${key}`)
                            .val("")
                            .css({
                                border : "2px solid red"
                            })
                            .attr("placeholder", `${element}`);
                        }
                    }
                    
                }
                // else{
                //     location.href = './profile-setting.php'
                // }
                
            }
        });
    });

});