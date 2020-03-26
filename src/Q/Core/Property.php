<?php
namespace Q\Core;

class Property
{
    public $ID;
    public $Name;
    public $Description;
    public $Collection;
    public $Type;
    public $Locked;

    public function Create()
    {
        try
        {
            $database = new Database();

            $result = $database->Insert("properties", [
                "name" => $this->Name,
                "description" => $this->Description,
                "collection" => $this->Collection,
                "type" => $this->Type
            ]);

            $itemIDs = $database->query("SELECT id FROM items WHERE `collection` = ". $this->Collection);
            
            foreach($itemIDs as $id)
            {
                $result = $database->Insert("property_values", [
                    "item" => $id['id'],
                    "property" => $result
                ]);
            }    

            return true;
        }
        catch(Exception $e)
        {
            return false;
        }            
    }

    public static function Destroy($id)
    {
        $database = new Database();

        $locked = $database->query("SELECT locked from properties WHERE id = $id", true)['locked'];
        if($locked != 1)
        {
            $database->Destroy("properties", "id = ". $id);
            return 200;
        }
        else if($locked == 1)
            return 400;
        else
            return 500;
            
    }

    public static function Get($id)
    {
        $database = new Database();
        $query = "SELECT col.id as 'collection_id', pro.id, pro.name, pro.description,ty.name as 'type', pro.locked FROM collections col
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
            $prop->Locked = $data["locked"];

            echo $prop->Locked;

            return $prop;
        }
        else
        {
            return null;
        }
        
    }

    public function Update()
    {
        $database = new Database();
        $result = $database->Update("properties", [
            "name" => $this->Name,
            "description" => $this->Description,
            "type" => $this->Type
        ], "id = " . $this->ID);

        return $result;
    }
}