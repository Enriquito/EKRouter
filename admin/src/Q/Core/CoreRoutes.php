<?php
namespace Q\Core;

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

$app->Router->Get("api/authenticate", function(){
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

//Collections
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
})->UseAuthentication(true);

$app->Router->Delete("api/collection/destroy/{id}", function($param){
    Collection::Destroy($param["id"]);
})->UseAuthentication(true);

$app->Router->Get("api/collection/list/all", function(){
    Response::Json(Collection::GetAll(), 200);
})->UseAuthentication(true);

//blocks
$app->Router->Get("api/block/list/all", function(){
    Response::Json(Block::GetAll(), 200);
})->UseAuthentication(true);

$app->Router->Post("api/block", function(){
    $data = Request::GetJson();

    $block = new Block();
    $block->Name = $data["block"]["name"];
    $block->Content = $data["block"]["content"];
    $result = $block->Create();

    if($result != false)
        Response::Json(["id" => $result], 201);
    else
        Response::SetResponse(200);

})->UseAuthentication(true);

$app->Router->Put("api/block/{id}", function($param){
    $data = Request::GetJson();

    $block = new Block();
    $block->ID = $param["id"];
    $block->Name = $data["block"]["name"];
    $block->Content = $data["block"]["content"];

    $block->Update();

    Response::Json($block, 200);
})->UseAuthentication(true);

$app->Router->Get("api/block/{id}", function($param){
    Response::Json(Block::Get($param['id']), 200);
})->UseAuthentication(true);


$app->Router->Delete("api/block/{id}", function($param){
    Block::Destroy($param["id"]);
})->UseAuthentication(true);