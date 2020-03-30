<?php
namespace Q\Core;

// Users
$route = $app->Router->Head("api/logout", function(){
    User::Logout();
});

$app->Router->Get("api/user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT id, username, email, first_name 
    as 'firstname', last_name as 'lastname', `role` FROM users WHERE ID = ". $param['id'],true);

    Response::Json(
        [
            "user" => $data
        ]
    );
})->UseAuthentication(true);

$app->Router->Get("api/user", function(){
    $user = User::Load($_SESSION['UserID']);

    if($user != null)
        Response::Json($user, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Post("api/create-password", function(){
    $password = Request::GetJson()["password"];
    Response::Json(["Password" => User::CreatePassword($password)]);
});

$app->Router->Post("api/login", function(){
    $data = Request::GetJson();
    $password = $data["password"];
    $username = $data["username"];

    $user = new User();
    $user->Login($username, $password);
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

$app->Router->Post("api/user", function(){
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

$app->Router->Get("api/users/list", function(){
    $result = User::ListAll();

    if(count($result) > 0)
        Response::Json($result, 200);
    else
        Response::SetResponse(500);
});

$app->Router->Put("api/user/{id}", function($param){
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
$app->Router->Post("api/collection", function(){
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

$app->Router->Delete("api/collection/destroy/{id}", function($param){
    Collection::Destroy($param["id"]);
})->UseAuthentication(true);

$app->Router->Get("api/collection/list/all", function(){
    Response::Json(Collection::GetAll(), 200);
})->UseAuthentication(true);

$app->Router->Get("api/collection/{id}", function($param){
    Collection::Get($param["id"]);
})->UseAuthentication(true);

$app->Router->Put("api/collection", function(){
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
$app->Router->Get("api/property/{id}", function($param){
    $obj = Property::Get($param["id"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Post("api/property", function() use(&$app){
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

$app->Router->Delete("api/property/destroy/{id}", function($param){
    $response = Property::Destroy($param["id"]);

    Response::SetResponse($response);
})->UseAuthentication(true);

$app->Router->Put("api/property", function() use(&$app){
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
$app->Router->Get("api/item/{id}", function($param){
    $obj = Item::Get($param["id"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Get("api/items/{collection}", function($param){
    $obj = Item::GetByCollection($param["collection"]);
    
    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

$app->Router->Put("api/item", function(){
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

$app->Router->Post("api/item", function(){
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

$app->Router->Delete("api/item/destroy/{id}", function($param){
    

    if(Item::Destroy($param["id"]))
        Response::SetResponse(200);
    else
        Response::SetResponse(404);
})->UseAuthentication(true);

//Types
$app->Router->Get("api/type/all", function() use(&$app){
    $obj = $app->Database->query("SELECT * FROM types");

    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

//Roles
$app->Router->Get("api/role/all", function(){
    $obj = Role::GetAll();

    if($obj != null)
        Response::Json($obj, 200);
    else
        Response::SetResponse(404);
    
})->UseAuthentication(true);

//Upload
$app->Router->Post("api/upload", function(){
    $data = Request::GetFiles();
    $file = new File();
    
    $result = $file->Prepare($data);
    $result = $file->Upload();

    if($result)
        Response::SetResponse(201);
    else
        Response::SetResponse(500);
})->UseAuthentication(true);