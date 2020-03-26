<?php
namespace Q\Core;

class Page
{
    public $ID;
    public $Title;
    public $Route;
    public $Content;
    public $Status;
    public $Created;
    public $Edited;

    public function Create()
    {
        $database = new Database();

        $result = $database->Insert("pages", [
            "title" => $this->Title,
            "route" => $this->Route,
            "content" => $this->Content,
            "status" => $this->Status
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
        $query = "
            SELECT p.id, p.title, p.route, p.content, ps.status, p.created, p.edited
            FROM pages p 
            JOIN page_status ps 
            ON p.status = ps.id
            WHERE p.id = $id
        ";

        $data = $database->query($query, true);

        $this->ID = $data["id"];
        $this->Title = $data["title"];
        $this->Route = $data["route"];
        $this->Content = $data["content"];
        $this->Status = $data["status"];
        $this->Created = $data["created"];
        $this->Edited = $data["edited"];
    }

    public function Update()
    {
        $database = new Database();
        
        $statusID = (int)$database->query("SELECT id FROM page_status WHERE status = " + $this->Status, true)['id'];
        $database->Close();

        $database = new Database();
        $ar = [
            "title" => $this->Title,
            "route" => $this->Route,
            "content" => $this->Content,
            "status" => $statusID
        ];

        $where = "id = " . $this->ID;

        $result = $database->Update("pages", $ar, $where);

        if($result)
            Response::SetResponse(200);
        else
            Response::SetResponse(500);
    }
    
    public static function Search($query)
    {
        $database = new Database();

        $q = "SELECT * FROM `pages` WHERE title LIKE '%$query%'";

        return $database->Query($q, false);
    }
}