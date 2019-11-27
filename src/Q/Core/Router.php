<?php
namespace Q\Core;

class Router
{
    private $routes = [];

    function __construct()
    {
        
    }

    private function GetQuery()
    {
        if(isset($_GET['q']))
            return $_GET['q'];
    }

    private function Match()
    {
        if(!isset($_GET['q']))
        {
            Response::NotFound();
            return;
        }

        $matchFound = false;

        foreach($this->routes as $route)
        {
            $routeReplaced = preg_replace("/\{\w+\}/i", "([a-z0-9-]+)", $route["route"]);
            $routeReplaced = str_replace("/", "\/", $routeReplaced);

            if(preg_match("/^". $routeReplaced ."$/i", $this->GetQuery()))
            {
                preg_match_all("/\{(\w+)\}/i", $route["route"], $matchesRouteVars);
                unset($matchesRouteVars[0]);

                preg_match_all('/(\w+)/', $this->GetQuery(), $queryRoute);
                unset($queryRoute[0]);

                $ar = [];

                $explodeRoute = explode("/", $route["route"]);
                $explodeUrlQuery = explode("/", $this->GetQuery());

                for($i = 0; $i < count($explodeRoute) ; $i++)
                {
                    if(strpos($explodeRoute[$i], "{") !== FALSE)
                    {
                        preg_match("/\{(\w+)\}/", $explodeRoute[$i], $b);
                        $ar[$b[1]] = $explodeUrlQuery[$i];
                    }
                }

                if($_SERVER['REQUEST_METHOD'] == $route["method"])
                    $route["callback"]($ar);

                $matchFound = true;
            }
        }

        if(!$matchFound)
        {
            Response::NotFound();
        }
    }

    public function Get($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "GET"];
    }

    public function Post($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "POST"];
    }

    public function Delete($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "DELETE"];
    }
    public function Put($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "PUT"];
    }

    public static function GetRequestType() : string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public function Run()
    {
        $this->Match();
    }
}