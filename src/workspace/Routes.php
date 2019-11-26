<?php

$app->Router->Get("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
});

$app->Router->Put("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
    echo "ik ben een put request";
});