<?php
namespace Q\Core;

class Item
{
    public $ID;
    public $Name;
    public $Value;
    public $Type;
    public $Created;
    public $Creator;

    public function Create()
    {
        // $database = new Database();

        // $result = $database->Insert("collections", [
        //     "id" => $this->ID,
        //     "name" => $this->Name,
        //     "description" => $this->Description,
        //     "owner" => $this->Owner
        // ]);
        
        // if($result != false)
        //     return true;
        // else
        //     return false;
    }

    public static function Destroy($id)
    {
        $database = new Database();

        $database->Destroy("items", "id = ". $id);
    }

    public static function Get($id)
    {
        //Afmaken
        // SELECT i.id, pr.name, pv.value, t.name as 'type', i.created, i.creator FROM items i
        // JOIN propertie_values pv
        // ON i.id = pv.item
        // JOIN properties pr
        // ON pr.id = pv.property
        // JOIN types t
        // ON t.id = pr.type
        // GROUP BY i.collection = 1
        $database = new Database();

        $data = $database->query("SELECT * FROM items WHERE id = $id");

        if(count($data) == 1)
        {
            $data = $data[0];

            $col = new Item();

            $col->ID = $data["id"];
            $col->Name = $data["name"];
            $col->Description = $data["description"];
            $col->Owner = $data["owner"];
            $col->Created = $data["created"];

        }

        return $col;
    }
}