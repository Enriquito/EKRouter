<?php
namespace Q\Core;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once('src/Settings.php');
include_once('src/Q/Core/Response.php');
include_once('src/Q/Core/Router.php');
include_once('src/Q/Core/Database.php');
include_once('src/Q/Core/App.php');

$app = new App();

include_once('src/workspace/Routes.php');

$app->Run();

