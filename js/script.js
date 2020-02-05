jQuery(document).ready(function($) {
	
	"use strict";
	




	let socket = new WebSocket("ws://localhost:2346");

	socket.onopen = function(e) {
	  console.log("[open] Соединение установлено");
	  console.log("Отправляем данные на сервер");
	//   socket.send("Меня зовут Джон");
	};
	
	socket.onmessage = function(event) {
		let data = JSON.parse(event.data);
		// let data = event.data;
		// console.log(`[message] Данные получены с сервера: ${data}`);
		// console.log(data);

		switch (data.action) {
			case "msgs-data":
					// console.log("show-msgs");
					$(".msgs_name").html(`${data[0].name} ${data[0].surname}`);
					$('.message_body').attr("data-value", `${data[0].ID}`);
					// scrollToBottom();
					// if (elem.scrollTop >= (elem.scrollHeight - elem.clientHeight)) {
					// 	elem.scrollTop = 0;
					// 	return;
					// } 
					// setInterval(function(){getMessages(fr_id, fr_photo_phath, u_photo_phath)}, 300);
				break;
			case "messages":
				// console.log("get_messages");
				// console.log(data);
				$(".chat-list > ul").empty();

				$.each(data, function (indexInArray, element) { 
					if(isNaN(indexInArray)){
						
					}
					else{
						let person, person_avatar;
						if(element.receiver_id == data.fr_id){
							// console.log(222)
							person = "you";
							person_avatar = data.u_photo_phath;
						}
						else{
							// console.log(333)
							person = "me";
							person_avatar = data.fr_photo_phath;
						}
						$(".chat-list > ul").append(`<li class="${person}">
													<div class="chat-thumb"><img src="${person_avatar}" alt=""></div>
													<div class="notification-event">
														<span class="chat-message-item">
															${element.message}
														</span>
														<span class="notification-date"><time datetime="${element.time}" class="entry-date updated">${element.time}</time></span>
													</div>
												</li>`);
					}
					// scrollToBottom();
				});
				// if(checker == 0){
				// 	scrollToBottom();
				// 	checker++;
				// }
				// $(".chat-list > ul").scrollTop=elem.scrollTop+9999;
				break;
			default:
				break;
		}
		// scrollToBottom()
	};
	
	socket.onclose = function(event) {
		// checker = 0;
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




	function scrollToBottom() {
		let scrollCount = $(".msg-list")[0].scrollHeight;
		// console.log(scrollCount)
		$(".msg-list").stop().animate({scrollTop : scrollCount });
	  }
	  

//------- Notifications Dropdowns
  $('.top-area > .setting-area > li').on("click",function(){
	$(this).siblings().children('div').removeClass('active');
	$(this).children('div').addClass('active');
	return false;
  });
//------- remove class active on body
  $("body *").not('.top-area > .setting-area > li').on("click", function() {
	$(".top-area > .setting-area > li > div").removeClass('active');		
 });
	

//--- user setting dropdown on topbar	
$('.user-img').on('click', function() {
	$('.user-setting').toggleClass("active");
	return false;
});	


$('.friendz-list, .chat-users').on('click', 'li', function(){
	$('.chat-box').addClass("show");
	let fr_id = $(this).data("value");
	let fr_photo_phath = $(this).find('img').attr("src");
	let u_photo_phath = $(".u_top_miniature").attr("src");
	// console.log(fr_photo_phath);
	// console.log(u_photo_phath);
	let u_session = localStorage.getItem('u_session');
	let data = {
		friend_id : fr_id,
		action : "show_msgs",
		u_session : u_session
	};
	console.log(data);
	socket.send(JSON.stringify(data));
	getMessages(fr_id, fr_photo_phath, u_photo_phath);
	scrollToBottom()
	// $.ajax({
	// 	type: "post",
	// 	url: "./u_profile/u_messages.php",
	// 	data: {
	// 		friend_id : fr_id,
	// 		action : "show_msgs"
	// 	},
	// 	success: function (response) {
	// 		response = JSON.parse(response);
	// 		// console.log(fr_id);
	// 		$(".msgs_name").html(`${response[0].name} ${response[0].surname}`);
	// 		$('.message_body').attr("data-value", `${response[0].ID}`);
	// 		getMessages(fr_id, fr_photo_phath, u_photo_phath);
	// 		setInterval(function(){getMessages(fr_id, fr_photo_phath, u_photo_phath)}, 300);
	// 	}
	// });
	// return false;
})
	$('.close-mesage').on('click', function() {
		$('.chat-box').removeClass("show");
		return false;
	});	
	
//------ message send

 $('.message_body').bind("enterKey",function(e){
	let message = $(this).val();
	let fr_id = $(this).data("value");
	$(this).val("");
	let u_session = localStorage.getItem('u_session');
	let data = {
		friend_id : fr_id,
		message : message,
		action : "snd_msg",
		u_session : u_session
	};
	socket.send(JSON.stringify(data));
	
	scrollToBottom()
	// console.log(message);
	// $.ajax({
	// 	type: "post",
	// 	url: "./u_profile/u_messages.php",
	// 	data: {
	// 		friend_id : fr_id,
	// 		message : message,
	// 		action : "snd_msg"
	// 	},
	// 	success: function (response) {
			
	// 	}
	// });
 });
 $('.message_body').keyup(function(e){
	 if(e.keyCode == 13)
	 {
		 $(this).trigger("enterKey");
	 }
 });
 
//------ real time messages

function getMessages(fr_id, fr_photo, u_photo){
	let u_session = localStorage.getItem('u_session');
	let data = {
		friend_id : fr_id,
		action : "get_messages",
		u_session : u_session,
		fr_photo_phath : fr_photo,
		u_photo_phath : u_photo
	};
	socket.send(JSON.stringify(data));
	// $.ajax({
	// 	type: "post",
	// 	url: "./u_profile/u_messages.php",
	// 	data: {
	// 		friend_id : fr_id,
	// 		action : "get_messages"
	// 	},
	// 	success: function (response) {
	// 		$(".chat-list > ul").empty();
	// 		response = JSON.parse(response);
	// 		// console.log(response);
	// 		// console.log(fr_photo)
	// 		// console.log(u_photo)
			
	// 		response.forEach(element => {
	// 			// let person;
	// 			// TODO
	// 			let person, person_avatar;
	// 			if(element.receiver_id == fr_id){
	// 				// console.log(222)
	// 				person = "you";
	// 				person_avatar = fr_photo;
	// 			}
	// 			else{
	// 				// console.log(333)
	// 				person = "me";
	// 				person_avatar = u_photo;
	// 			}
	// 			$(".chat-list > ul").append(`<li class="${person}">
	// 											<div class="chat-thumb"><img src="${person_avatar}" alt=""></div>
	// 											<div class="notification-event">
	// 												<span class="chat-message-item">
	// 													${element.message}
	// 												</span>
	// 												<span class="notification-date"><time datetime="${element.time}" class="entry-date updated">${element.time}</time></span>
	// 											</div>
	// 										</li>`);
	// 		});
			
	// 	}
	// });
}

//------ scrollbar plugin
	if ($.isFunction($.fn.perfectScrollbar)) {
		$('.dropdowns, .twiter-feed, .invition, .followers, .chatting-area, .peoples, #people-list, .chat-list > ul, .message-list, .chat-users, .left-menu').perfectScrollbar();
	}

/*--- socials menu scritp ---*/	
	$('.trigger').on("click", function() {
	    $(this).parent(".menu").toggleClass("active");
	  });
	
/*--- emojies show on text area ---*/	
	$('.add-smiles > span').on("click", function() {
	    $(this).parent().siblings(".smiles-bunch").toggleClass("active");
	  });

// delete notifications
$('.notification-box > ul li > i.del').on("click", function(){
    $(this).parent().slideUp();
	return false;
  }); 	

/*--- socials menu scritp ---*/	
	$('.f-page > figure i').on("click", function() {
	    $(".drop").toggleClass("active");
	  });

//===== Search Filter =====//
	(function ($) {
	// custom css expression for a case-insensitive contains()
	jQuery.expr[':'].Contains = function(a,i,m){
	  return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};

	function listFilter(searchDir, list) { 
	  var form = $("<form>").attr({"class":"filterform","action":"#"}),
	  input = $("<input>").attr({"class":"filterinput","type":"text","placeholder":"Search Contacts..."});
	  $(form).append(input).appendTo(searchDir);

	  $(input)
	  .change( function () {
		var filter = $(this).val();
		if(filter) {
		  $(list).find("li:not(:Contains(" + filter + "))").slideUp();
		  $(list).find("li:Contains(" + filter + ")").slideDown();
		} else {
		  $(list).find("li").slideDown();
		}
		return false;
	  })
	  .keyup( function () {
		$(this).change();
	  });
	}

//search friends widget
	$(function () {
	  listFilter($("#searchDir"), $("#people-list"));
	});
	}(jQuery));	

//progress line for page loader
	$('body').show();
	NProgress.start();
	setTimeout(function() { NProgress.done(); $('.fade').removeClass('out'); }, 2000);
	
//--- bootstrap tooltip	
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip();
	});
	
// Sticky Sidebar & header
	if($(window).width() < 769) {
		jQuery(".sidebar").children().removeClass("stick-widget");
	}

	if ($.isFunction($.fn.stick_in_parent)) {
		$('.stick-widget').stick_in_parent({
			parent: '#page-contents',
			offset_top: 60,
		});

		
		$('.stick').stick_in_parent({
		    parent: 'body',
            offset_top: 0,
		});
		
	}
	
/*--- topbar setting dropdown ---*/	
	$(".we-page-setting").on("click", function() {
	    $(".wesetting-dropdown").toggleClass("active");
	  });	
	  
/*--- topbar toogle setting dropdown ---*/	
$('#nightmode').on('change', function() {
    if ($(this).is(':checked')) {
        // Show popup window
        $(".theme-layout").addClass('black');	
    }
	else {
        $(".theme-layout").removeClass("black");
    }
});

//chosen select plugin
if ($.isFunction($.fn.chosen)) {
	$("select").chosen();
}

//----- add item plus minus button
if ($.isFunction($.fn.userincr)) {
	$(".manual-adjust").userincr({
		buttonlabels:{'dec':'-','inc':'+'},
	}).data({'min':0,'max':20,'step':1});
}	
	
if ($.isFunction($.fn.loadMoreResults)) {	
	$('.loadMore').loadMoreResults({
		displayedItems: 3,
		showItems: 1,
		button: {
		  'class': 'btn-load-more',
		  'text': 'Load More'
		}
	});	
}
	//===== owl carousel  =====//
	if ($.isFunction($.fn.owlCarousel)) {
		$('.sponsor-logo').owlCarousel({
			items: 6,
			loop: true,
			margin: 30,
			autoplay: true,
			autoplayTimeout: 1500,
			smartSpeed: 1000,
			autoplayHoverPause: true,
			nav: false,
			dots: false,
			responsiveClass:true,
				responsive:{
					0:{
						items:3,
					},
					600:{
						items:3,

					},
					1000:{
						items:6,
					}
				}

		});
	}
	
// slick carousel for detail page
	if ($.isFunction($.fn.slick)) {
	$('.slider-for-gold').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		slide: 'li',
		fade: false,
		asNavFor: '.slider-nav-gold'
	});
	
	$('.slider-nav-gold').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.slider-for-gold',
		dots: false,
		arrows: true,
		slide: 'li',
		vertical: true,
		centerMode: true,
		centerPadding: '0',
		focusOnSelect: true,
		responsive: [
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				vertical: false,
				centerMode: true,
				dots: false,
				arrows: false
			}
		},
		{
			breakpoint: 641,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				vertical: true,
				centerMode: true,
				dots: false,
				arrows: false
			}
		},
		{
			breakpoint: 420,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true,
				vertical: false,
				centerMode: true,
				dots: false,
				arrows: false
			}
		}	
		]
	});
}
	
//---- responsive header
	
$(function() {

	//	create the menus
	$('#menu').mmenu();
	$('#shoppingbag').mmenu({
		navbar: {
			title: 'General Setting'
		},
		offCanvas: {
			position: 'right'
		}
	});

	//	fire the plugin
	$('.mh-head.first').mhead({
		scroll: {
			hide: 200
		}
		
	});
	$('.mh-head.second').mhead({
		scroll: false
	});

	
});		

//**** Slide Panel Toggle ***//
	  $("span.main-menu").on("click", function(){
	     $(".side-panel").addClass('active');
		  $(".theme-layout").addClass('active');
		  return false;
	  });

	  $('.theme-layout').on("click",function(){
		  $(this).removeClass('active');
	     $(".side-panel").removeClass('active');
		  
	     
	  });

	  
// login & register form
	$('button.signup').on("click", function(){
		$('.login-reg-bg').addClass('show');
		return false;
	  });
	  
	  $('.already-have').on("click", function(){
		$('.login-reg-bg').removeClass('show');
		return false;
	  });
	
//----- count down timer		
	if ($.isFunction($.fn.downCount)) {
		$('.countdown').downCount({
			date: '11/12/2018 12:00:00',
			offset: +10
		});
	}
	
/** Post a Comment **/
jQuery(".post-comt-box textarea").on("keydown", function(event) {

	if (event.keyCode == 13) {
		var comment = jQuery(this).val();
		var parent = jQuery(".showmore").parent("li");
		var comment_HTML = '	<li><div class="comet-avatar"><img src="images/resources/comet-1.jpg" alt=""></div><div class="we-comment"><div class="coment-head"><h5><a href="time-line.html" title="">Jason borne</a></h5><span>1 year ago</span><a class="we-reply" href="#" title="Reply"><i class="fa fa-reply"></i></a></div><p>'+comment+'</p></div></li>';
		$(comment_HTML).insertBefore(parent);
		jQuery(this).val('');
	}
}); 
	
//inbox page 	
//***** Message Star *****//  
    $('.message-list > li > span.star-this').on("click", function(){
    	$(this).toggleClass('starred');
    });


//***** Message Important *****//
    $('.message-list > li > span.make-important').on("click", function(){
    	$(this).toggleClass('important-done');
    });

    

// Listen for click on toggle checkbox
	$('#select_all').on("click", function(event) {
	  if(this.checked) {
	      // Iterate each checkbox
	      $('input:checkbox.select-message').each(function() {
	          this.checked = true;
	      });
	  }
	  else {
	    $('input:checkbox.select-message').each(function() {
	          this.checked = false;
	      });
	  }
	});


	$(".delete-email").on("click",function(){
		$(".message-list .select-message").each(function(){
			  if(this.checked) {
			  	$(this).parent().slideUp();
			  }
		});
	});

// change background color on hover
	$('.category-box').hover(function () {
		$(this).addClass('selected');
		$(this).parent().siblings().children('.category-box').removeClass('selected');
	});
	
	
//------- offcanvas menu 

	const menu = document.querySelector('#toggle');  
	const menuItems = document.querySelector('#overlay');  
	const menuContainer = document.querySelector('.menu-container');  
	const menuIcon = document.querySelector('.canvas-menu i');  

	function toggleMenu(e) {
		menuItems.classList.toggle('open');
		menuContainer.classList.toggle('full-menu');
		menuIcon.classList.toggle('fa-bars');
		menuIcon.classList.add('fa-times');
		e.preventDefault();
	}

	if( menu ) {
		menu.addEventListener('click', toggleMenu, false);	
	}
	
// Responsive nav dropdowns
	$('.offcanvas-menu li.menu-item-has-children > a').on('click', function () {
		$(this).parent().siblings().children('ul').slideUp();
		$(this).parent().siblings().removeClass('active');
		$(this).parent().children('ul').slideToggle();
		$(this).parent().toggleClass('active');
		return false;
	});	
	

// Log Out
	$("#u_logout").click(function () {
        $.ajax({
            type: "post",
            url: "./u_profile/u_logout.php",
            data: {
                action : "u_logout"
            },
            success: function (response) {
                if(response){
                    console.log("saccess")
                }
                else{
                    console.log("logout")
                    location.href = './index.php'
                }
            }
        });
	})
	

// People Search
	$(document).on('input', '#people_search', function () {
		let seacrh_val = $(this).val();
		// console.log(seacrh_val)
		let search_params = {
			name : seacrh_val,
			action : "search"
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: search_params,
			success: function (response) {
				if(response){
					response = JSON.parse(response);
					// console.log(response);
					if(response.errors){
						console.log(response)
						$(".search_friends_list").empty();
					}
					else{
						$(".search_friends_list").empty();
						let fr_miniature = response[0]["photo_path"] + "_min.jpg"; 
						response.forEach(element => {
							$(".search_friends_list").append(`<li>
																<figure>
																	<img src="./u_profile/uploads/resized/${fr_miniature}" alt="" class="search_result_photos">
																</figure>
																<div class="friendz-data">
																	<span class="fr_profile fr_item" data-value="${element.u_email}" >${element.u_name} ${element.u_surname}</span>
																</div>
															</li>`);
						});
					}
				}
				else{
					$(".search_friends_list").empty();
				}
			}
		});
	  });
	
	
	
	$(".search_friends_list, #people-list").on("click", '.fr_item', function(event){
		event.stopPropagation();
		let fr_email = $(this).data("value");
		console.log(fr_email);
		let fr_data = {
			action : "fr_email",
			email : fr_email
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: fr_data,
			success: function (response) {
				if(response){
					location.href = './fr_profile.php'
				}
			}
		});
	})

//============================================================================================================

	 $.ajax({
        type: "post",
        url: "./u_profile/u_profile_info.php",
        data: {
            action : "u_info"
        },
        success: function (response) {
            
                response = JSON.parse(response);
                console.log(response);
				
				
                if(response.u_photos){
                    response.u_photos.forEach(element => {
						let u_miniature = response[0]["photo_path"] + "_min.jpg"; 
						$(".u_top_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
                        
                    });
                }
                else{
                    return;
				}
				
				if(response.u_requests){
					$(".notifi-count").html(`${response.u_requests.length}`);
					response.u_requests.length == 0 ? $(".notifi-title").html(`No new notifications yet`):$(".notifi-title").html(`${response.u_requests.length} New Notifications`);
					$(".frends_req > span").html(response.u_requests.length);
					response.u_requests.forEach(element => {
						let req_name = element.name;
						let req_surname = element.surname;
						let req_email = element.email;
						let req_photo = element.photo_path+"_min.jpg";

						$(".notifi-menu").append(`<li>
													<a>
														<img src="./u_profile/uploads/resized/${req_photo}" alt="">
														<div class="mesg-meta" data-value="${element.ID}">
															<h6 class="fr_item" data-value="${req_email}">${req_name} ${req_surname}</h6>
															<span>Friend request</span>
															<p class="tag green fr_accept">Accept</p>
															<p class="tag red fr_reject">Reject</p>
															<i>2 min ago</i>
														</div>
													</a>
													<span class="tag green">New</span>
												</li>`)
					})
				}
        }
	});
	
	$(".notifi-menu").on("click", '.fr_item', function(){
		let fr_email = $(this).data("value");
		console.log(fr_email);
		let fr_data = {
			action : "fr_email",
			email : fr_email
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: fr_data,
			success: function (response) {
				if(response){
					location.href = './fr_profile.php'
				}
			}
		});
	})

	$(".notifi-menu").on("click", '.fr_accept', function(){
		let fr_id = $(this).parent().data("value");
		let for_del = $(this).parent().parent().parent();
		console.log(fr_id);
		let fr_data = {
			action : "fr_accept",
			id : fr_id
		}
		$.ajax({
			type: "post",
			url: "./u_profile/fr_server.php",
			data: fr_data,
			success: function (response) {
				for_del.remove();
			}
		});
	})

	$(".notifi-menu").on("click", '.fr_reject', function(){
		let fr_id = $(this).parent().data("value");
		let for_del = $(this).parent().parent().parent();
		console.log(fr_id);
		let fr_data = {
			action : "fr_reject",
			id : fr_id
		}
		$.ajax({
			type: "post",
			url: "./u_profile/fr_server.php",
			data: fr_data,
			success: function (response) {
				for_del.remove();
			}
		});
	})

	var p_photo;
	$("#p_photo[type=file]").on('change' , function (event) {

		p_photo = this.files;
		console.log(p_photo)

		event.preventDefault();
		event.stopPropagation();
	})

	$(".new-post").click(function(event){
		event.stopPropagation();
		event.preventDefault(); 
			let post_description = $(".new-post-description").val();
			console.log(p_photo)
			
			var data = new FormData();
			if( typeof p_photo != 'undefined' ){
				$.each( p_photo, function( key, value ){
					data.append( key, value );
				});
			}
			
			data.append( 'action', 'new_post' );
			data.append('p_description' , post_description);
	

			$.ajax({
				url         : './u_profile/u_profile_info.php',
				type        : 'POST',
				data        : data,
				cache       : false,
				dataType    : 'json',
				processData : false,
				contentType : false,
				success     : function(response){
					// response = JSON.parse(response);
					console.log(response);
					let u_miniature = response[0]["photo_path"] + "_min.jpg";
					var p_photo;
					if(response[0].picture){
						p_photo = `<img src="./u_profile/uploads/posts/${response[0].picture}.jpg" alt="">`;
					}
					else{
						p_photo = '';
					}
					$(".post_form").after(`	<div class="central-meta item">
												<div class="user-post">
													<div class="friend-info">
														<figure>
															<img src="./u_profile/uploads/resized/${u_miniature}" alt="">
														</figure>
														<div class="friend-name">
															<ins><a href="time-line.html" title="">${response[0].name} ${response[0].surname}</a></ins>
															<span>published: ${response[0].time}</span>
														</div>
														<div class="post-meta">
															${p_photo}
															<div class="description">
																
																<p>
																	${response[0].post_description}
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
																		<span class="like" data-toggle="tooltip" title="like">
																			<i class="ti-heart"></i>
																			<ins>0</ins>
																		</span>
																	</li>
																	<li>
																		<span class="dislike" data-toggle="tooltip" title="dislike">
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
															<li class="post-comment">
																<div class="comet-avatar">
																	<img src="./u_profile/uploads/resized/${u_miniature}" alt="">
																</div>
																<div class="post-comt-box">
																	<form method="post">
																		<textarea placeholder="Post your comment"></textarea>
																		
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
	})

});//document ready end





