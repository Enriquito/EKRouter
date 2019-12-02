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
    echo "test";
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

$app->Router->Post("api/check-password", function(){
    $data = Request::GetJson();
    $password = $data["password"];
    $usr = new User();
    $usr->DoesPasswordMeetRequierments($password);
});

$app->Router->Post("api/user", function(){
    $data = Request::GetJson();
    
    if($data['action'] != "create")
        return;

    $user = new User();
    
    $user->Username = $data["user"]["username"];
    $user->Email = $data["user"]["email"];

    $result = $user->Create($data["user"]["password"]);

    if($result["code"] == 1010)
        Response::Json($result);
    else
        Response::Json($result);

});