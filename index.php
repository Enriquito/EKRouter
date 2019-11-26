<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once('src/Class.App.php');

$app = new App();

$app->Router->get("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
});

$app->Router->put("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
    echo "ik ben een put request";
});

$app->Run();