$(document).ready(function () {
    $.ajax({
        type: "post",
        url: "./u_profile/u_profile_info.php",
        data: {
            action : "u_info"
        },
        success: function (response) {
            
                response = JSON.parse(response);
                console.log(response);
                localStorage.setItem('u_session', response[0].u_session);
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
               
                $(".admin-name > h5").html(`${response[0].u_name} ${response[0].u_surname}`);
                $("#u_name").html(` ${response[0].u_name} ${response[0].u_surname}`);
                $("#u_email").html(`${response[0].u_email}`);
                

                if(response.u_photos){
                    response.u_photos.forEach(element => {
                        if(element.photo_path == "anonymous"){
                            let u_avatar = response[0]["photo_path"] + "_avatar.jpg";
                            let u_miniature = response[0]["photo_path"] + "_min.jpg"; 
                            $("#u_avatar").attr("src", `./u_profile/uploads/resized/${u_avatar}`);
                            $(".u_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
                            if(response[0]["background_path"]){
                                let u_background = response[0]["background_path"] + "_background.jpg";
                                $("#u_background").attr("src", `./u_profile/uploads/resized/${u_background}`);
                                return;
                            }
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

                if(response.u_friends){
                    response.u_friends.forEach(element => {
                        $("#people-list").append(`<li data-value="${element.ID}">
                                                <figure>
                                                    <img src="u_profile/uploads/resized/${element.photo_path}_min.jpg" alt="">
                                                    <span class="status f-online"></span>
                                                </figure>
                                                <div class="friendz-meta">
                                                    <span class="fr_profile fr_item" data-value="${element.email}" >${element.name} ${element.surname}</span>
                                                    <i>${element.email}</i>
                                                </div>
                                            </li>`);
                   });
                }
        }
    });

    

    $("#u_dataChange").click(function () {
        let u_name = $("#u_nameChange").val();
        let u_surname = $("#u_surnameChange").val();
        // let u_age = $("#u_ageChange").val();
        let u_email = $("#u_emailChange").val();
        let u_password = $("#u_password").val();
        let u_about = $("#u_aboutChange").val();

        let u_gender = $("input[name='gender']:checked").val();
        let u_phone = $("#u_phoneChange").val();
        let u_city = $("#u_city").val();
        let u_country = $("#u_country").val();
        let u_data = {
            name : u_name,
            surname : u_surname,
            // age : u_age,
            email : u_email,
            password : u_password,
            gender : u_gender,
            phone : u_phone,
            city : u_city,
            country : u_country,
            about: u_about,
            action : "u_dataChange"
            };
            console.log(u_data);
        $.ajax({
            type: "post",
            url: "./u_profile/u_dataChange.php",
            data: u_data,
            success: function (response) {
                if(response){
                    response = JSON.parse(response);
                    console.log(response[0]);
                    if(response.action === "errors"){
                        // console.log(response);
                    }
                    else if(response.action == "u_updInfo"){
                        
                        // console.log(response);
                        // for (const key in response[0]) {
                        //     if (response[0].hasOwnProperty(key)) {
                        //         const element = response[0][key];
                        //         $(`#${key}`).html(`${element}`);
                        //         $(`#${key}Change`).val(`${element}`);
                        //     }
                        // }
                    }
                }
            }
        });
    })

    $("#u_passChange").click(function () {
        let u_password = $("#u_passwordChange").val();
        let u_newPass = $("#u_newPass").val();
        let u_confirmPassword = $("#u_confirmPass").val();
        let u_data = {
            password : u_password,
            new_password : u_newPass,
            confirm_password : u_confirmPassword,
            action : "u_passChange"
            };
            
        $.ajax({
            type: "post",
            url: "./u_profile/u_dataChange.php",
            data: u_data,
            success: function (response) {
                if(response){
                    response = JSON.parse(response);
                    console.log(response);
                }
                else{
                    console.log("ok");
                    $("input").val("");
                }
            }
        });
    })
//=========================================================================

    var avatar;
    $('#avatar[type=file]').on('change', function(event){
        avatar = this.files;
        console.log(avatar)
        
	event.stopPropagation();
	event.preventDefault(); 

	if( typeof avatar == 'undefined' ) return;

	var data = new FormData();

	$.each( avatar, function( key, value ){
		data.append( key, value );
	});

    data.append( 'my_photo_upload', 'avatar' );

	$.ajax({
		url         : './u_profile/u_photos.php',
		type        : 'POST',
		data        : data,
		cache       : false,
		dataType    : 'json',
		processData : false,
		contentType : false, 
		success     : function( respond){
            let u_photo = respond;
            let u_avatar = u_photo + "_avatar.jpg";
            let u_miniature = u_photo + "_min.jpg"; 
            $("#u_avatar").attr("src", `./u_profile/uploads/resized/${u_avatar}`);
            $(".u_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
            $(".u_top_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
		}
	});
    });



//=========================================================================


var background;
$('#background[type=file]').on('change', function(event){
    background = this.files;

    
event.stopPropagation();
event.preventDefault(); 

if( typeof background == 'undefined' ) return;

var data = new FormData();

$.each( background, function( key, value ){
    data.append( key, value );
});

data.append( 'my_photo_upload', 'background' );

$.ajax({
    url         : './u_profile/u_photos.php',
    type        : 'POST',
    data        : data,
    cache       : false,
    dataType    : 'json',
    processData : false,
    contentType : false, 
    success     : function( respond){
        let u_photo = respond;
        let u_background = u_photo + "_background.jpg";
        $("#u_background").attr("src", `./u_profile/uploads/resized/${u_background}`);
    }
});
});



//=========================================================================


var photos;
$('#photos[type=file]').on('change', function(event){
    photos = this.files;

    
event.stopPropagation();
event.preventDefault(); 

if( typeof photos == 'undefined' ) return;

var data = new FormData();

$.each( photos, function( key, value ){
    data.append( key, value );
});

console.log(photos)

data.append( 'my_photo_upload', 'photos' );

$.ajax({
    url         : './u_profile/u_photos.php',
    type        : 'POST',
    data        : data,
    cache       : false,
    dataType    : 'json',
    processData : false,
    contentType : false, 
    success     : function(response){
        // let u_photo = respond;
        // let u_background = u_photo + "_background.jpg";
        // $("#u_background").attr("src", `./u_profile/uploads/resized/${u_background}`);
        // respond = JSON.parse(respond)

        console.log(response)
        if(response.u_photos){
            response.u_photos.forEach(element => {
                if(element.photo_path == "anonymous"){
                    return;
                }
                else{
                    $(".photos").append(`<li>									
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
});
//=========================================================================

$(document).on('click', "#make_avatar", function(){
        let u_photo = $(this).attr("data-value");
        let make_main = {
            photo : u_photo,
            my_photo_upload : "main"
        }
        console.log(u_photo)
        $.ajax({
            type: "post",
            url: "./u_profile/u_photos.php",
            data: make_main,
            success: function (response) {
                let u_photo = response;
                let u_avatar = u_photo + "_avatar.jpg";
                let u_miniature = u_photo + "_min.jpg"; 
                $("#u_avatar").attr("src", `./u_profile/uploads/resized/${u_avatar}`);
                $(".u_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
            }
        });
})
    
});
