<?php
namespace Q\Core;

class Request
{
    public static function GetJson()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
    public static function GetFiles()
    {
        return $_FILES['file'];
    }
}