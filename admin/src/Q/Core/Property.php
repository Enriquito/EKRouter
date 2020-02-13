<?php
namespace Q\Core;

class Property
{
    public $ID;
    public $Name;
    public $Description;
    public $Collection;
    public $Type;

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

    public static function Destroy($id)
    {
        $database = new Database();

        $database->Destroy("collections", "id = ". $id);
    }

    public static function Get($id)
    {
        $database = new Database();
        $query = "SELECT col.id as 'collection_id', pro.id, pro.name, pro.description,ty.name as 'type' FROM collections col
        JOIN properties pro
        ON col.id = pro.id
        JOIN types ty
        on ty.id = pro.id
        WHERE pro.id = $id";

        $prop = new Property();
        $data = $database->query($query);

        if(count($data) == 1)
        {
            $data = $data[0];
            $prop->ID = $data["id"];
            $prop->Name = $data["name"];
            $prop->Type = $data["type"];
            $prop->Description = $data["description"];
            $prop->Collection = $data["collection_id"];

            return $prop;
        }
        else
        {
            return null;
        }
        
    }
}