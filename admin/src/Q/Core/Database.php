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

    public function GetLastInsertedID($table)
    {
        try
        {
            $sql_query = "SELECT max(id) as 'last_id' FROM $table";
            $query = $this->PDO->prepare($sql_query);
            $query->execute();
            return (int)$query->fetch(PDO::FETCH_ASSOC);
        }
        catch(PDOException $e)
        {
            if($this->debug)
                echo("Error: " . $e->message);

            return false;
        }
    }

    public function CountRows($sql_query) : int
    {
        try
        {
            //echo $sql_query;
            $query = $this->PDO->prepare($sql_query);
            $query->execute();
            return (int)$query->rowCount();
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
            // echo $sql;
            
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
            //echo $sql_query;
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
            // echo $sql_query;
            $con = $this->PDO;
            $query = $con->prepare($sql_query);
            // print_r($paramArray);
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

    public function Destroy($table, $where)
    {
        $sql = "DELETE FROM $table WHERE $where";
        //echo $sql;
        try
        { 
            $this->PDO->exec($sql);
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

    public function Close()
    {
        $this->PDO = NULL;
        return null;
    }
}