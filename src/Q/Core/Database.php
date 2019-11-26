<?php
namespace Q\Core;
use PDO;

class Database
{
    public $Debug = false;
    private $PDO = null;

    function __construct()
    {
        if(DB_DEBUG)
            $this->Debug = true;
            
        $this->PDO = $this->Connect();
    }

    private function Connect()
    {		
        return new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset='.DB_CHARSET, DB_USERNAME, DB_PASSWORD);
    }

    public function CountRows($sql_query)
    {
        try
        {
            $query = $this->PDO->prepare($sql_query);
            $query->execute();
            return $query->rowCount();
        }
        catch(PDOException $e)
        {
            if($this->debug)
                echo("Error: " . $e->message);

            return false;
        }
    }

    public function Query($sql, $singleRow = false)
    {
        try
        { 
            $query = $this->PDO->prepare($sql);
            $query->execute();
            
            if(strpos($sql, "SELECT") !== false)
            {
                if($singleRow)
                    return $query->fetch(PDO::FETCH_ASSOC);
                else
                    return $query->fetchAll(PDO::FETCH_ASSOC);
            }  
            else
                return null;       
        }
        catch(PDOException $e)
        {
            if($this->debug)
                echo("Error: " . $e->message);

            return false;
        }
        finally
        {
            $query = null;
        }
    }

    /*
    * examples:
	* Database::update('Users',$ar,"Username = 'testa'");
	* $ar = {
	*	"FirstName" => "Hello",
	*	"LastName" => "World"
    * }
    */
    public function Update($table,$array,$where)
    {				
        $count = 0;
        $set = "";
        
        foreach($array as $key => $value)
        {	
            if($count == (count($array) - 1))
            {
                $set .= $key . "='". $value ."'";
            }
            else
            {
                $set .= $key . "='". $value ."',";
            }
            
            $count++;
        }
        
        $sql_query = "UPDATE $table SET $set WHERE $where";
        
        try
        {
            $query = $this->PDO->prepare($sql_query);
            $query->execute();
            return true;
        }
        catch(PDOException $e)
        {
            if($this->Debug)
                echo("Error: " . $e->message);

            return false;
        }
    }

    public function Insert($table,$array)
    {       
        $values = "";
        $keys = "";
        $count = 0;
        $paramArray = [];
        
        foreach($array as $key => $value)
        {	
            if($count == 0)
            {
                $paramArray[] = $value;
                $values .= "?,";
                $keys .= $key . ",";
            }
            else if($count == (count($array) - 1))
            {
                $paramArray[] = $value;
                $values .= "?";
                $keys .= $key;
            }
            else
            {
                $paramArray[] = $value;
                $values .= "?,";
                $keys .= $key . ",";
            }
            
            $count++;
        }
        
        try
        {
            $sql_query = "INSERT INTO $table ($keys) VALUES($values)";
            $con = $this->PDO;
            $query = $con->prepare($sql_query);
            $query->execute($paramArray);
            $stmt = $con->query("SELECT LAST_INSERT_ID()");
            $lastId = $stmt->fetch(PDO::FETCH_NUM);
            return $lastId[0];
        }
        catch(PDOException $e)
        {
            if($this->Debug)
                echo("Error: " . $e->message);
                
            return false;
        }       
    }
}