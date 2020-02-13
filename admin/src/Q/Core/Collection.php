<?php
namespace Q\Core;

class Collection
{
    public $ID;
    public $Name;
    public $Description;
    public $Owner;
    public $Created;
    public $Items;
    public $Properties;

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

    public static function GetAll()
    {
        $database = new Database();

        return $database->query("SELECT * FROM collections");
    }

    public static function Get($id)
    {
        $database = new Database();

        $data = $database->query("SELECT * FROM collections WHERE id = $id");

        if(count($data) == 1)
        {
            $data = $data[0];

            $col = new Collection();

            $col->ID = $data["id"];
            $col->Name = $data["name"];
            $col->Description = $data["description"];
            $col->Owner = $data["owner"];
            $col->Created = $data["created"];

            $query = "SELECT pro.id, pro.name,pro.description ,ty.name as 'type' FROM properties pro
            JOIN types ty
            ON ty.id = pro.type
            WHERE pro.collection = " . $col->ID;

            $data = $database->query($query);

            foreach($data as $prop){
                $p = new Property();

                $p->ID = $prop["id"];
                $p->Name = $prop["name"];
                $p->Description = $prop["description"];
                $p->Collection = $col->ID;
                $p->Type = $prop["type"];

                $col->Properties[] = $p;
            }
        }

        return $col;
    }
}