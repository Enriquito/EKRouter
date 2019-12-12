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

// Pages
$app->Router->Get("api/page/list/all", function(){
    Response::Json(Page::GetAll(), 200);
})->UseAuthentication(true);

$app->Router->Get("api/page/{id}", function($param){
    $page = new Page();
    $page->GetByID($param["id"]);

    Response::Json($page, 200);
})->UseAuthentication(true);

$app->Router->Put("api/page/{id}", function($param){
    $data = Request::GetJson();

    $page = new Page();
    $page->ID = $param["id"];
    $page->Title = $data["page"]["title"];
    $page->Route = $data["page"]["route"];
    $page->Content = $data["page"]["content"];
    $page->Status = $data["page"]["status"];

    $page->Update($param["id"]);

    Response::Json($page, 200);
})->UseAuthentication(true);

$app->Router->Post("api/page", function(){
    $data = Request::GetJson();

    $page = new Page();
    $page->Title = $data["page"]["title"];
    $page->Route = $data["page"]["route"];
    $page->Content = $data["page"]["content"];
    $page->Status = $data["page"]["status"];
    
    if($page->Create())
        Response::SetResponse(201);
    else
        Response::SetResponse(200);

})->UseAuthentication(true);

$app->Router->Delete("api/page/{id}", function($param){
    Page::Destroy($param["id"]);
})->UseAuthentication(true);

$app->Router->Get("api/pages/status", function() use(&$app){
    $status = $app->Database->Query("SELECT * FROM page_status");
    Response::Json($status, 200);
})->UseAuthentication(true);