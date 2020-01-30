<?php
namespace Q\Core;

class Request
{
    public static function GetJson()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
}