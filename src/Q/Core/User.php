<?php
namespace Q\Core;

use Q\Core\Database;
use Q\Core\Response;

class User
{
    public $ID;
    public $Role;
    public $Username;
    public $FirstName;
    public $LastName;
    public $Email;
    public $Created;
    public $LastLogin;

    public function Login($username, $password)
    {
        $database = new Database();

        $username = $this->CheckInput($username);
        $password = $this->CheckInput($password);

        $countQuery = "SELECT email FROM users WHERE username = '$username'";
        
        if($database->CountRows($countQuery) == 1)
        {
            $userData = $database->Query("SELECT * FROM users WHERE username = '$username'", true);

            if(password_verify($password, $userData["password"]))
            {
                if((int)$userData["locked"] == 1)
                {
                    Response::SetResponse(423);
                    return;
                }
                else
                {
                    $_SESSION['UserID'] = $userData['id'];
                    $database->Query("Update users SET last_login = '".date('Y-m-d G:i:s')."' WHERE id = " . $userData["id"]);
                    $database->Close();
                    Response::SetResponse(202);
                    return;
                }
            }
        }
        else
        {
            Response::SetResponse(401);
        }
    }

    public function Update()
    {

        $database = new Database();

        $this->FirstName = $this->CheckInput($this->FirstName);
        $this->LastName = $this->CheckInput($this->LastName);

        $this->Email = $this->CheckInput($this->Email);
        $this->Email = strtolower($this->Email);

        $insertResult = $database->Update("users", [
            "email" => $this->Email,
            "first_name" => $this->FirstName,
            "last_name" => $this->LastName,
            "role" => $this->Role
        ], 'id = '. $this->ID);

        $database->Close();

        if($insertResult)
            return true;
        else
            return false;
    }

    public function ChangePassword($oldPassword, $newPassword)
    {
        if($this->Email != null && $_SESSION['UserID'] == $this->ID)
        {
            Response::Json(
                [
                    "Code" => 1003,
                    "Messages" => "Something went wrong, Please try again."
                ]
            );
            return;
        }

        $userData = $database->Query("SELECT * FROM users WHERE email = '" . $this->Email . "'", true);

        if(password_verify($oldPassword, $userData["password"]))
        {
            $updatedPassword = self::CreatePassword($newPassword);

            if($database->Update("users", ["password" => $updatedPassword], "WHERE email = '". $this->Email . "'"))
            {
                Response::Json(
                    [
                        "Code" => 1004,
                        "Messages" => "Password has been changed."
                    ]
                );
                return;
            }
            else
            Response::Json(
                [
                    "Code" => 1005,
                    "Messages" => "Password change has failed."
                ]
            );
            return;

            
        }
    }

    public static function CreatePassword($password)
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    private function CheckInput($data)
    {		
        $data = trim($data);
        $data = htmlspecialchars($data);
        $data = stripslashes($data);
        
        return $data;
    }

    public static function CheckLogin($useResponse = false)
    {
        if(isset($_SESSION['UserID']))
        {
            if($useResponse)
                Response::SetResponse(202);

            return true;
        }
        else
        {
            if($useResponse)
                Response::SetResponse(401);

            return false;
        }
    }

    public function Create($password)
    {
        $scucces = true;
        $failreason = [];
        $database = new Database();

        $this->Username = $this->CheckInput($this->Username);
        $this->Username = strtolower($this->Username);

        $this->Email = $this->CheckInput($this->Email);
        $this->Email = strtolower($this->Email);

        if(!$this->DoesPasswordMeetRequierments($password))
            $scucces = false;

        if($database->CountRows("SELECT * FROM users WHERE username = '". $this->Username . "'") == 1)
            $scucces = false;

        if($scucces)
        {
            $insertResult = $database->Insert("users", [
                "username" => $this->Username,
                "email" => $this->Email,
                "first_name" => $this->FirstName,
                "last_name" => $this->LastName,
                "password" => $this->CreatePassword($password),
                "role" => $this->Role
            ]);

            $database->Close();

            if(!$insertResult)
                $scucces = false;
            else
                $this->ID = $insertResult;
        }       

        if($scucces)
            return true;
        else
            return false;
        
    }

    public function DoesPasswordMeetRequierments($password)
    {
        $success = true;
        
        if(strlen($password) < 8)
        {
            $success = false;
        }

        if(strlen($password) > 50)
        {
            $success = false;
        }
            
        if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $password) == 0)
        {
            $success = false;
        }
        
        if($success)
            return true;
        else
            return false;
        
    }

    public static function Logout()
    {
        session_destroy();
    }

    public static function ListAll() : Array
    {
        $database = new Database();
        
        $result = $database->query("SELECT `id`, `username`, `last_login`, `created`, `email` FROM users");

        $ret = [];

        foreach($result as $user)
        {
            $u = new User();

            $u->ID = $user['id'];
            $u->Username = $user['username'];
            $u->Email = $user['email'];
            $u->Created = $user['created'];
            $u->LastLogin = $user['last_login'];

            $ret[] = $u;
        }

        return $ret;
    }

    public static function Load($id)
    {
        $database = new Database();
        $data = $database->Query("SELECT id, `role`,first_name, last_name , username, email, created, last_login FROM users WHERE id = $id",true);
        $role = $database->Query("SELECT id as 'ID', `name` as 'Name' FROM roles WHERE id = " . $data['role'],true);

        if(count($data) == null)
            return null;
        
        $user = new User();

        $user->ID = $data['id'];
        $user->Role = $role;
        $user->FirstName = $data['first_name'];
        $user->LastName = $data['last_name'];
        $user->Username = $data['username'];
        $user->Email = $data['email'];
        $user->Created = $data['created'];
        $user->LastLogin = $data['last_login'];

        return $user;
    }
}