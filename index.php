<?php
include_once('src/Class.Response.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class API
{
    private $routes = [];

    function __construct()
    {

    }

    private function GetQuery()
    {
        if(isset($_GET['q']))
        {
            return $_GET['q'];
        }
    }

    private function Match()
    {
        foreach($this->routes as $route)
        {
            $routeReplaced = preg_replace("/\{\w+\}/i", "([a-z0-9-]+)", $route["route"]);
            $routeReplaced = str_replace("/", "\/", $routeReplaced);

            if(preg_match("/^". $routeReplaced ."$/i", $this->GetQuery()))
            {
                // echo $routeReplaced . " " . $this->GetQuery();

                preg_match_all("/\{(\w+)\}/i", $route["route"], $matchesRouteVars);
                unset($matchesRouteVars[0]);

                preg_match_all('/(\w+)/', $this->GetQuery(), $queryRoute);
                unset($queryRoute[0]);

                $ar = [];
                $i = 0;

                foreach($matchesRouteVars[1] as $match => $key)
                {
                    $i++;
                    $ar[$key] = $queryRoute[1][$i];
                }

                //print_r($ar);

                if($_SERVER['REQUEST_METHOD'] == $route["method"])
                    $route["callback"]($ar);
            }
        }
    }

    public function get($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "GET"];
    }

    public function post($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "POST"];
    }

    public function delete($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "DELETE"];
    }
    public function put($route, $function)
    {
        $this->routes[] = ["route" => $route, "callback" => $function, "method" => "PUT"];
    }

    public function Run()
    {
        $this->Match();
    }
}

$api = new API();

$api->get("/users/all", function(){
    echo "users func";
});

$api->get("/user/{id}", function($param){
    Response::json(["userID" => $param['id']]);
    // echo $_SERVER['REQUEST_METHOD'];
});

$api->post("/user/{id}/update", function($param){
    //Response::json(["userID" => $param['id']]);
    echo $_SERVER['REQUEST_METHOD'];
});

$api->Run();