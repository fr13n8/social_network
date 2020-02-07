<?php 


 class PostsController{
    private $db;
    public $data;
    public $callback;

    function __construct($data)
    {
        $this -> db = new mysqli("localhost", "root", "", "social_network");
        $this -> data = $data;

        if(isset($this -> data)){
            switch ($this -> data["action"]) {
                case 'get_posts':
                    $this->get_posts();
                break;
                case 'get_comments':
                    $this->get_comments();
                break;
                case 'get_frposts':
                    $this->get_frposts();
                break;
                case 'get_frcomments':
                    $this->get_frcomments();
                break;
                // case 'p_like':
                //     $this->post_like();
                // break;
                // case 'p_dislike':
                //     $this->post_dislike();
                // break;
            }
        }
    }

    function get_posts()
    {
        $u_session = $this -> data["u_session"];
        $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
        $id = $id[0]["ID"];

        $posts = $this -> db -> query("SELECT
                                        posts.post_description,
                                        posts.time,
                                        posts.picture,
                                        posts.ID,
                                        users.name,
                                        users.surname,
                                        photos.photo_path 
                                    FROM
                                        posts
                                        INNER JOIN users ON posts.user_id = users.ID
                                        INNER JOIN photos ON photos.user_id = users.ID 
                                    WHERE
                                        users.ID = $id
                                        AND	users.id = posts.user_id 
                                        AND photos.user_id = posts.user_id 
                                        AND photos.active = 1")->fetch_all(true);
        $posts["action"] = "posts_data";
        $posts = json_encode($posts);
        return $this -> callback = $posts;
    }

    
    function get_comments(){
        $u_session = $this -> data["u_session"];
        $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
        $id = $id[0]["ID"];

        $comments = $this -> db -> query("SELECT
                                            posts.ID AS post_id,
                                            users.name,
                                            users.surname,
                                            photos.photo_path,
                                            comments.comment,
                                            comments.time
                                        FROM
                                            posts
                                            INNER JOIN comments ON posts.ID = comments.post_id
                                            INNER JOIN users ON comments.user_id = users.ID
                                            INNER JOIN photos ON photos.user_id = users.ID 
                                        WHERE
                                            posts.ID IN ( SELECT posts.ID FROM posts WHERE posts.user_id = $id ) 
                                            AND posts.ID = comments.post_id 
                                            AND photos.active = 1")->fetch_all(true);
        $comments["action"] = "comments_data";
        $comments = json_encode($comments);
        return $this -> callback = $comments;
    }

    function get_frposts()
    {
        // echo $this -> data["fr_email"];
        $fr_email = $this -> data["fr_email"];
        // $id = $this -> db -> query("SELECT ID FROM users WHERE email = $fr_email")->fetch_all(true);
        // $id = $id[0]["ID"];

        $posts = $this -> db -> query("SELECT
                                        posts.post_description,
                                        posts.time,
                                        posts.picture,
                                        posts.ID,
                                        users.name,
                                        users.surname,
                                        photos.photo_path 
                                    FROM
                                        posts
                                        INNER JOIN users ON posts.user_id = users.ID
                                        INNER JOIN photos ON photos.user_id = users.ID 
                                    WHERE
                                        users.email = '$fr_email'
                                        AND	users.id = posts.user_id 
                                        AND photos.user_id = posts.user_id 
                                        AND photos.active = 1")->fetch_all(true);
        $posts["action"] = "frposts_data";
        $posts = json_encode($posts);
        return $this -> callback = $posts;
    }

    
    function get_frcomments(){
        $fr_email = $this -> data["fr_email"];
        $id = $this -> db -> query("SELECT ID FROM users WHERE email = '$fr_email'")->fetch_all(true);
        $id = $id[0]["ID"];

        $comments = $this -> db -> query("SELECT
                                            posts.ID AS post_id,
                                            users.name,
                                            users.surname,
                                            photos.photo_path,
                                            comments.comment,
                                            comments.time
                                        FROM
                                            posts
                                            INNER JOIN comments ON posts.ID = comments.post_id
                                            INNER JOIN users ON comments.user_id = users.ID
                                            INNER JOIN photos ON photos.user_id = users.ID 
                                        WHERE
                                            posts.ID IN ( SELECT posts.ID FROM posts WHERE posts.user_id = $id ) 
                                            AND posts.ID = comments.post_id 
                                            AND photos.active = 1")->fetch_all(true);
        $comments["action"] = "frcomments_data";
        $comments = json_encode($comments);
        return $this -> callback = $comments;
    }

    function post_like(){
        $u_session = $_SESSION['u_session'];
        $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
        $u_id = $u_id[0]["ID"];

        $post_id = $_POST["post_id"];
        $check_list = $this-> db -> query("SELECT user_id FROM post_likes WHERE user_id = '$u_id' AND post_id = '$post_id'")->fetch_all(true);
        // print_r($check_list);
        if(!empty($check_list)){
            $this->db->query("DELETE FROM post_likes WHERE user_id = $u_id AND post_id = $post_id");
        }
        else{
            $this->db->query("INSERT INTO post_likes(post_id, user_id) VALUES($post_id, $u_id)");
        }
        $like_data = $this -> db -> query("SELECT post_id, COUNT(*) 
                                            FROM post_likes
                                            WHERE post_id = $post_id
                                            GROUP BY post_id
                                            ")->fetch_all(true);
        if(!empty($like_data)){
            $like_data = json_encode($like_data);
            echo $like_data;
        }
    }

    function post_dislike(){
        $u_session = $_SESSION['u_session'];
        $u_id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
        $u_id = $u_id[0]["ID"];

        $post_id = $_POST["post_id"];
        $check_list = $this-> db -> query("SELECT user_id FROM post_dislikes WHERE user_id = '$u_id' AND post_id = '$post_id'")->fetch_all(true);
        if(!empty($check_list)){
            $this->db->query("DELETE FROM post_dislikes WHERE user_id = $u_id AND post_id = $post_id");
        }
        else{
            $this->db->query("INSERT INTO post_dislikes(post_id, user_id) VALUES($post_id, $u_id)");
        }
        $dislike_data = $this -> db -> query("SELECT post_id, COUNT(*) 
                                            FROM post_dislikes
                                            WHERE post_id = $post_id
                                            GROUP BY post_id
                                            ")->fetch_all(true);
        if(!empty($dislike_data)){
            $dislike_data = json_encode($dislike_data);
            echo $dislike_data;
        }
    }

    
 }


?>