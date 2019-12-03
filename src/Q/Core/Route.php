<?php
namespace Q\Core;

class Route
{
    public $Route;
    public $callback;
    public $Method;
    public $AuthenticationRequierd = false;

    function __construct($route, $callback, $method)
    {
        $this->Route = $route;
        $this->callback[] = $callback;
        $this->Method = $method;
    }

    public function Callback($ar)
    {
        $this->callback[0]($ar);
    }

    public function UseAuthentication($bool)
    {
        $this->AuthenticationRequierd = $bool;
    }
}