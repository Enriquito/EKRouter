<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once('src/classes/Class.App.php');

$app = new Q\Core\App();

include('src/workspace/Routes.php');

$app->Run();