$(document).ready(function () {
    let socket = new WebSocket("ws://localhost:2346");

	socket.onopen = function(e) {
	  console.log("[open] Соединение установлено");
	  console.log("Отправляем данные на сервер");
		setTimeout(() => {
			getPosts();
			getComments();
			getLDs();
		}, 400);
	//   socket.send("Меня зовут Джон");
	};
	
	socket.onmessage = function(event) {
		let data = JSON.parse(event.data);
		// console.log(data)
		// let data = event.data;
		// console.log(`[message] Данные получены с сервера: ${data}`);
		// console.log(data);

		switch (data.action) {
			case "posts_data":
				console.log(data);
				$.each(data, function (indexInArray, element) {
					if(isNaN(indexInArray)){
						return;
					}
					else{
						let u_miniature = element["photo_path"] + "_min.jpg";
						let my_miniature = data.my_photo+"_min.jpg";
					var p_photo;
					if(element.picture){
						p_photo = `<img src="./u_profile/uploads/posts/${element.picture}.jpg" alt="">`;
					}
					else{
						p_photo = '';
					}
					$(".post_form1").after(`	<div class="central-meta item allposts" id="post_${element.ID}">
												<div class="user-post">
													<div class="friend-info">
														<figure>
															<img src="./u_profile/uploads/resized/${u_miniature}" alt="">
														</figure>
														<div class="friend-name">
															<ins><a href="#" class="get_fr" data-value="${element.email}" title="">${element.name} ${element.surname}</a></ins>
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
																	<img src="./u_profile/uploads/resized/${my_miniature}" alt="">
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
			case "allComments_data":
				// console.log(data);
				
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
			case 'allLDs':
				$(".allposts").find(".we-video-info").find("ins").html("0");
                    // console.log(data);
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
	
	$(document).on("click", '.get_fr', function(event){
		event.preventDefault();
		event.stopPropagation();
		let fr_email = $(this).data("value");
		localStorage.setItem('fr_email', fr_email);
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
    
    
	function getPosts(){
		let u_session = localStorage.getItem('u_session');
		let data = {
			action : "get_allPosts",
			u_session : u_session
		}
		socket.send(JSON.stringify(data));
	}

	function getComments(){
		let u_session = localStorage.getItem('u_session');
		let data = {
			action : "get_allComments",
			u_session : u_session
		}
		socket.send(JSON.stringify(data));
	}
	
	function getLDs(){
        let u_session = localStorage.getItem('u_session');
		let data = {
			action : "get_allLDs",
			u_session : u_session
		}
		socket.send(JSON.stringify(data));
    }
});