<?php
namespace Q\Core;

// Users
$route = $app->Router->Head("logout", function(){
    User::Logout();
});

$app->Router->Get("user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT id, username, email, first_name 
    as 'firstname', last_name as 'lastname', `role` FROM users WHERE ID = ". $param['id'],true);

    Response::Json(
        [
            "user" => $data
        ]
    );
})->UseAuthentication(true);

$app->Router->Get("user", function(){
    $user = User::Load($_SESSION['UserID']);

    if($user != null)
        Response::Json($user, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Post("create-password", function(){
    $password = Request::GetJson()["password"];
    Response::Json(["Password" => User::CreatePassword($password)]);
});

$app->Router->Post("login", function(){
    $data = Request::GetJson();
    $password = $data["password"];
    $username = $data["username"];

    $user = new User();
    $user->Login($username, $password);
});

$app->Router->Get("authenticate", function(){
    User::CheckLogin(true);
});

$app->Router->Post("check-password", function(){
    $data = Request::GetJson();
    $password = $data["password"];
    $usr = new User();
    $usr->DoesPasswordMeetRequierments($password);
});

$app->Router->Post("user", function(){
    $data = Request::GetJson();

    $user = new User();
    
    $user->Username = $data["user"]["username"];
    $user->Email = $data["user"]["email"];
    $user->Role = $data["user"]["role"];
    $user->FirstName = $data["user"]["firstname"];
    $user->LastName = $data["user"]["lastname"];

    $result = $user->Create($data["user"]["password"]);

    if($result)
        Response::SetResponse(201);
    else
        Response::SetResponse(406);

})->UseAuthentication(true);

$app->Router->Get("users/list", function(){
    $result = User::ListAll();

    if(count($result) > 0)
        Response::Json($result, 200);
    else
        Response::SetResponse(500);
});

$app->Router->Put("user/{id}", function($param){
    $data = Request::GetJson();

    $user = new User();
    $user->ID = $param['id'];
    $user->Email = $data["user"]["email"];
    $user->Role = $data["user"]["role"];
    $user->FirstName = $data["user"]["firstname"];
    $user->LastName = $data["user"]["lastname"];

    if($user->Update())
        Response::SetResponse(202);
    else
        Response::SetResponse(406);

})->UseAuthentication(true);

//Collections
$app->Router->Post("collection", function(){
    $data = Request::GetJson();

    $collection = new Collection();

    $collection->Name = $data["collection"]["name"];
    $collection->Description = $data["collection"]["description"];
    $collection->Owner = $_SESSION['UserID'];

    if($collection->Create())
    {
        Response::SetResponse(201);
    }
})->UseAuthentication(true);

$app->Router->Delete("collection/destroy/{id}", function($param){
    Collection::Destroy($param["id"]);
})->UseAuthentication(true);

$app->Router->Get("collection/list/all", function(){
    Response::Json(Collection::GetAll(), 200);
})->UseAuthentication(true);

$app->Router->Get("collection/{id}", function($param){
    Collection::Get($param["id"]);
})->UseAuthentication(true);

$app->Router->Put("collection", function(){
    $data = Request::GetJson();
    $database = new Database();

    $col = $database->query("SELECT id FROM collections WHERE id = " . $data["collection"]["id"]);

    if(count($col) < 1)
    {
        Response::SetResponse(404);
        return;
    }
    
    $collection = new Collection();

    $collection->ID = $data["collection"]["id"];
    $collection->Name = $data["collection"]["name"];
    $collection->Description = $data["collection"]["description"];
    $collection->Owner = $data["collection"]["owner"];

    $result = $collection->Update();

    if($result)
        Response::SetResponse(200);
    else
        Response::SetResponse(500);

})->UseAuthentication(true);

//Property
$app->Router->Get("property/{id}", function($param){
    $obj = Property::Get($param["id"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Post("property", function() use(&$app){
    $data = Request::GetJson();

    $property = new Property();

    $property->Name = $data["property"]["Name"];
    $property->Description = $data["property"]["Description"];
    $property->Collection = $data["property"]["Collection"];

    $tempType = $data["property"]["Type"];

    $property->Type = $app->Database->query("SELECT id FROM types WHERE `type` = '$tempType'", true)['id'];

    if($property->Create())
    {
        Response::Json([
            "code" => 000,
            "messages" => "Property has been created"
        ], 201);
    }
})->UseAuthentication(true);

$app->Router->Delete("property/destroy/{id}", function($param){
    $response = Property::Destroy($param["id"]);

    Response::SetResponse($response);
})->UseAuthentication(true);

$app->Router->Put("property", function() use(&$app){
    $data = Request::GetJson();

    $property = new Property();

    $property->ID = $data["property"]["id"];
    $property->Name = $data["property"]["name"];
    $property->Description = $data["property"]["description"];

    $database = new Database();
    $type = $data["property"]["type"];

    $data = $database->query("SELECT id FROM types WHERE `type` = '$type'" , true);

    $property->Type = $data['id'];

    if($property->Update())
        Response::SetResponse(200);
    else
        Response::SetResponse(500);
        
})->UseAuthentication(true);

//Items
$app->Router->Get("item/{id}", function($param){
    $obj = Item::Get($param["id"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Get("items/{collection}", function($param){
    $obj = Item::GetByCollection($param["collection"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Put("item", function(){
    $data = Request::GetJson();

    $item = new Item();
    $item->ID = $data["item"]["id"];
    $item->Collection = $data["item"]["collection"];
    $item->Creator = $_SESSION['UserID'];
    $item->Properties = $data["item"]["properties"];

    $result = $item->Update();

    if($result)
        Response::SetResponse(200);
    else
        Response::SetResponse(500);
})->UseAuthentication(true);

$app->Router->Post("item", function(){
    $data = Request::GetJson();

    $item = new Item();
    $item->Collection = $data["item"]["collection"];
    $item->Creator = $_SESSION['UserID'];

    $result = $item->Create($data["item"]["values"]);

    if($result)
        Response::SetResponse(201);
    else
        Response::SetResponse(500);
})->UseAuthentication(true);

$app->Router->Delete("item/destroy/{id}", function($param){
    

    if(Item::Destroy($param["id"]))
        Response::SetResponse(200);
    else
        Response::SetResponse(404);
})->UseAuthentication(true);

//Types
$app->Router->Get("type/all", function() use(&$app){
    $obj = $app->Database->query("SELECT * FROM types");

    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

//Roles
$app->Router->Get("role/all", function(){
    $obj = Role::GetAll();

    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

//Upload
$app->Router->Post("upload", function(){
    $data = Request::GetFiles();
    $file = new File();
    
    $messages = $file->Prepare($data);
    $result = $file->Upload();

    if($result['status'] == 201)
        Response::Json($result,201);
    else
    {
        Response::Json($messages,400);
    }
        
})->UseAuthentication(true);