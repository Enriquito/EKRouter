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
            "name" => str_replace(" ", "-", $this->Name),
            "content" => $this->Content
        ]);
        
        if($result != false)
            return $result;
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

    public static function Get($id)
    {
        $database = new Database();
        $data = $database->Query("SELECT * FROM blocks WHERE id = $id", true);

        $links = $database->Query("SELECT BL.page_id, P.title 
                                    FROM block_links BL
                                    JOIN pages P
                                    ON BL.page_id = P.id
                                    WHERE block_id = $id");

        $data["page_links"] = $links;

        return $data;
    }

    public function Update()
    {
        $database = new Database();
        $ar = [
            "id" => $this->ID,
            "name" => str_replace(" ", "-", $this->Name),
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