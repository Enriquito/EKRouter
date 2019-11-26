<?php

class Response
{
    private const Status = [
        200 => "OK",
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        500 => "Internal Server Error"
    ];

    public static function Json($data, $code = 200)
    {
        header('Content-Type: application/json');
        header("HTTP/1.1 " . $code . " " . self::Status[$code]);
        print json_encode($data);
    }

    public static function NotFound()
    {
        http_response_code(404);
    }
}