<?php
namespace Q\Core;

class Item
{
    public $ID;
    public $Properties = []; //array
    public $Collection;
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
        $database = new Database();

        $data = $database->query("SELECT * FROM items WHERE id = $id", true);

        if($data == null)
        {
            Response::NotFound();
            return;
        }

        $item = new Item();

        $item->ID = $data['id'];
        $item->Created = $data['created'];
        $item->Collection = $data['collection'];
        $item->Creator = $data['creator'];

        $query = "SELECT pr.name, pv.value, t.type FROM items i
        JOIN property_values pv
        ON i.id = pv.item
        JOIN properties pr
        ON pr.id = pv.property
        JOIN types t
        ON t.id = pr.type
        WHERE i.id = $id
        ORDER BY locked DESC
        ";

        $data = $database->query($query);

        if(count($data) > 0)
        {
            foreach($data as $d)
            {
                $ar = [
                    "Name" => $d['name'],
                    "Value" => $d['value'],
                    "Type" => $d['type']
                ];

                $item->Properties[] = $ar;
            }
        }

        return $item;
    }

    public static function GetByCollection($collection)
    {
        $database = new Database();

        $colID = $database->query("SELECT id FROM collections WHERE name = '$collection'", true)['id'];

        $data = $database->query("SELECT * FROM items WHERE `collection` = $colID");

        if($data == null)
        {
            Response::NotFound();
            return;
        }

        $items = [];

        foreach($data as $itemEl)
        {
            $item = new Item();

            $item->ID = $itemEl['id'];
            $item->Created = $itemEl['created'];
            $item->Creator = $itemEl['creator'];

            $query = "SELECT pr.name, pv.value, t.type FROM items i
            JOIN property_values pv
            ON i.id = pv.item
            JOIN properties pr
            ON pr.id = pv.property
            JOIN types t
            ON t.id = pr.type
            WHERE i.id = 
            ". $item->ID;

            $properties = $database->query($query);

            if(count($properties) > 0)
            {
                foreach($properties as $d)
                {
                    $ar = [
                        "Name" => $d['name'],
                        "Value" => $d['value'],
                        "Type" => $d['type']
                    ];

                    $item->Properties[] = $ar;
                }
            }

            $items[] = $item;
        }

        return $items;
    }

    public function Update()
    {
        $result = false;

        foreach($this->Properties as $prop)
        {
            $database = new Database();
            $name = $prop['Name'];
            $colID = $this->Collection;
            $propertyID = $database->query("SELECT id FROM properties WHERE `name` = '$name' AND `collection` = $colID", true)['id'];
            $result = $database->Update("property_values", ["value" => $prop['Value']], "item = " . $this->ID . " AND property = " . $propertyID);
        }

        return $result;
    }
}