<?php
class Database
{
    public $Debug = false;
    private $PDO = null;

    function __construct($debug = false)
    {
        $this->PDO = $this->Connect();
    }

    private function Connect()
    {		
        return new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset='.DB_CHARSET, DB_USERNAME, DB_PASSWORD);
    }

    public function Count_rows($sql_query)
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

    public function Query($sql)
    {
        try
        {
// 			echo $sql;
            
            $query = $this->PDO->prepare($sql);
            $query->execute();
            
            if(strpos($sql, "SELECT") !== false)
                return $query->fetchAll();
            else
                return true;
                
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
}