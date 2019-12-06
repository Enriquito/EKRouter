<?php
namespace Q\Core;

class Page
{
    public $ID;
    public $Title;
    public $Content;
    public $Created;
    public $Edited;

    public function Create()
    {
        $database = new Database();

        $result = $database->Insert("pages", [
            "name" => $this->Title,
            "description" => $this->Content
        ]);
        
        if($result != false)
            return true;
        else
            return false;
    }

    public static function Destroy($id)
    {
        $database = new Database();

        $database->Destroy("pages", "id = ". $id);
    }

    public static function GetAll()
    {
        $database = new Database();

        return $database->query("SELECT * FROM pages");
    }

    public function GetByID($id)
    {
        $database = new Database();

        $data = $database->query("SELECT * FROM pages WHERE id = $id", true);

        $this->ID = $data["id"];
        $this->Title = $data["title"];
        $this->Content = $data["content"];
        $this->Created = $data["created"];
        $this->Edited = $data["edited"];
    }

    public function Update()
    {
        $database = new Database();
        $ar = [
            "title" => $this->Title,
            "content" => $this->Content
        ];

        $where = "id = " . $this->ID;

        $database->Update("pages", $ar, $where);
    }
}