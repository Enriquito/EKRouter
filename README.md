# Q API

Q API is a PHP library for routing and database opperations.

## Routings

```php
# Sample use of a GET request with a database call.
$app->Router->Get("/user/{id}", function($param) use(&$app){
    $data = $app->Database->Query("SELECT * FROM users WHERE ID = ". $param['id'],true);
    Response::Json(
       [
           "user" => $data, 
           "rows" => $app->Database->CountRows("SELECT * FROM users")
       ]
    );
});

# Sample use of a POST request with a database call.
$app->Router->Post("/user/{id}", function($param) use(&$app){
    $data = Request::GetJson();

    $success = $app->Database->Insert(
        "users",
        [
            "Username" => $data["Username"],
            "Password" => $data["Password"],
            "Image" => $data["Image"]
        ]
    );

    Response::Json(["ID" => $success]);
});
```
## License
