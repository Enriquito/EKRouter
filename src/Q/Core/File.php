<?php
namespace Q\Core;

class File
{
    public $TargetDir = "sources/";
    public $MaxFileSize = 2000; // 2MB
    public $TargetFile;
    public $FileObject;
    private $ReadyForUpload = false;

    public function Prepare($file)
    {
        $passedChecks = true;
        $uploaded = true;

        $this->FileObject = $file;
        $this->TargetFile = $this->TargetDir . basename($file["name"]);
        $imageFileType = strtolower(pathinfo($this->TargetFile,PATHINFO_EXTENSION));
        $check = getimagesize($file["tmp_name"]);

        // print_r($file);
        // print_r($check);

        if($imageFileType != "jpg" && 
        $imageFileType != "png" && 
        $imageFileType != "jpeg"&&
        $imageFileType != "gif") 
            $passedChecks = false;
        
        if(!$check)
            $passedChecks = false;
            
        if(!$this->CheckFileSize($file['size']))
            $passedChecks = false;

        if($passedChecks)
        {
            $this->ReadyForUpload = true;
            if(move_uploaded_file($file["tmp_name"], $this->TargetFile))
                return true;
        }
        else 
            return false;
    }

    public function Upload() : bool
    {
        if(move_uploaded_file($this->FileObject["tmp_name"], $this->TargetFile))
            return true;
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