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
                case 'get_LDs':
                    $this->get_LDs();
                break;
                case 'get_myLDs':
                    $this->get_myLDs();
                break;
                case 'get_allPosts':
                    $this->get_allPosts();
                break;
                case 'get_allComments':
                    $this->get_allComments();
                break;
                case 'get_allLDs':
                    $this->get_allLDs();
                break;
                case 'del_post':
                    $this->del_post();
                break;
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
                                        users.email,
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

    function get_allPosts(){
        $u_session = $this -> data["u_session"];
        $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
        $id = $id[0]["ID"];

        $posts = $this -> db -> query("SELECT
                                            posts.post_description,
                                            posts.time,
                                            posts.picture,
                                            posts.ID,
                                            users.email,
                                            users.name,
                                            users.surname,
                                            photos.photo_path 
                                        FROM
                                            posts
                                            INNER JOIN users ON posts.user_id = users.ID
                                            INNER JOIN photos ON photos.user_id = users.ID 
                                        WHERE
                                            users.id = posts.user_id 
                                            AND photos.user_id = posts.user_id 
                                            AND photos.active = 1
                                            ORDER BY posts.time ASC")->fetch_all(true);
        $my_photo = $this -> db -> query("SELECT photo_path FROM photos WHERE user_id = $id AND active = 1") -> fetch_all(true);
        $posts["action"] = "posts_data";
        $posts["my_photo"] = $my_photo[0]["photo_path"];
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
                                            users.email,
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
                                            AND photos.active = 1
                                            ORDER BY comments.ID DESC")->fetch_all(true);
        $comments["action"] = "comments_data";
        $comments = json_encode($comments);
        return $this -> callback = $comments;
    }

    function get_allComments(){
        $u_session = $this -> data["u_session"];
        $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
        $id = $id[0]["ID"];

        $comments = $this -> db -> query("SELECT
                                            posts.ID AS post_id,
                                            users.name,
                                            users.surname,
                                            users.email,
                                            photos.photo_path,
                                            comments.comment,
                                            comments.time
                                        FROM
                                            posts
                                            INNER JOIN comments ON posts.ID = comments.post_id
                                            INNER JOIN users ON comments.user_id = users.ID
                                            INNER JOIN photos ON photos.user_id = users.ID 
                                        WHERE
                                            -- posts.ID IN ( SELECT posts.ID FROM posts WHERE posts.user_id = $id ) 
                                             posts.ID = comments.post_id 
                                            AND photos.active = 1
                                            ORDER BY comments.ID DESC")->fetch_all(true);
        $comments["action"] = "allComments_data";
        $comments = json_encode($comments);
        return $this -> callback = $comments;
    }

    function get_frposts()
    {
        $u_session = $this -> data["u_session"];
        $id = $this -> db -> query("SELECT ID FROM users WHERE session = $u_session")->fetch_all(true);
        $id = $id[0]["ID"];
        // echo $this -> data["fr_email"];
        $fr_email = $this -> data["fr_email"];
        // $id = $this -> db -> query("SELECT ID FROM users WHERE email = $fr_email")->fetch_all(true);
        // $id = $id[0]["ID"];

        $posts = $this -> db -> query("SELECT
                                        posts.post_description,
                                        posts.time,
                                        posts.picture,
                                        posts.ID,
                                        users.email,
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
        $my_photo = $this->db->query("SELECT photo_path FROM photos WHERE user_id = $id AND active = 1")->fetch_all(true);
        $posts["myphoto"] = $my_photo[0]["photo_path"];
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
                                            users.email,
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

    function get_LDs(){
        $fr_email = $this -> data["fr_email"];
        $likes = $this -> db -> query("SELECT
                                            post_id,
                                            COUNT(*) AS likes
                                        FROM
                                            post_likes
                                        WHERE
                                            post_id IN (
                                                SELECT
                                                    ID
                                                FROM
                                                    posts
                                                WHERE
                                                    user_id = (
                                                        SELECT
                                                            ID
                                                        FROM
                                                            users
                                                        WHERE
                                                            email = '$fr_email'
                                                    )
                                            )
                                        GROUP BY
                                            post_id")->fetch_all(true);
        $dislikes = $this -> db -> query("SELECT
                                                post_id,
                                                COUNT(*) AS dislikes
                                            FROM
                                                post_dislikes
                                            WHERE
                                                post_id IN (
                                                    SELECT
                                                        ID
                                                    FROM
                                                        posts
                                                    WHERE
                                                        user_id = (
                                                            SELECT
                                                                ID
                                                            FROM
                                                                users
                                                            WHERE
                                                                email = '$fr_email'
                                                        )
                                                )
                                            GROUP BY
                                                post_id")->fetch_all(true);
        $LDs_data["likes"] = $likes;
        $LDs_data["dislikes"] = $dislikes;
        $LDs_data["action"] = "LDs";
        $LDs_data = json_encode($LDs_data);
        $this -> callback = $LDs_data;
    }

    function get_allLDs(){
        // $fr_email = $this -> data["fr_email"];
        $likes = $this -> db -> query("SELECT
                                            post_id,
                                            COUNT(*) AS likes
                                        FROM
                                            post_likes
                                        
                                        GROUP BY post_id")->fetch_all(true);
        $dislikes = $this -> db -> query("SELECT
                                                post_id,
                                                COUNT(*) AS dislikes
                                            FROM
                                                post_dislikes
                                            
                                            GROUP BY
                                                post_id")->fetch_all(true);
        $LDs_data["likes"] = $likes;
        $LDs_data["dislikes"] = $dislikes;
        $LDs_data["action"] = "allLDs";
        $LDs_data = json_encode($LDs_data);
        $this -> callback = $LDs_data;
    }

    function get_myLDs(){
        $u_session = $this -> data["u_session"];
        $email = $this -> db -> query("SELECT email FROM users WHERE session = $u_session")->fetch_all(true);
        $email = $email[0]["email"];
        $likes = $this -> db -> query("SELECT
                                            post_id,
                                            COUNT(*) AS likes
                                        FROM
                                            post_likes
                                        WHERE
                                            post_id IN (
                                                SELECT
                                                    ID
                                                FROM
                                                    posts
                                                WHERE
                                                    user_id = (
                                                        SELECT
                                                            ID
                                                        FROM
                                                            users
                                                        WHERE
                                                            email = '$email'
                                                    )
                                            )
                                        GROUP BY
                                            post_id")->fetch_all(true);
        $dislikes = $this -> db -> query("SELECT
                                                post_id,
                                                COUNT(*) AS dislikes
                                            FROM
                                                post_dislikes
                                            WHERE
                                                post_id IN (
                                                    SELECT
                                                        ID
                                                    FROM
                                                        posts
                                                    WHERE
                                                        user_id = (
                                                            SELECT
                                                                ID
                                                            FROM
                                                                users
                                                            WHERE
                                                                email = '$email'
                                                        )
                                                )
                                            GROUP BY
                                                post_id")->fetch_all(true);
        $LDs_data["likes"] = $likes;
        $LDs_data["dislikes"] = $dislikes;
        $LDs_data["action"] = "myLDs";
        $LDs_data = json_encode($LDs_data);
        $this -> callback = $LDs_data;
    }

    function del_post(){
        $post_id = $this -> data["post_id"];
        $this -> db -> query("DELETE FROM posts WHERE ID = $post_id");
    }
    
 }


?>