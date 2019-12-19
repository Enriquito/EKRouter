<?php
namespace Q\Core;

class Block
{
    public $ID;
    public $Name;
    public $Content;
    public $Edited;
    public $Created;

    public function Create()
    {
        $database = new Database();

        $result = $database->Insert("blocks", [
            "name" => $this->Name,
            "content" => $this->Content
        ]);
        
        if($result != false)
            return true;
        else
            return false;
    }

    public static function Destroy($id)
    {
        $database = new Database();

        $database->Destroy("blocks", "id = ". $id);
    }

    public static function GetAll()
    {
        $database = new Database();

        return $database->query("SELECT * FROM blocks");
    }

    public function Update()
    {
        $database = new Database();
        $ar = [
            "id" => $this->ID,
            "name" => $this->Name,
            "content" => $this->Content
        ];

        $where = "id = " . $this->ID;

        $result = $database->Update("blocks", $ar, $where);

        if($result)
            Response::SetResponse(200);
        else
            Response::SetResponse(500);
    }
}