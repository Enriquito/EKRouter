<?php
namespace Q\Core;

// User stuff
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

$app->Router->Get("api/collection/{id}", function($param){
    Collection::Get($param["id"]);
})->UseAuthentication(true);

//Property
$app->Router->Get("api/property/{id}", function($param){
    $obj = Property::Get($param["id"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Post("api/property/create", function(){
    $data = Request::GetJson();

    $property = new Property();

    $property->Name = $data["property"]["name"];
    $property->Description = $data["property"]["description"];
    $property->Type = $data["property"]["type"];
    $property->Collection = $data["property"]["collection"];

    if($property->Create())
    {
        Response::Json([
            "code" => 000,
            "messages" => "Property has been created"
        ], 201);
    }
})->UseAuthentication(true);

$app->Router->Delete("api/property/destroy/{id}", function($param){
    Property::Destroy($param["id"]);
})->UseAuthentication(true);

//Items
$app->Router->Get("api/item/{id}", function($param){
    $obj = Item::Get($param["id"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);