export function hasSession(){
    fetch("http://localhost/api/authenticate")
    .then((resp) => resp.json())
    .then((resp) => {
        if(resp.Code !== 1005){
          window.location = '/';
        }
    })
    .catch((error) => {
        window.location = '/';
    })
}

export function logout(){
    fetch("http://localhost/api/logout", {method : "HEAD"})
    .then((resp) => {
          window.location = '/';
    })
    .catch((error) => {
        window.location = '/';
    })
}