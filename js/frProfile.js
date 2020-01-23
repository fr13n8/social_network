$(document).ready(function () {
    $.ajax({
        type: "post",
        url: "./u_profile/u_profile_info.php",
        data: {
            action : "fr_info"
        },
        success: function (response) {
            
                response = JSON.parse(response);
                console.log(response);
                // for (const key in response[0]) {
                    // if (response[0].hasOwnProperty(key)) {
                    //     const element = response[0][key];
                    //     $(`#${key}`).html(`${element}`);
                    //     $(`#${key}Change`).val(`${element}`);
                    //     $(".admin-name > h5").html(`${response[0][u_name]}`);
                    // } 
                    // }
                let country;
                if(response[0].u_country){
                    country = response[0].u_country;
                    $.getJSON("country-codes/country.json",
                            function (data) {
                                data.forEach(element => {
                                    if(country == element.iso_3){
                                        country = element.name;
                                        $("#u_live").html(`Live in ${country} ${response[0].u_city}`);
                                    }
                                });
                            }
                            );
                }
                else{
                    $("#u_live").html(`Place of residence not known`);
                }
               
                if(response.req_active.length != 0){
                    if(response.req_active[0].active == 1){
                        $(".add-btn").empty();
                        $(".add-btn").append(`<span class="del_request">Delete Request</span>`);
                    }
                    else{
                        $(".add-btn").empty();
                        $(".add-btn").append(`<span class="snd_request">Send Request</span>`);
                    }
                }
                else{
                    $(".add-btn").empty();
                    $(".add-btn").append(`<span class="snd_request">Send Request</span>`);
                }

                $(".admin-name > h5").html(`${response[0].u_name} ${response[0].u_surname}`);
                $("#u_name").html(` ${response[0].u_name} ${response[0].u_surname}`);
                $("#u_email").html(`${response[0].u_email}`);
                let u_avatar = response[0]["photo_path"] + "_avatar.jpg";
                // let u_miniature = response[0]["photo_path"] + "_min.jpg"; 
                let u_background = response[0]["background_path"] + "_background.jpg";
                $("#u_avatar").attr("src", `./u_profile/uploads/resized/${u_avatar}`);
                // $(".u_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
                $("#u_background").attr("src", `./u_profile/uploads/resized/${u_background}`);

                if(response.u_photos){
                    response.u_photos.forEach(element => {
                        if(element.photo_path == "anonymous"){
                            return;
                        }
                        else{
                            $(".photos").append(`  <li>									
                                                        <div class="user-photos">
                                                            <figure>
                                                            <a class="strip" href="u_profile/uploads/${element.photo_path}.jpg" title="" data-strip-group="mygroup" data-strip-group-options="loop: false">
                                                            <img src="u_profile/uploads/resized/${element.photo_path}_gall_min.jpg" alt=""></a>
                                                                <form class="edit-phtos" style="cursor: pointer;">
                                                                    <i class="fa fa-camera-retro"></i>
                                                                    <label class="fileContainer">
                                                                        <span id="make_avatar" data-value=${element.photo_path}>Make the main photo</span>
                                                                    </label>
                                                                </form>
                                                            </figure>
                                                        </div>
                                                    </li>`);
                        }
                    });
                }
                else{
                    return;
                }
        }
    });

    $(".add-btn").on('click', ".snd_request", function () {
        $.ajax({
            type: "post",
            url: "./u_profile/fr_server.php",
            data: {
                "action" : "request"
            },
            success: function (response) {
                $(".add-btn").empty();
                        $(".add-btn").append(`<span class="del_request">Delete Request</span>`);
            }
        });
    })

    $(".add-btn").on('click', ".del_request", function () {
        $.ajax({
            type: "post",
            url: "./u_profile/fr_server.php",
            data: {
                "action" : "del_request"
            },
            success: function (response) {
                $(".add-btn").empty();
                        $(".add-btn").append(`<span class="snd_request">Send Request</span>`);
            }
        });
    })
});