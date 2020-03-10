<?php
namespace Q\Core;

class Collection
{
    public $ID;
    public $Name;
    public $Description;
    public $Owner;
    public $Created;
    public $Items = [];
    public $ItemCount;
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

        $data = $database->query("SELECT `id`, `name`, `created`, `owner` FROM collections");

        $ar = [];

        foreach($data as $col)
        {
            $collection = new Collection();
            $count = $database->query("SELECT COUNT(*) as 'item_count' FROM items WHERE `collection` = " . $col['id']);
            $user = $database->query("SELECT username FROM users WHERE id = " . $col['owner']);

            $collection->ID = $col['id'];
            $collection->Name = $col['name'];
            $collection->Created = $col['created'];
            $collection->ItemCount = $count[0]["item_count"];
            $collection->Owner = $user[0]["username"];

            $ar[] = $collection;
        }

        return $ar;
    }

    public static function Get($id, $returnArray = false)
    {
        $database = new Database();
        $data = null;

        if(is_int($id))
            $data = $database->query("SELECT * FROM collections WHERE id = $id", true);
        else
            $data = $database->query("SELECT * FROM collections WHERE `name` = '$id'", true);        

        if($data != null)
        {
            $col = new Collection();

            $col->ID = $data["id"];
            $col->Name = $data["name"];
            $col->Description = $data["description"];
            $col->Owner = $data["owner"];
            $col->Created = $data["created"];

            $query = "SELECT pro.id, pro.name,pro.description ,ty.name as 'type', pro.locked FROM properties pro
            JOIN types ty
            ON ty.id = pro.type
            WHERE pro.collection = " . $col->ID;

            $data = $database->query($query);

            if(count($data) > 0)
            {
                foreach($data as $prop)
                {
                    $p = new Property();
    
                    $p->ID = $prop["id"];
                    $p->Name = $prop["name"];
                    $p->Description = $prop["description"];
                    $p->Collection = $col->ID;
                    $p->Type = $prop["type"];
                    $p->Locked = $prop["locked"];
    
                    $col->Properties[] = $p;
                }
            }

            $query = "SELECT id FROM items WHERE collection = " . $col->ID;
            $data = $database->query($query);

            foreach($data as $it)
            {
                $item = Item::Get($it['id']);

                $col->Items[] = $item;
            }
            if($returnArray)
                return $col;
            else
                Response::Json($col, 200);    
        }
        else
        {
            Response::NotFound();
        }
    }

    public function Update()
    {
        $database = new Database();

        $result = $database->Update("collections", [
            "name" => $this->Name,
            "description" => $this->Description,
            "owner" => $this->Owner
        ], "id = " . $this->ID);

        if($result)
            return true;
        else
            return false;
    }
}