<?php
namespace Q\Core;


class App
{
    public $Router;
    public $Database = false;

    function __construct()
    {
        $this->Router = new Router();

        if(DB_USE == true)
            $this->Database = new Database();
    }

    private function LoadRoutes()
    {
        $app = $this;
        include_once("src/Q/Core/CoreRoutes.php");
        include_once(ROUTE_TABLE_LOCATION);
    }

    public function Run()
    {
        $this->LoadRoutes();
        $this->Router->Run();
    }
}