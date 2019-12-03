<?php
namespace Q\App;
use Q\Core\Database;

// include_once('../Core/Database.php');

class Collection
{
    public $ID;
    public $Name;
    public $Description;
    public $Owner;
    public $Created;
    public $Items;

    public function Create()
    {
        $database = new Database();

        $result = $database->Insert("collections", [
            "id" => $this->ID,
            "name" => $this->Name,
            "description" => $this->Description,
            "owner" => $this->Owner
        ]);
        
        if($result != false)
            return true;
        else
            return false;
    }
}