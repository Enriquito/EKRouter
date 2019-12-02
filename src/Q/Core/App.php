<?php
namespace Q\Core;

class App
{
    public $Routes;
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
        include_once(ROUTE_TABLE_LOCATION);
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

            if(!$matchFound)
            {
                Response::NotFound();
            }
        }
    }

    public function Get($route, $callback)
    {
        //$this->routes[] = ["route" => $route, "callback" => $function, "method" => "GET"];
        $this->Routes[] = new Route($route, $callback);
    }

    public function Post($route, $callback)
    {
        //$this->routes[] = ["route" => $route, "callback" => $function, "method" => "POST"];
        $this->Routes[] = new Route($route, $callback);
    }

    public function Delete($route, $callback)
    {
        //$this->routes[] = ["route" => $route, "callback" => $function, "method" => "DELETE"];
        $this->Routes[] = new Route($route, $callback);
    }
    public function Put($route, $callback)
    {
        //$this->routes[] = ["route" => $route, "callback" => $function, "method" => "PUT"];
        $this->Routes[] = new Route($route, $callback);
    }

    public static function GetRequestType() : string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public function Run()
    {
        $this->LoadRoutes();
        $this->Match();
    }
}