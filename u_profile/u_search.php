<?php
session_start();

    class SearchController{
        private $db;
        private $inp_errors = [];

        function __construct(){
            $this->db = new mysqli("localhost", "root", "", "social_network");

            if(isset($_POST)){
                switch ($_POST["action"]) {
                    case 'search':
                        $search_letter =  $_POST["name"];
                        // echo $search_letter;
                        if(empty($search_letter)){
                            return;
                        }
                        else{
                            $this->p_search($search_letter);
                        }
                        
                    break;
                }
            }
        }

        function p_search($search_letter){
            // echo $search_letter;
            $u_session = $_SESSION['u_session'];
            $search_results = $this -> db -> query("SELECT
                                                        NAME AS u_name,
                                                        surname AS u_surname,
                                                        email AS u_email,
                                                        photos.photo_path
                                                    FROM
                                                        users
                                                    INNER JOIN photos ON users.ID = photos.user_id
                                                    WHERE
                                                        NOT users.`session` = $u_session
                                                    AND NAME LIKE '$search_letter%'
                                                    AND photos.active = 1")->fetch_all(true);
            if(empty($search_results)){
                $this -> inp_errors["errors"] = "People not found";
                $inp_errors = json_encode($this -> inp_errors);
                echo $inp_errors;
            }
            else{
                $search_results = json_encode($search_results);
                echo $search_results;
            }
        }
    }

    $search = new SearchController;

?>