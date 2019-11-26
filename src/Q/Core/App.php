<?php
namespace Q\Core;

include_once('src/Settings.php');
// include_once('src/classes/Class.Response.php');
// include_once('src/classes/Class.Router.php');
// include_once('src/classes/Class.Database.php');

spl_autoload_register(function($class){
    require_once("src/" . $class . ".php");
});

class App
{
    public $Router = null;
    public $Database = false;

    function __construct()
    {
        $this->Router = new Router();

        if(DB_USE == true)
            $this->Database = new Database();
    }

    public function Run()
    {
        $this->Router->Run();
    }
}