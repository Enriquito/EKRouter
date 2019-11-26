<?php
// Sample use of a GET request with a database call.
// $app->Router->Get("/user/{id}", function($param) use(&$app){
    // $data = $app->Database->Query("SELECT * FROM users WHERE ID = ". $param['id'],true);
    // Response::Json(["user" => $data]);
// });

$app->Router->Get("/user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT * FROM users WHERE ID = ". $param['id'],true);
    Response::Json(["user" => $data]);
});

$app->Router->Put("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
    echo "ik ben een put request";
});