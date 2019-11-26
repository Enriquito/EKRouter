<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once('src/Class.App.php');

// $router = new Router();

// $router->get("/users/all/test/{werkt}", function($param){
//     echo "users func " . $param["werkt"];
// });

// $router->get("/user/{id}", function($param){
//     Response::Json(["userID" => $param['id']]);
//     echo $_SERVER['REQUEST_METHOD'];
// });

// $router->get("/user/{id}/frikando/naam/{naam}/info/lang/{taal}", function($param){
//     Response::Json(
//         [
//             "userID" => $param['id'], 
//             "taal" => $param["taal"]
//         ]
//     );
//     echo $_SERVER['REQUEST_METHOD'];
// });

// $router->put("/user/{id}", function($param){
//     Response::Json(["userID" => $param['id']]);
//     echo "ik ben een put request";
// });

//$router->Run();

$app = new App();

$app->Router->get("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
});

$app->Router->put("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
    echo "ik ben een put request";
});

$app->Run();