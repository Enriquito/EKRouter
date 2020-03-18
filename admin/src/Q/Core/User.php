<?php
namespace Q\Core;

use Q\Core\Database;
use Q\Core\Response;

class User
{
    public $ID;
    public $Username;
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
                    Response::Json(
                        [
                            "Code" => 1002,
                            "Messages" => "This account is locked. Please conntact support for more information."
                        ]
                    );
                    return;
                }
                else
                {
                    $_SESSION['UserID'] = $userData['id'];
                    $database->Query("Update users SET last_login = '".date('Y-m-d G:i:s')."' WHERE id = " . $userData["id"]);
                    $database->Close();
                    Response::Json(
                        [
                            "Code" => 1001,
                            "Messages" => "Login successfull"
                        ]
                    );
                    return;
                }
            }
        }

        Response::Json(
            [
                "Code" => 100,
                "Messages" => "Your password or email is incorrect."
            ]
        );

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
            {
                Response::Json(
                    [
                        "Code" => 1005,
                        "Messages" => "Session OK."
                    ]
                , 200);
            }
            
            return true;
        }
        else
        {
            if(!$useResponse)
            {
                Response::Json(
                    [
                        "Code" => 1006,
                        "Messages" => "Not Logged in."
                    ]
                , 401);
            }
            
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
        {
            $scucces = false;
            $failreason[] = "Password does not meet the requierments.";
        }

        if($scucces && $database->CountRows("SELECT * FROM users WHERE username = '". $this->Username . "'") == 1)
        {
            $scucces = false;
            $failreason[] = "Username already exists.";
        }

        if($scucces)
        {
            $insertResult = $database->Insert("users", [
                "username" => $this->Username,
                "email" => $this->Email,
                "password" => $this->CreatePassword($password)
            ]);

            $database->Close();

            if(!$insertResult)
            {
                $scucces = false;
                $failreason[] = "Error while creating account. Please try again.";
            }
            else
            {
                $this->ID = $insertResult;
            }
        }       
                   

        if($scucces != false)
            return ["code" => "1010", "messages" => "Account creation succesfull"];
        else
            return ["code" => "1011", "messages" => "Account creation failed", "errors" => $failreason];
        
    }

    public function DoesPasswordMeetRequierments($password)
    {
        $success = true;
        //$failedOn = [];
        
        if(strlen($password) < 8)
        {
            $success = false;
            //$failedOn[] = "Password is to short. Minimal 8 characters requierd.";
        }

        if(strlen($password) > 50)
        {
            $success = false;
            //$failedOn[] = "Password is to long. Password cannot be longer then 50 characters.";
        }
            
        if(preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $password) == 0)
        {
            $success = false;
            //$failedOn[] = "Password does not contain any special characters";
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
}