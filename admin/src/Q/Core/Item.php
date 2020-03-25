<?php
namespace Q\Core;

class Item
{
    public $ID;
    public $Properties = []; //array
    public $Collection;
    public $Created;
    public $Creator;

    public function Create($values)
    {
        try
        {
            $database = new Database();

            $result = $database->Insert("items", [
                "collection" => $this->Collection,
                "creator" => $this->Creator
            ]);
            
            foreach($values as $prop)
            {
                $database->Insert("property_values", [
                    "item" => $result,
                    "property" => $prop['property'],
                    "value" => $prop['value']
                ]);
            } 
            
            return true;
        }
        catch(Exception $e)
        {
            $this->Destroy($result);
            return false;
        }
        
    }

    public static function Destroy($id)
    {
        $database = new Database();

        $result = $database->Destroy("items", "id = ". $id);

        return $result;
    }

    public static function Get($id)
    {
        $database = new Database();
        $query = "SELECT I.id, I.collection, I.created , U.username
        FROM items I
        JOIN users U
        ON I.creator = U.id
        WHERE I.id = $id";

        $data = $database->query($query, true);

        if($data == null)
        {
            Response::NotFound();
            return;
        }

        $item = new Item();

        $item->ID = $data['id'];
        $item->Created = $data['created'];
        $item->Collection = $data['collection'];
        $item->Creator = $data['username'];

        $query = "SELECT pr.id, pr.name, pv.value, t.type FROM items i
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
                    "ID" => $d['id'],
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

        $query = "SELECT I.id, I.collection, I.created , U.username
        FROM items I
        JOIN users U
        ON I.creator = U.id
        WHERE I.collection = $colID";

        $data = $database->query($query);

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
            $item->Creator = $itemEl['username'];
            $item->Collection = $colID;

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
            $name = $prop['name'];
            $colID = $this->Collection;
            $propertyID = $database->query("SELECT id FROM properties WHERE `name` = '$name' AND `collection` = $colID", true)['id'];
            $result = $database->Update("property_values", ["value" => $prop['value']], "item = " . $this->ID . " AND property = " . $propertyID);
        }

        return $result;
    }
}