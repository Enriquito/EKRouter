<?php

class Response
{
    public static function Json($data, $code = 200)
    {
        header('Content-Type: application/json');
        http_response_code($code);
        print json_encode($data);
    }

    public static function SetResponse($code)
    {
        http_response_code(404);
    }

    public static function NotFound()
    {
        http_response_code(404);
    }
}