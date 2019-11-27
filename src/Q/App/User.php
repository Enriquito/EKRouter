<?php
namespace Q\App;

session_start();

use Q\Core\Database;
use Q\Core\Response;

class User
{
    public $ID;
    public $Username;
    public $Email;

    public function Login($email, $password)
    {
        $database = new Database();

        $email = $this->CheckInput($email);
        $password = $this->CheckInput($password);
        $countQuery = "SELECT email FROM users WHERE email = '$email'";
        
        if($database->CountRows($countQuery) == 1)
        {
            $userData = $database->Query("SELECT * FROM users WHERE email = '$email'", true);

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

    public function CheckLogin()
    {
        if(isset($_SESSION['UserID']))
        {
            Response::Json(
                [
                    "Code" => 1005,
                    "Messages" => "Session OK"
                ]
            , 200);
            return;
        }
    }
}