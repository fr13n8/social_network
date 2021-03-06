jQuery(document).ready(function ($) {

	"use strict";


	let socket = new WebSocket("ws://localhost:2346?id=" + localStorage.getItem("userId"));

	socket.onopen = function (e) {
		
		
		setTimeout(() => {
			getPosts();
			getComments();
			getLDs();
		}, 400);
		//   socket.send("Меня зовут Джон");
	};

	socket.onmessage = function (event) {
		let data = JSON.parse(event.data);

		switch (data.action) {
			case "msgs-data":
				
				$(".msgs_name").html(`${data[0].name} ${data[0].surname}`);
				$('.message_body').attr("data-value", `${data[0].ID}`);

				let u_miniature = data[0].photo_path + "_min.jpg";
				$(".conversation-head").find("img").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
				$(".conversation-head").find("span").html(`${data[0].name} ${data[0].surname}`);

				break;
			case "messages":
				// 
				// 
				$(".chat-list > ul").empty();
				$(".chatting-area").empty();
				$.each(data, function (indexInArray, element) {
					if (isNaN(indexInArray)) {
						return;
					} else {
						let person, person_avatar, person1, person1_avatar;
						if (element.receiver_id == data.fr_id) {
							// 
							person = "you";
							person1 = "me";
							person_avatar = data.u_photo_phath;
							person1_avatar = data.fr_photo_phath;
						} else {
							// 
							person = "me";
							person1 = "you";
							person_avatar = data.fr_photo_phath;
							person1_avatar = data.u_photo_phath;
						}
						$(".chat-list > ul").append(`
												<li class="${person}">
													<div class="chat-thumb"><img src="${person_avatar}" alt=""></div>
													<div class="notification-event">
														<span class="chat-message-item">
														${element.message}
														</span>
														<span class="notification-date"><time datetime="${element.time}" class="entry-date updated">${element.time}</time></span>
													</div>
												</li>`);
						$(".chatting-area").append(`<li class="${person1}">
														<figure><img src="${person_avatar}" alt=""></figure>
														<p>${element.message}</p>
													</li>`);
					}
				});
				break;
			case "posts_data":
				// 
				$.each(data, function (indexInArray, element) {
					if (isNaN(indexInArray)) {
						return;
					} else {
						let u_miniature = element["photo_path"] + "_min.jpg";
						var p_photo;
						if (element.picture) {
							p_photo = `<img src="./u_profile/uploads/posts/${element.picture}.jpg" alt="">`;
						} else {
							p_photo = '';
						}
						$(".post_form").after(`	<div class="central-meta item myposts" id="post_${element.ID}">
												<div class="user-post">
													<div class="friend-info" >
													<span class="close-post" data-value="${element.ID}"><i class="ti-close"></i></span>
														<figure>
															<img src="./u_profile/uploads/resized/${u_miniature}" alt="">
														</figure>
														<div class="friend-name">
															<ins><a href="#" title="">${element.name} ${element.surname}</a></ins>
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
																	
																</ul>
															</div>
															
														</div>
													</div>
													<div class="coment-area">
														<ul class="we-comet">
															<li class="load_more">
															</li>
															<li class="post-comment">
																<div class="comet-avatar">
																	<img src="./u_profile/uploads/resized/${u_miniature}" alt="">
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
			case "comments_data":
				// 

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
												<h5><a href="#" data-value="${element.email}" class="get_fr" title="">${element.name} ${element.surname}</a></h5>
												<span>${element.time}</span>
												<i class="fa fa-reply"></i>
											</div>
											<p>${element.comment}</p>
										</div>
									</li>`);
				});
				break;
			case 'myLDs':
				$(".myposts").find(".we-video-info").find("ins").html("0");
				// 
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

	$(document).on("click", '.get_fr', function (event) {
		event.preventDefault();
		event.stopPropagation();
		let fr_email = $(this).data("value");
		localStorage.setItem('fr_email', fr_email);
		
		let fr_data = {
			action: "fr_email",
			email: fr_email
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: fr_data,
			success: function (response) {
				if (response) {
					location.href = './fr_profile.php'
				}
			}
		});
	})

	socket.onclose = function (event) {
		if (event.wasClean) {
			
		} else {
			// например, сервер убил процесс или сеть недоступна
			// обычно в этом случае event.code 1006
			
		}
	};

	socket.onerror = function (error) {
		
	};


	function scrollToBottom() {
		let scrollCount = $(".msg-list")[0].scrollHeight;
		
		$(".msg-list").stop().animate({
			scrollTop: scrollCount
		});
	}

	function scrollToBottom1() {
		let scrollCount1 = $(".chatting-area")[0].scrollHeight;
		// 
		$(".chatting-area").stop().animate({
			scrollTop: scrollCount1
		});
	}

	//------- Notifications Dropdowns
	$('.top-area > .setting-area > li').on("click", function () {
		$(this).siblings().children('div').removeClass('active');
		$(this).children('div').addClass('active');
		return false;
	});
	//------- remove class active on body
	$("body *").not('.top-area > .setting-area > li').on("click", function (e) {
		$(".top-area > .setting-area > li > div").removeClass('active');
	});


	//--- user setting dropdown on topbar	
	$('.user-img').on('click', function (e) {
		$('.user-setting').toggleClass("active");
	});

	$(".peoples").on('click', 'li', function () {
		let fr_id = $(this).data("value");
		$("#message_body1").attr("data-id", fr_id);
		$(".send-msg").attr("data-id", fr_id);
		let fr_photo_phath = $(this).find('img').attr("src");
		let u_photo_phath = $(".u_top_miniature").attr("src");
		$(".peoples-mesg-box").toggleClass("show-mesg-box");
		let u_session = localStorage.getItem('u_session');
		let data = {
			friend_id: fr_id,
			action: "show_msgs",
			u_session: u_session,
			userId: localStorage.getItem("userId")
		};
		socket.send(JSON.stringify(data));
		getMessages(fr_id, fr_photo_phath, u_photo_phath);
		setTimeout(() => {
			scrollToBottom1();
		}, 200);
	})

	$('.friendz-list, .chat-users').on('click', 'li', function () {
		$('.chat-box').toggleClass("show");
		let fr_id = $(this).data("value");
		let fr_photo_phath = $(this).find('img').attr("src");
		let u_photo_phath = $(".u_top_miniature").attr("src");
		let u_session = localStorage.getItem('u_session');
		let data = {
			friend_id: fr_id,
			action: "show_msgs",
			u_session: u_session,
			userId: localStorage.getItem("userId")
		};
		
		socket.send(JSON.stringify(data));
		getMessages(fr_id, fr_photo_phath, u_photo_phath);
		setTimeout(() => {
			scrollToBottom();
		}, 200);
	})
	$('.close-mesage').on('click', function () {
		$('.chat-box').removeClass("show");
		let data = {
			action: "delTimer"
		};
		socket.send(JSON.stringify(data));
		return false;
	});

	//------ message send

	$(".send-msg").click(function (e) {
		e.preventDefault()
		e.stopPropagation()
		let message = $("#message_body1").val();
		
		message = message.trim();
		if (!message) {
			return false;
		}
		let fr_id = $(this).attr("data-id");
		
		let u_session = localStorage.getItem('u_session');
		let data = {
			friend_id: fr_id,
			message: message,
			action: "snd_msg",
			u_session: u_session
		};
		// 
		// 
		socket.send(JSON.stringify(data));
		$(this).val("");
		scrollToBottom1();
	})

	$('#message_body1').bind("enterKey", function (e) {
		let message = $(this).val();
		// 
		
		// 
		let fr_id = $(this).attr("data-id");
		
		let u_session = localStorage.getItem('u_session');
		let data = {
			friend_id: fr_id,
			message: message,
			action: "snd_msg",
			u_session: u_session,
			userId: localStorage.getItem("userId")
		};
		// 
		// 
		socket.send(JSON.stringify(data));
		$(this).val("");
		scrollToBottom1();
	});
	$('#message_body1').keyup(function (e) {
		if (e.keyCode == 13) {
			$(this).trigger("enterKey");
		}
	});

	$('.message_body').bind("enterKey", function (e) {
		let message = $(this).val();
		let fr_id = $(this).attr("data-value");
		$(this).val("");
		let u_session = localStorage.getItem('u_session');
		let data = {
			friend_id: fr_id,
			message: message,
			action: "snd_msg",
			u_session: u_session
		};
		
		
		
		socket.send(JSON.stringify(data));
		scrollToBottom();
		
	});
	$('.message_body').keyup(function (e) {
		if (e.keyCode == 13) {
			$(this).trigger("enterKey");
		}
	});

	//------ real time messages

	function getMessages(fr_id, fr_photo, u_photo) {
		let u_session = localStorage.getItem('u_session');
		let data = {
			friend_id: fr_id,
			action: "get_messages",
			u_session: u_session,
			fr_photo_phath: fr_photo,
			u_photo_phath: u_photo,
			userId: localStorage.getItem("userId")
		};
		socket.send(JSON.stringify(data));
	}

	//------ scrollbar plugin
	if ($.isFunction($.fn.perfectScrollbar)) {
		$('.dropdowns, .twiter-feed, .invition, .followers, .chatting-area, .peoples, #people-list, .chat-list > ul, .message-list, .chat-users, .left-menu').perfectScrollbar();
	}

	/*--- socials menu scritp ---*/
	$('.trigger').on("click", function () {
		$(this).parent(".menu").toggleClass("active");
	});

	/*--- emojies show on text area ---*/
	$('.add-smiles > span').on("click", function () {
		$(this).parent().siblings(".smiles-bunch").toggleClass("active");
	});

	// delete notifications
	$('.notification-box > ul li > i.del').on("click", function () {
		$(this).parent().slideUp();
		return false;
	});

	/*--- socials menu scritp ---*/
	$('.f-page > figure i').on("click", function () {
		$(".drop").toggleClass("active");
	});

	//===== Search Filter =====//
	(function ($) {
		// custom css expression for a case-insensitive contains()
		jQuery.expr[':'].Contains = function (a, i, m) {
			return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
		};

		function listFilter(searchDir, list) {
			var form = $("<form>").attr({
					"class": "filterform",
					"action": "#"
				}),
				input = $("<input>").attr({
					"class": "filterinput",
					"type": "text",
					"placeholder": "Search Contacts..."
				});
			$(form).append(input).appendTo(searchDir);

			$(input)
				.change(function () {
					var filter = $(this).val();
					if (filter) {
						$(list).find("li:not(:Contains(" + filter + "))").slideUp();
						$(list).find("li:Contains(" + filter + ")").slideDown();
					} else {
						$(list).find("li").slideDown();
					}
					return false;
				})
				.keyup(function () {
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
	setTimeout(function () {
		NProgress.done();
		$('.fade').removeClass('out');
	}, 2000);

	//--- bootstrap tooltip	
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});

	// Sticky Sidebar & header
	if ($(window).width() < 769) {
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
	$(".we-page-setting").on("click", function () {
		$(".wesetting-dropdown").toggleClass("active");
	});

	/*--- topbar toogle setting dropdown ---*/
	$('#nightmode').on('change', function () {
		if ($(this).is(':checked')) {
			// Show popup window
			$(".theme-layout").addClass('black');
		} else {
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
			buttonlabels: {
				'dec': '-',
				'inc': '+'
			},
		}).data({
			'min': 0,
			'max': 20,
			'step': 1
		});
	}

	// if ($.isFunction($.fn.loadMoreResults)) {	
	// 	$('.loadMore').loadMoreResults({
	// 		displayedItems: 3,
	// 		showItems: 1,
	// 		button: {
	// 		  'class': 'btn-load-more',
	// 		  'text': 'Load More'
	// 		}
	// 	});	
	// }
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
			responsiveClass: true,
			responsive: {
				0: {
					items: 3,
				},
				600: {
					items: 3,

				},
				1000: {
					items: 6,
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
			responsive: [{
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

	$(function () {

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
	$("span.main-menu").on("click", function () {
		$(".side-panel").addClass('active');
		$(".theme-layout").addClass('active');
		return false;
	});

	$('.theme-layout').on("click", function () {
		$(this).removeClass('active');
		$(".side-panel").removeClass('active');


	});


	// login & register form
	$('button.signup').on("click", function () {
		$('.login-reg-bg').addClass('show');
		return false;
	});

	$('.already-have').on("click", function () {
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
	jQuery(".post-comt-box textarea").on("keydown", function (event) {

		if (event.keyCode == 13) {
			var comment = jQuery(this).val();
			var parent = jQuery(".showmore").parent("li");
			var comment_HTML = '	<li><div class="comet-avatar"><img src="images/resources/comet-1.jpg" alt=""></div><div class="we-comment"><div class="coment-head"><h5><a href="time-line.html" title="">Jason borne</a></h5><span>1 year ago</span><a class="we-reply" href="#" title="Reply"><i class="fa fa-reply"></i></a></div><p>' + comment + '</p></div></li>';
			$(comment_HTML).insertBefore(parent);
			jQuery(this).val('');
		}
	});

	//inbox page 	
	//***** Message Star *****//  
	$('.message-list > li > span.star-this').on("click", function () {
		$(this).toggleClass('starred');
	});


	//***** Message Important *****//
	$('.message-list > li > span.make-important').on("click", function () {
		$(this).toggleClass('important-done');
	});



	// Listen for click on toggle checkbox
	$('#select_all').on("click", function (event) {
		if (this.checked) {
			// Iterate each checkbox
			$('input:checkbox.select-message').each(function () {
				this.checked = true;
			});
		} else {
			$('input:checkbox.select-message').each(function () {
				this.checked = false;
			});
		}
	});


	$(".delete-email").on("click", function () {
		$(".message-list .select-message").each(function () {
			if (this.checked) {
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

	if (menu) {
		menu.addEventListener('click', toggleMenu, false);
	}

	// Log Out
	$(".u_logout").click(function (e) {
		e.preventDefault();
		e.stopPropagation();
		socket.close();
		$.ajax({
			type: "post",
			url: "./u_profile/u_logout.php",
			data: {
				action: "u_logout"
			},
			success: function (response) {

				if (response) {
					
				} else {
					
					location.href = './index.php'
				}
			}
		});
	})


	// People Search
	$(document).on('input', '#people_search', function () {
		let seacrh_val = $(this).val();
		// 
		let search_params = {
			name: seacrh_val,
			action: "search"
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: search_params,
			success: function (response) {
				if (response) {
					response = JSON.parse(response);
					// 
					if (response.errors) {
						
						$(".search_friends_list").empty();
					} else {
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
				} else {
					$(".search_friends_list").empty();
				}
			}
		});
	});



	$(".search_friends_list, #people-list").on("click", '.fr_item', function (event) {
		event.stopPropagation();
		let fr_email = $(this).data("value");
		localStorage.setItem('fr_email', fr_email);
		
		let fr_data = {
			action: "fr_email",
			email: fr_email
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: fr_data,
			success: function (response) {
				if (response) {
					location.href = './fr_profile.php'
				}
			}
		});
	})

	//============================================================================================================

	$(".news_line").click(function () {
		location.href = './newses.php'
	})

	$.ajax({
		type: "post",
		url: "./u_profile/u_profile_info.php",
		data: {
			action: "u_info"
		},
		success: function (response) {

			response = JSON.parse(response);
			


			if (response.u_photos) {
				response.u_photos.forEach(element => {
					let u_miniature = response[0]["photo_path"] + "_min.jpg";
					$(".u_top_miniature").attr("src", `./u_profile/uploads/resized/${u_miniature}`);
					

				});
			} else {
				return;
			}

			if (response.u_requests) {
				$(".notifi-count").html(`${response.u_requests.length}`);
				if (response.u_requests.length == 0) {
					$(".notifi-title").html(`No new notifications yet`);
				} else {
					$(".notifi-title").html(`${response.u_requests.length} New Notifications`);
					$(".friendz-req-count").html(`${response.u_requests.length}`);
				}
				$(".frends_req > span").html(response.u_requests.length);
				response.u_requests.forEach(element => {
					let req_name = element.name;
					let req_surname = element.surname;
					let req_email = element.email;
					let req_photo = element.photo_path + "_min.jpg";

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

				response.u_requests.forEach(element => {
					let req_name = element.name;
					let req_surname = element.surname;
					let req_email = element.email;
					let req_photo = element.photo_path + "_min.jpg";
					$("#frends-req > ul").append(`<li>
															<div class="nearly-pepls">
																<figure>
																	<a href="#" class='get_fr' data-value="${element.email}" title=""><img src="./u_profile/uploads/resized/${req_photo}" alt=""></a>
																</figure>
																<div class="pepl-info" data-value="${element.ID}">
																	<h4><a href="#" class='get_fr' data-value="${element.email}" title="">${req_name} ${req_surname}</a></h4>
																	<span>${req_email}</span>
																	<a href="#" title="" class="add-butn more-action fr_reject" data-ripple="">delete Request</a>
																	<a href="#" title="" class="add-butn fr_accept" data-ripple="">Confirm</a>
																</div>
															</div>
														</li>`)
				})
			}

			if (response.u_friends) {
				$(".friendz-count").html(response.u_friends.length);
				response.u_friends.forEach(element => {
					var check;
					if (element.online == 1) {
						check = "f-online";
					} else {
						check = "f-offline";
					}
					$("#people-list").append(`
											
											<li data-value="${element.ID}">
												<div class="author-thmb">
													<img src="u_profile/uploads/resized/${element.photo_path}_min.jpg" title="${element.name} ${element.surname}" alt="">
													<span class="status ${check}"></span>
												</div>
											</li>`);
				});

				response.u_friends.forEach(element => {
					$("#frends > ul").append(`<li data-value="${element.ID}">
													<div class="nearly-pepls">
														<figure>
															<a href="#" class='get_fr' data-value="${element.email}" title=""><img src="u_profile/uploads/resized/${element.photo_path}_min.jpg" alt=""></a>
														</figure>
														<div class="pepl-info">
															<h4><a href="#" class='get_fr' data-value="${element.email}" title="">${element.name} ${element.surname}</a></h4>
															<span>${element.email}</span>
															<a href="#" title="" data-value="${element.email}" class="add-butn unfriend" data-ripple="">unfriend</a>
														</div>
													</div>
												</li>`)
				});

				response.u_friends.forEach(element => {
					var check;
					if (element.online == 1) {
						check = "f-online";
					} else {
						check = "f-offline";
					}
					$(".peoples").append(`<li data-value="${element.ID}">
											<figure><img src="u_profile/uploads/resized/${element.photo_path}_min.jpg" alt="">
												<span class="status ${check}"></span>
											</figure>
											<div class="people-name">
												<span>${element.name} ${element.surname}</span>
											</div>
										</li>`)
				});
			}
		}
	});

	$("#frends").on("click", '.get_fr', function (event) {
		event.preventDefault();
		event.stopPropagation();
		let fr_email = $(this).data("value");
		localStorage.setItem('fr_email', fr_email);
		
		let fr_data = {
			action: "fr_email",
			email: fr_email
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: fr_data,
			success: function (response) {
				if (response) {
					location.href = './fr_profile.php'
				}
			}
		});
	})

	$("#frends").on('click', ".unfriend", function (e) {
		e.preventDefault();
		let fr_email = $(this).data("value");
		
		let for_del = $(this).parent().parent().parent();
		$.ajax({
			type: "post",
			url: "./u_profile/fr_server.php",
			data: {
				"action": "del_friend",
				fr_email: fr_email
			},
			success: function (response) {
				for_del.remove();
			}
		});
	})

	$("#frends-req").on("click", '.fr_accept', function (e) {
		e.preventDefault();
		
		let fr_id = $(this).parent().data("value");
		
		let fr_data = {
			action: "fr_accept",
			id: fr_id
		}
		let for_del = $(this).parent().parent().parent();
		$.ajax({
			type: "post",
			url: "./u_profile/fr_server.php",
			data: fr_data,
			success: function (response) {
				for_del.remove();
			}
		});
	})

	$("#frends-req").on("click", '.fr_reject', function (e) {
		e.preventDefault();
		
		let fr_id = $(this).parent().data("value");
		
		let fr_data = {
			action: "fr_reject",
			id: fr_id
		}
		let for_del = $(this).parent().parent().parent();
		$.ajax({
			type: "post",
			url: "./u_profile/fr_server.php",
			data: fr_data,
			success: function (response) {
				for_del.remove();
			}
		});
	})

	$(".add-btn").on('click', ".del_friend", function () {
		$.ajax({
			type: "post",
			url: "./u_profile/fr_server.php",
			data: {
				"action": "del_friend"
			},
			success: function (response) {
				$(".add-btn").empty();
				$(".add-btn").append(`<span class="snd_request">Send Request</span>`);
			}
		});
	})



	$(".notifi-menu").on("click", '.fr_item', function () {
		let fr_email = $(this).data("value");
		localStorage.setItem('fr_email', fr_email);
		
		let fr_data = {
			action: "fr_email",
			email: fr_email
		}
		$.ajax({
			type: "post",
			url: "./u_profile/u_search.php",
			data: fr_data,
			success: function (response) {
				if (response) {
					location.href = './fr_profile.php'
				}
			}
		});
	})

	$(".notifi-menu").on("click", '.fr_accept', function () {
		let fr_id = $(this).parent().data("value");
		let for_del = $(this).parent().parent().parent();
		
		let fr_data = {
			action: "fr_accept",
			id: fr_id
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

	$(".notifi-menu").on("click", '.fr_reject', function () {
		let fr_id = $(this).parent().data("value");
		let for_del = $(this).parent().parent().parent();
		
		let fr_data = {
			action: "fr_reject",
			id: fr_id
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
	$("#p_photo[type=file]").on('change', function (event) {

		p_photo = this.files;
		// 

		event.preventDefault();
		event.stopPropagation();


	})

	$(".new-post").click(function (event) {
		event.stopPropagation();
		event.preventDefault();
		let post_description = $(".new-post-description").val();
		post_description = post_description.trim();
		
		if (!post_description) {
			if (!p_photo) {
				return false;
			}
		}
		var data = new FormData();
		if (typeof p_photo != 'undefined') {
			$.each(p_photo, function (key, value) {
				data.append(key, value);
			});
		}

		data.append('action', 'new_post');
		data.append('p_description', post_description);

		$(".new-post-description").val('');
		$.ajax({
			url: './u_profile/u_profile_info.php',
			type: 'POST',
			data: data,
			cache: false,
			dataType: 'json',
			processData: false,
			contentType: false,
			success: function (response) {
				// response = JSON.parse(response);
				
				let u_miniature = response[0]["photo_path"] + "_min.jpg";
				var p_photo;
				if (response[0].picture) {
					p_photo = `<img src="./u_profile/uploads/posts/${response[0].picture}.jpg" alt="">`;
				} else {
					p_photo = '';
				}
				$(".post_form, .post_form1").after(`	<div class="central-meta item myposts" id="post_${response[0].ID}">
												<div class="user-post">
													<div class="friend-info" >
													<span class="close-post" data-value="${response[0].ID}"><i class="ti-close"></i></span>
														<figure>
															<img src="./u_profile/uploads/resized/${u_miniature}" alt="">
														</figure>
														<div class="friend-name">
															<ins><a href="#" title="">${response[0].name} ${response[0].surname}</a></ins>
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
																		<span class="like" data-toggle="tooltip" data-value="${response[0].ID}" title="like">
																			<i class="ti-heart"></i>
																			<ins>0</ins>
																		</span>
																	</li>
																	<li>
																		<span class="dislike" data-toggle="tooltip" data-value="${response[0].ID}" title="dislike">
																			<i class="ti-heart-broken"></i>
																			<ins>0</ins>
																		</span>
																	</li>
																	
																</ul>
															</div>
															
														</div>
													</div>
													<div class="coment-area">
														<ul class="we-comet">
															<li class="load_more">
															</li>
															<li class="post-comment">
																<div class="comet-avatar">
																	<img src="./u_profile/uploads/resized/${u_miniature}" alt="">
																</div>
																<div class="post-comt-box">
																	<form method="post">
																		<textarea data-value='${response[0].ID}' class='comment_area' placeholder="Post your comment" value = '23'></textarea>
																		
																		<button type="submit"></button>
																	</form>	
																</div>
															</li>
														</ul>
													</div>
												</div>
											</div>`);
				$('#p_photo').val('')
			}

		});

	})

	$(".logo").click(function () {
		location.href = './profile.php'
	})

	$(document).on('click', '.like', function () {
		
		let post_id = $(this).data('value');
		let data = {
			action: "p_like",
			post_id: post_id
		}
		
		var this_likes = $(this);
		$.ajax({
			type: "post",
			url: "./u_profile/u_profile_info.php",
			data: data,
			success: function (response) {
				// response = JSON.parse(response);
				// 
				// if(response){
				// 	response = JSON.parse(response);
				// 	
				// 	
				// 	this_likes.find("ins").html(response[0]["COUNT(*)"]);
				// }
				// else{
				// 	this_likes.find("ins").html("0");
				// }
			}
		});
	})

	$(document).on('click', '.dislike', function () {
		
		let post_id = $(this).data('value');
		let data = {
			action: "p_dislike",
			post_id: post_id
		}
		
		var this_dislikes = $(this);
		$.ajax({
			type: "post",
			url: "./u_profile/u_profile_info.php",
			data: data,
			success: function (response) {

			}
		});
	})
	$(document).on('keyup', '.comment_area', function (e) {
		if (e.keyCode == 13) {
			let message = $(this).val();
			message = message.trim();
			let post_id = $(this).data("value");
			if (!message) {
				return false;
			}
			$(this).val("");
			let u_session = localStorage.getItem('u_session');
			let data = {
				action: "snd_comment",
				post_id: post_id,
				post_comment: message
			};
			let this_post = $(`#post_${post_id}`);
			// scrollToBottom()

			$.ajax({
				type: "post",
				url: "./u_profile/u_profile_info.php",
				data: data,
				success: function (response) {

				}
			});
		}
	})

	$(".col-lg-6").on('click', '.close-post', function (e) {
		e.preventDefault();
		e.stopPropagation();
		
		let post_id = $(this).attr("data-value");
		let data = {
			action: "del_post",
			post_id: post_id
		}
		$(`#post_${post_id}`).remove();
		socket.send(JSON.stringify(data));
	})

	function getPosts() {
		let u_session = localStorage.getItem('u_session');
		let data = {
			action: "get_posts",
			u_session: u_session
		}
		socket.send(JSON.stringify(data));
	}

	function getComments() {
		let u_session = localStorage.getItem('u_session');
		let data = {
			action: "get_comments",
			u_session: u_session
		}
		socket.send(JSON.stringify(data));
	}

	function getLDs() {
		let u_session = localStorage.getItem('u_session');
		let data = {
			action: "get_myLDs",
			u_session: u_session
		}
		socket.send(JSON.stringify(data));
	}

}); //document ready end