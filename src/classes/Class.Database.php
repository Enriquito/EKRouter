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
}