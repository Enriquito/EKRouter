export function hasSession(){
    fetch("http://localhost/api/authenticate")
    .then((resp) => {
        if(resp.status !== 202){
          window.location = '/';
          alert("no session");
        }
    })
    .catch((error) => {
        window.location = '/';
    })
}

export const getUser = () => fetch("http://localhost/api/user")
.then((resp) => resp.json());

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