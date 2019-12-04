<?php
namespace Q\Core;
use Q\App\Collection;

//include_once("src/Q/Core/User.php");
include_once("src/Q/App/Collection.php");

$route = $app->Router->Head("api/logout", function(){
    User::Logout();
});

$app->Router->Get("api/user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT id, username, email FROM users WHERE ID = ". $param['id'],true);

    Response::Json(
        [
            "user" => $data
        ]
    );
})->UseAuthentication(true);

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
    User::CheckLogin(true);
});

$app->Router->Post("api/check-password", function(){
    $data = Request::GetJson();
    $password = $data["password"];
    $usr = new User();
    $usr->DoesPasswordMeetRequierments($password);
});

$app->Router->Post("api/user/create", function(){
    $data = Request::GetJson();

    $user = new User();
    
    $user->Username = $data["user"]["username"];
    $user->Email = $data["user"]["email"];

    $result = $user->Create($data["user"]["password"]);

    if($result["code"] == 1010)
        Response::Json($result);
    else
        Response::Json($result);

})->UseAuthentication(true);

$app->Router->Post("api/collection/create", function(){
    $data = Request::GetJson();

    $collection = new Collection();

    $collection->Name = $data["collection"]["name"];
    $collection->Description = $data["collection"]["description"];
    $collection->Owner = $data["collection"]["owner"];

    if($collection->Create())
    {
        Response::Json([
            "code" => 000,
            "messages" => "Collection has been created"
        ], 201);
    }
})->UseAuthentication(true);;

$app->Router->Delete("api/collection/destroy/{id}", function($param){
    Collection::Destroy($param["id"]);
})->UseAuthentication(true);