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
                            "Messages" => "This account is locked."
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

    public static function CreatePassword($password)
    {
        print_r($_SESSION);

        if(isset($_SESSION['UserID']))
            echo "sessions";

        //return password_hash($password, PASSWORD_BCRYPT);
    }

    private function CheckInput($data)
    {		
        $data = trim($data);
        $data = htmlspecialchars($data);
        $data = stripslashes($data);
        
        return $data;
    }
}