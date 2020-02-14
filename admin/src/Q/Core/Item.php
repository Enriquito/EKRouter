<?php
namespace Q\Core;

class Item
{
    public $ID;
    public $Properties = []; //array
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
        $item->Creator = $data['creator'];

        $query = "SELECT pr.name, pv.value, t.name as 'type' FROM items i
        JOIN propertie_values pv
        ON i.id = pv.item
        JOIN properties pr
        ON pr.id = pv.property
        JOIN types t
        ON t.id = pr.type
        WHERE i.id = $id
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
}