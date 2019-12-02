<?php
namespace Q\Core;
include_once('Route.php');

class Router
{
    public $routes = [];

    public function GetQuery()
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
            $routeReplaced = preg_replace("/\{\w+\}/i", "([a-z0-9-]+)", $route->Route);
            $routeReplaced = str_replace("/", "\/", $routeReplaced);

            if(preg_match("/^". $routeReplaced ."$/i", $this->GetQuery()))
            {
                preg_match_all("/\{(\w+)\}/i", $route->Route, $matchesRouteVars);
                unset($matchesRouteVars[0]);

                preg_match_all('/(\w+)/', $this->GetQuery(), $queryRoute);
                unset($queryRoute[0]);

                $ar = [];

                $explodeRoute = explode("/", $route->Route);
                $explodeUrlQuery = explode("/", $this->GetQuery());

                for($i = 0; $i < count($explodeRoute) ; $i++)
                {
                    if(strpos($explodeRoute[$i], "{") !== FALSE)
                    {
                        preg_match("/\{(\w+)\}/", $explodeRoute[$i], $b);
                        $ar[$b[1]] = $explodeUrlQuery[$i];
                    }
                }

                if($_SERVER['REQUEST_METHOD'] == $route->Method)
                    $route->Callback($ar);

                $matchFound = true;
            }
        }

        if(!$matchFound)
        {
            Response::NotFound();
        }
    }

    public function Get($route, $callback)
    {
        $this->routes[] = new Route($route, $callback, "GET");
    }

    public function Post($route, $callback)
    {
        $this->routes[] = new Route($route, $callback, "POST");
    }

    public function Delete($route, $callback)
    {
        $this->routes[] = new Route($route, $callback, "DELETE");
    }
    public function Put($route, $callback)
    {
        $this->routes[] = new Route($route, $callback, "PUT");
    }

    public function Run()
    {
        $this->Match();
    }
}