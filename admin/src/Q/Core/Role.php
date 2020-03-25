<?php
namespace Q\Core;

class Role
{
    public $ID;
    public $name;

    public static function GetAll()
    {
        $database = new Database();

        return $database->query("SELECT * FROM roles");;
    }
}