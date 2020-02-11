$(document).ready(function () {

    let socket = new WebSocket("ws://localhost:2346");

	socket.onopen = function(e) {
        console.log("[open] Соединение установлено");
        console.log("Отправляем данные на сервер");
            getfrPosts();
            getfrComments();
            getLDs();
      //   socket.send("Меня зовут Джон");
      };
	
	socket.onmessage = function(event) {
		let data = JSON.parse(event.data);
		// let data = event.data;
		// console.log(`[message] Данные получены с сервера: ${data}`);
		// console.log(data);

		switch (data.action) {
			case "frposts_data":
                    console.log(data)
                    
                    $.each(data, function (indexInArray, element) {
                        if(isNaN(indexInArray)){
                            return;
                        }
                        else{
                            let u_miniature = element["photo_path"] + "_min.jpg";
                            let me_miniature = $(".u_top_miniature").attr("src");
                        var p_photo;
                        if(element.picture){
                            p_photo = `<img src="./u_profile/uploads/posts/${element.picture}.jpg" alt="">`;
                        }
                        else{
                            p_photo = '';
                        }
                        $(".loadMore").after(`	<div class="central-meta item posts" id="post_${element.ID}">
                                                    <div class="user-post">
                                                        <div class="friend-info">
                                                            <figure>
                                                                <img src="./u_profile/uploads/resized/${u_miniature}" alt="">
                                                            </figure>
                                                            <div class="friend-name">
                                                                <ins><a href="time-line.html" title="">${element.name} ${element.surname}</a></ins>
                                                                <span>published: ${element.time}</span>
                                                            </div>
                                                            <div class="post-meta">
                                                                ${p_photo}
                                                                <div class="description">
                                                                    
                                                                    <p>
                                                                        ${element.post_description}
                                                                    </p>
                                                                </div>
                                                                <div class="we-video-info">
                                                                    <ul>
                                                                        
                                                                        <!-- <li>
                                                                            <span class="views" data-toggle="tooltip" title="views">
                                                                                <i class="fa fa-eye"></i>
                                                                                <ins>1.2k</ins>
                                                                            </span>
                                                                        </li> -->
                                                                        <li>
                                                                            <span class="comment" data-toggle="tooltip" title="Comments">
                                                                                <i class="fa fa-comments-o"></i>
                                                                                <ins>0</ins>
                                                                            </span>
                                                                        </li>
                                                                        <li>
                                                                            <span class="like" data-toggle="tooltip" data-value="${element.ID}" title="like">
                                                                                <i class="ti-heart"></i>
                                                                                <ins>0</ins>
                                                                            </span>
                                                                        </li>
                                                                        <li>
                                                                            <span class="dislike" data-toggle="tooltip" data-value="${element.ID}" title="dislike">
                                                                                <i class="ti-heart-broken"></i>
                                                                                <ins>0</ins>
                                                                            </span>
                                                                        </li>
                                                                        <li class="social-media">
                                                                            <div class="menu">
                                                                            <div class="btn trigger"><i class="fa fa-share-alt"></i></div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-html5"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-facebook"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-google-plus"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-twitter"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-css3"></i></a></div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-instagram"></i></a>
                                                                                </div>
                                                                            </div>
                                                                                <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-dribbble"></i></a>
                                                                                </div>
                                                                            </div>
                                                                            <div class="rotater">
                                                                                <div class="btn btn-icon"><a href="#" title=""><i class="fa fa-pinterest"></i></a>
                                                                                </div>
                                                                            </div>
    
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                        <div class="coment-area">
                                                            <ul class="we-comet">
                                                                <li class="load_more">
                                                                    <a href="#" title="" class="showmore underline">more comments</a>
                                                                </li>
                                                                <li class="post-comment">
                                                                    <div class="comet-avatar">
                                                                        <img src="${me_miniature}" alt="">
                                                                    </div>
                                                                    <div class="post-comt-box">
                                                                        <form method="post">
                                                                            <textarea data-value='${element.ID}' class='comment_area' placeholder="Post your comment" value = '23'></textarea>
                                                                            
                                                                            <button type="submit"></button>
                                                                        </form>	
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>`);
                        }
                        
                    });
                break;
            case "frcomments_data":
                    // console.log(data)
                    $.each(data, function (indexInArray, element) { 
                        $(`#post_${element.post_id}`).find(".comment_data").remove();
                    });
                    $.each(data, function (indexInArray, element) { 
                        let u_miniature = element.photo_path + "_min.jpg"; 
                        $(`#post_${element.post_id}`).find(".load_more").before(`<li class="comment_data">
                                            <div class="comet-avatar">
                                                <img src="./u_profile/uploads/resized/${u_miniature}" alt="">
                                            </div>
                                            <div class="we-comment">
                                                <div class="coment-head">
                                                    <h5><a href="time-line.html" title="">${element.name} ${element.surname}</a></h5>
                                                    <span>${element.time}</span>
                                                    <i class="fa fa-reply"></i>
                                                </div>
                                                <p>${element.comment}</p>
                                            </div>
                                        </li>`);
                    });
                break;
            case 'LDs':
                    // console.log(data);
                    $(".posts").find(".we-video-info").find("ins").html("0");
                        data.likes.forEach(element => {
                            $(`#post_${element.post_id}`).find(".like").find("ins").html(`${element.likes}`);
                        });
                    
                        data.dislikes.forEach(element => {
                            $(`#post_${element.post_id}`).find(".dislike").find("ins").html(`${element.dislikes}`);
                        });
                    
            break;
			default:
				break;
		}
	};
	
	socket.onclose = function(event) {
	  if (event.wasClean) {
		console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
	  } else {
		// например, сервер убил процесс или сеть недоступна
		// обычно в этом случае event.code 1006
		console.log('[close] Соединение прервано');
	  }
	};
	
	socket.onerror = function(error) {
	  console.log(`[error] ${error.message}`);
	};

    $.ajax({
        type: "post",
        url: "./u_profile/u_profile_info.php",
        data: {
            action : "fr_info"
        },
        success: function (response) {
            
                response = JSON.parse(response);
                console.log(response);
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
                // let u_avatar = response[0]["photo_path"] + "_avatar.jpg";
                // // let u_miniature = response[0]["photo_path"] + "_min.jpg"; 
                // $("#u_avatar").attr("src", `./u_profile/uploads/resized/${u_avatar}`);
                // // $(".u_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
                // let u_background = response[0]["background_path"] + "_background.jpg";
                // $("#u_background").attr("src", `./u_profile/uploads/resized/${u_background}`);

                if(response.fr_photos){
                    $(".photos").empty();
                    // console.log("empty")
                    response.fr_photos.forEach(element => {
                        if(element.photo_path == "anonymous"){
                            let u_avatar = response[0]["photo_path"] + "_avatar.jpg";
                            // let u_miniature = response[0]["photo_path"] + "_min.jpg"; 
                            $("#u_avatar").attr("src", `./u_profile/uploads/resized/${u_avatar}`);
                            // $(".u_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
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
                                                                
                                                            </figure>
                                                        </div>
                                                    </li>`);
                        }
                    });
                }
                else{
                    return;
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
                    if(response.fr_check.length != 0){
                        if(response.fr_check[0].active == 1){
                            $(".add-btn").empty();
                            $(".add-btn").append(`<span class="del_friend">Delete from friends</span>`);
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
                    // $(".add-btn").empty();
                    // $(".add-btn").append(`<span class="snd_request">Send Request</span>`);
                }

                if(response.fr_friends){
                    let fr_friends = response.fr_friends.reverse();
                    $(".interest-added").empty();
                    $.each(fr_friends, function (indexInArray, element) { 
                        $(".interest-added").append(`<li ><a href="#" title="">${element.interest}</a><span class="remove" data-value='${element.interest}' title="remove"><i class="fa fa-close"></i></span></li>`);
                        $(".basics").append(`<li>${element.interest}</li>`);
                    });
                }
        }
    });

    $.ajax({
        type: "post",
        url: "./u_profile/u_dataChange.php",
        data: {
            action : "get_FRinterests"
        },
        success: function (response) {
            response = JSON.parse(response);
            console.log(response);
            response = response.reverse();
            $(".interest-added").empty();
            $.each(response, function (indexInArray, element) { 
                 $(".interest-added").append(`<li ><a href="#" title="">${element.interest}</a><span class="remove" data-value='${element.interest}' title="remove"><i class="fa fa-close"></i></span></li>`);
                 $(".basics").append(`<li>${element.interest}</li>`);
            });
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

    $(".add-btn").on('click', ".del_friend", function () {
        $.ajax({
            type: "post",
            url: "./u_profile/fr_server.php",
            data: {
                "action" : "del_friend"
            },
            success: function (response) {
                $(".add-btn").empty();
                        $(".add-btn").append(`<span class="snd_request">Send Request</span>`);
            }
        });
    })

    function getfrPosts(){
        let u_session = localStorage.getItem('u_session');
        let fr_email = localStorage.getItem('fr_email');
		let data = {
			action : "get_frposts",
            u_session : u_session,
            fr_email : fr_email
		}
		socket.send(JSON.stringify(data));
	}
    
	function getfrComments(){
        let u_session = localStorage.getItem('u_session');
        let fr_email = localStorage.getItem('fr_email');
		let data = {
			action : "get_frcomments",
			u_session : u_session,
            fr_email : fr_email
		}
		socket.send(JSON.stringify(data));
    }
    
    function getLDs(){
        let u_session = localStorage.getItem('u_session');
        let fr_email = localStorage.getItem('fr_email');
		let data = {
			action : "get_LDs",
			u_session : u_session,
            fr_email : fr_email
		}
		socket.send(JSON.stringify(data));
    }

});