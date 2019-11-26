<?php

$app->Router->Get("/user/{id}", function($param) use(&$app){
    Response::Json(["userID" => $param['id']]);
    print_r($app->Database->Query("SELECT * FROM users"));
});

$app->Router->Put("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
    echo "ik ben een put request";
});