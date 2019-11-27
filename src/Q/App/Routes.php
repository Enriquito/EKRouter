<?php
namespace Q\Core;
use Q\App\User;

include_once("src/Q/App/User.php");

$app->Router->Get("api/user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT id, email FROM users WHERE ID = ". $param['id'],true);
    Response::Json(
        [
            "user" => $data
        ]
    );
});

$app->Router->Post("api/create-password", function(){
    $password = Request::GetJson()["password"];
    Response::Json(["Password" => User::CreatePassword($password)]);
});

$app->Router->Post("api/login", function(){
    $data = Request::GetJson();
    $password = $data["password"];
    $email = $data["email"];

    $user = new User();
    $user->Login($email, $password);
});

$app->Router->Get("api/authenticate-check", function(){
    User::CheckLogin();
});