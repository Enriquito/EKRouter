<?php
namespace Q\Core;
use Q\App\User;

include_once("src/Q/App/User.php");

/*
Sample use of a GET request with a database call.
$app->Router->Get("/user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT * FROM users WHERE ID = ". $param['id'],true);
    Response::Json(
       [
           "user" => $data, 
           "rows" => $app->Database->CountRows("SELECT * FROM users")
       ]
    );
});
*/

/*
Sample use of a POST request with a database call.
$app->Router->Post("/user/{id}", function($param) use(&$app){
    $data = Request::GetJson();

    $success = $app->Database->Insert(
        "users",
        [
            "Username" => $data["Username"],
            "Password" => $data["Password"],
            "Image" => $data["Image"]
        ]
    );

    Response::Json(["ID" => $success]);
});
*/

$app->Router->Get("user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT * FROM users WHERE ID = ". $param['id'],true);
    Response::Json(
        [
            "user" => $data, 
            "rows" => $app->Database->CountRows("SELECT * FROM users")
        ]
    );
});

$app->Router->Post("/user/{id}", function($param) use(&$app){
    $data = Request::GetJson();

    /*
    $success = $app->Database->Insert(
        "users",
        [
            "Username" => $data["Username"],
            "Password" => $data["Password"],
            "Image" => $data["Image"]
        ]
    );
    */
    Response::Json($data, 201);
});

$app->Router->Post("create-password", function(){
    $password = Request::GetJson()["password"];
    Response::Json(["Password" => User::CreatePassword($password)]);
});

$app->Router->Post("login", function(){
    $data = Request::GetJson();
    $password = $data["password"];
    $email = $data["email"];

    $user = new User();
    $user->Login($email, $password);
});
