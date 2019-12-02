<?php
namespace Q\Core;

class Route
{
    public $Route;
    public $Callback;
    public $Method;

    function __construct($route, $callback)
    {
        $this->Route = $route;
        $this->Callback = $callback;
    }

    public function Get()
    {
        $this->Method = "GET";
    }

    public function Post()
    {
        $this->Method = "Post";
    }

    public function Put()
    {
        $this->Method = "PUT";
    }

    public function Delete()
    {
        $this->Method = "DELETE";
    }
}