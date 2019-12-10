<?php
namespace Q\Core;
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
session_regenerate_id();

include_once('src/Settings.php');
include_once('src/Q/Core/User.php');
include_once('src/Q/Core/Request.php');
include_once('src/Q/Core/Response.php');
include_once('src/Q/Core/Route.php');
include_once('src/Q/Core/Router.php');
include_once("src/Q/Core/Collection.php");
include_once("src/Q/Core/Page.php");
include_once('src/Q/Core/Database.php');
include_once('src/Q/Core/App.php');

$app = new App();

$app->Run();