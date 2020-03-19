export function hasSession(){
    fetch("http://localhost/api/authenticate")
    .then((resp) => resp.json())
    .then((resp) => {
        if(resp.Code !== 1005){
          window.location = '/';
          alert("no session");
        }
    })
    .catch((error) => {
        window.location = '/';
    })
}

export function getUser(){
    fetch("http://localhost/api/user/current")
    .then((resp) => resp.json())
    .then((resp) => {
        if(resp.Code === 200){
         return resp;
        }
    })
    .catch((error) => {
        console.warn('Could not fetch user data');
    })
}

export function logout(){
    fetch("http://localhost/api/logout", {
        method : "HEAD"
    })
    .then((resp) => {
          window.location = '/';
    })
    .catch((error) => {
        window.location = '/';
    })
}

export function formatDate(date){
    const t = date.split(/[- :]/);

    return {
        year : t[0],
        month : t[1],
        day : t[2],
        hour : t[3],
        minutes : t[4],
        seconds : t[5]
    }
}

export function ReplaceSpaces(input, replacement){
    return input.split(' ').join(replacement);
}