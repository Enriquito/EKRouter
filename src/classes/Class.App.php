<?php
include_once('src/classes/Class.Response.php');
include_once('src/classes/Class.Router.php');

class App
{
    public $Router = null;

    function __construct()
    {
        $this->Router = new Router();
    }

    function Run()
    {
        $this->Router->Run();
    }
}