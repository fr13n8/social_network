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
                if(response[0].u_country && response[0].u_country != "country"){
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
                    $("#u_live").html(`City : ${response[0].u_city}`);
                }

                if(response[0].birth_day && response[0].birth_month && response[0].birth_year){
                    let d = +response[0].birth_day;
                    let m = response[0].birth_month;
                    let y = +response[0].birth_year;
                    $("#u_date").html(`Date : ${d} ${m} ${y}`);
                }
               
                $(".admin-name > h5").html(`${response[0].u_name} ${response[0].u_surname}`);
                $("#u_name").html(` ${response[0].u_name} ${response[0].u_surname}`);
                $("#u_email").html(`${response[0].u_email}`);
                $("#u_phone").append(`${response[0].u_phone}`);
                if(response[0].u_about){
                    $(".personal").append(`<p>${response[0].u_about}</p>`);
                }
                $.each(response[0], function (index, element) { 
                    if(index != "action"){
                        if(element){
                            if(index == "u_city"){
                                $(`#${index}`).val(`${element}`);
                            }
                           $(`#${index}Change`).val(`${element}`);
                        }
                        else{
                            if(index == "u_city"){
                                $(`#${index}`).val(``);
                            }
                           $(`#${index}Change`).val(``);
                        }
                    }

               });

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
                                                            <form class="edit-phtos del-photo" style="cursor: pointer;">
                                                                    <i class="fa fa-camera-retro"></i>
                                                                    <label class="fileContainer">
                                                                        <span id="del_photo" data-value=${element.photo_path}>Delete this photo</span>
                                                                    </label>
                                                                </form>
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

                // if(response.u_friends){
                //     response.u_friends.forEach(element => {
                //         $("#people-list").append(`<li data-value="${element.ID}">
                //                                 <figure>
                //                                     <img src="u_profile/uploads/resized/${element.photo_path}_min.jpg" alt="">
                //                                     <span class="status f-online"></span>
                //                                 </figure>
                //                                 <div class="friendz-meta">
                //                                     <span class="fr_profile fr_item" data-value="${element.email}" >${element.name} ${element.surname}</span>
                //                                     <i>${element.email}</i>
                //                                 </div>
                //                             </li>`);
                //    });
                // }
        }
    });

    $.ajax({
        type: "post",
        url: "./u_profile/u_dataChange.php",
        data: {
            action : "get_interests"
        },
        success: function (response) {
            response = JSON.parse(response);
            console.log(response);
            response = response.reverse();
            $(".interest-added").empty();
            $.each(response, function (indexInArray, element) { 
                 $(".interest-added").append(`<li ><a href="#" title="">${element.interest}</a><span class="remove" data-value='${element.interest}' title="remove"><i class="fa fa-close"></i></span></li>`);
                 $(".interests-list").append(`<li>${element.interest}</li>`);
            });
        }
    });

    $("#u_dataChange").click(function () {
        let u_name = $("#u_nameChange").val();
        let u_surname = $("#u_surnameChange").val();
        // let u_age = $("#u_ageChange").val();
        let u_email = $("#u_emailChange").val();
        let u_password = $("#u_password").val();
        let u_about = $("#u_aboutChange").val();
        let u_day = $(".day").val();
        let u_month = $(".month").val();
        let u_year = $(".year").val();
        console.log(u_day, u_month, u_year)
        let u_gender = $("input[name='gender']:checked").val();
        let u_phone = $("#u_phoneChange").val();
        let u_city = $("#u_city").val();
        let u_country = $("#u_country").val();
        let u_data = {
            year : u_year,
            month : u_month,
            day : u_day,
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
                    console.log(response);
                    if(response.action === "errors"){
                        $.each(response, function (index, element) { 
                             if(index != "action"){
                                 if(index == "password" || index == "city"){
                                    $(`#u_${index}`).val('').attr('placeholder', `${element}`);
                                    $(`#u_${index}`).siblings(".mtrl-select").css({
                                        "border-bottom-color" : "red"
                                    });
                                 }
                                 if(index == "day" || index == "month" || index == "year"){
                                     $(`.${index}`).siblings(".chosen-container-single").find(".chosen-single").css({
                                         "border-color" : "red"
                                     });
                                 }
                                $(`#u_${index}Change`).val('').attr('placeholder', `${element}`);
                                $(`#u_${index}Change`).siblings(".mtrl-select").css({
                                    "border-bottom-color" : "red"
                                });
                                
                             }

                        });
                    }
                    else if(response.action == "u_updInfo"){
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Your setiings has been saved',
                            showConfirmButton: false,
                            timer: 1500
                          })
                        console.log(response);
                        $.each(response[0], function (index, element) {
                            $(".mtrl-select").css({
                                "border-bottom-color" : "#e1e8ed"
                            });
                            if(index != "action"){
                                if(element){
                                    if(index == "u_city"){
                                        $(`#${index}`).val(`${element}`);
                                    }
                                   $(`#${index}Change`).val(`${element}`);
                                }
                                else{
                                    if(index == "u_city"){
                                        $(`#${index}`).val(``);
                                    }
                                   $(`#${index}Change`).val(``);
                                }
                            }
                       });
                       location.href = './profile.php';
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
                    $.each( response, function( key, value ){
                        switch (key) {
                            case "new_password":
                                $("#u_newPass").val('').attr("placeholder", `${value}`);
                                break;
                            case "password":
                                $("#u_passwordChange").val('').attr("placeholder", `${value}`);
                                break;
                            case "confirm_password":
                                $("#u_confirmPass").val('').attr("placeholder", `${value}`);
                                break;
                        }
                    });
                }
                else{
                    console.log("ok");
                    $("#u_newPass").val('')
                    $("#u_passwordChange").val('')
                    $("#u_confirmPass").val('')
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your password has been saved',
                        showConfirmButton: false,
                        timer: 1500
                      })
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
        if(response){
            response.forEach(element => {
                if(element != "anonymous"){
                    $(".photos").append(`<li>									
                                            <div class="user-photos">
                                                <figure>
                                                <form class="edit-phtos del-photo" style="cursor: pointer;">
                                                                    <i class="fa fa-camera-retro"></i>
                                                                    <label class="fileContainer">
                                                                        <span id="del_photo" data-value=${element.photo_path}>Delete this photo</span>
                                                                    </label>
                                                                </form>
                                                <a class="strip" href="u_profile/uploads/${element}.jpg" title="" data-strip-group="mygroup" data-strip-group-options="loop: false">
                                                <img src="u_profile/uploads/resized/${element}_gall_min.jpg" alt=""></a>
                                                    <form class="edit-phtos" style="cursor: pointer;">
                                                        <i class="fa fa-camera-retro"></i>
                                                        <label class="fileContainer">
                                                            <span id="make_avatar" data-value=${element}>Make the main photo</span>
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
                $(".u_top_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
            }
        });
})

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
            $(".u_top_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
        }
    });
})

$(document).on('click', "#del_photo", function(){
    let u_photo = $(this).attr("data-value");
    let this_p = $(this);
    let del_photo = {
        photo : u_photo,
        my_photo_upload : "del"
    }
    console.log(u_photo)
    $.ajax({
        type: "post",
        url: "./u_profile/u_photos.php",
        data: del_photo,
        success: function (response) {
            this_p.parent().parent().parent().parent().parent().remove();
        }
    });
})

$(".add-interest").click(function (e) {
    e.preventDefault();
    let interest = $(".interest-value").val();
    interest = interest.split(",");
    interest = $.map(interest, function (element, indexOrKey) {
        return element.trim();
    });
    interest = interest.filter(word => word);
    console.log(interest)
    $(".interest-value").val('');
    let data = {
        action : "add_interest",
        interest : interest
    };
    if(interest.length >= 1){
        $.ajax({
            type: "post",
            url: "./u_profile/u_dataChange.php",
            data: data,
            success: function (response) {
                response = JSON.parse(response);
                response = response.reverse();
                console.log(response);
                $(".interest-added").empty();
                $.each(response, function (indexInArray, element) { 
                     $(".interest-added").append(`<li ><a href="#" title="">${element.interest}</a><span class="remove" data-value='${element.interest}' title="remove"><i class="fa fa-close"></i></span></li>`)
                });
            }
        });
    }
})

$(".interest-added").on('click', 'a', function (e){
   e.preventDefault();
})

$(".interest-added").on('click', '.remove', function (e){
    e.preventDefault();
    let del_interest = $(this).data("value");
    console.log(del_interest);
    let this_int = $(this);
    let data = {
        action : "del_interest",
        interest : del_interest
    };
    $.ajax({
        type: "post",
        url: "./u_profile/u_dataChange.php",
        data: data,
        success: function (response) {
            response = JSON.parse(response);
            response = response.reverse();
            console.log(response);
            $(".interest-added").empty();
            $.each(response, function (indexInArray, element) { 
                 $(".interest-added").append(`<li ><a href="#" title="">${element.interest}</a><span class="remove" data-value='${element.interest}' title="remove"><i class="fa fa-close"></i></span></li>`)
            });
        }
    });
})

    
});
