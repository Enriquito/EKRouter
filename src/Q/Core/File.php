<?php
namespace Q\Core;

class File
{
    public $TargetDir = "sources/uploads/";
    public $MaxFileSize = 2000; // 2MB
    public $TargetFile;
    public $FileObject;
    private $ReadyForUpload = false;

    public function __construct()
    {

    }

    public function SetUploadDir($uploadDir)
    {
        if($uploadDir != null)
            $this->TargetDir = $uploadDir;
    }

    public function Prepare($file) : array
    {
        $error = [];
        $passedChecks = true;
        $uploaded = true;

        $this->FileObject = $file;
        $this->TargetFile = $this->TargetDir . basename($file["name"]);
        $imageFileType = strtolower(pathinfo($this->TargetFile,PATHINFO_EXTENSION));
        $check = getimagesize($file["tmp_name"]);

        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif")
        {
            $passedChecks = false;
            $error = [
                "Status" => 400,
                "Errors" => ["File is not an image"]
            ];
        } 
            
        if(!$check)
        {
            $passedChecks = false;
            $error = [
                "Status" => 400,
                "Errors" => ["File is not an image"]
            ];
        } 
            
        if(!$this->CheckFileSize($file['size']))
        {
            $passedChecks = false;
            $error = [
                "Status" => 400,
                "Errors" => ["File is to large maxium of ". ($this->MaxFileSize / 1000) . "MB allowed"]
            ];
        } 

        if($passedChecks)
        {
            $this->ReadyForUpload = true;
            return $error;
        }
        else 
            return $error;
    }

    public function Upload() : bool
    {
        if($this->ReadyForUpload)
            if(move_uploaded_file($this->FileObject["tmp_name"], $this->TargetFile))
                return true;
            else
                return false;
        else
            return false;
    }

    private function CheckFileSize($size) : bool
    {
        if(($size / 1000) > $this->MaxFileSize)
            return false;
        else
            return true;
    }
    
}