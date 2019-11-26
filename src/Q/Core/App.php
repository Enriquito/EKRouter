<?php
namespace Q\Core;

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