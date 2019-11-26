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
        $matchFound = false;

        foreach($this->routes as $route)
        {
            //echo $route["route"];
            $routeReplaced = preg_replace("/\{\w+\}/i", "([a-z0-9-]+)", $route["route"]);
            $routeReplaced = str_replace("/", "\/", $routeReplaced);

            //echo $routeReplaced;

            if(preg_match("/^". $routeReplaced ."$/i", $this->GetQuery()))
            {
                preg_match_all("/\{(\w+)\}/i", $route["route"], $matchesRouteVars);
                unset($matchesRouteVars[0]);

                preg_match_all('/(\w+)/', $this->GetQuery(), $queryRoute);
                unset($queryRoute[0]);

                $ar = [];
                $i = 1;

                print_r($matchesRouteVars[1]);
                //print_r($queryRoute[1]);

                foreach($matchesRouteVars[1] as $match => $key)
                {
                    $ar[$key] = $queryRoute[1][$i];
                    $i = ($i + 2);
                }

                if($_SERVER['REQUEST_METHOD'] == $route["method"])
                    $route["callback"]($ar);

                $matchFound = true;
            }
        }

        if(!$matchFound)
        {
            Response::notFound();
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

$api->get("/users/all/test/{werkt}", function($param){
    echo "users func " . $param["werkt"];
});

$api->get("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
    echo $_SERVER['REQUEST_METHOD'];
});

$api->put("/user/{id}", function($param){
    Response::Json(["userID" => $param['id']]);
    echo "ik ben een put request";
});

$api->get("/user/{id}/update/{name}/lang/{taal}", function($param){
    //Response::json(["param" => $param);
    //echo $_SERVER['REQUEST_METHOD'];
    echo "Params: ";
    print_r($param);
});

$api->Run();