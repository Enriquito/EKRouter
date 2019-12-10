import { func } from "prop-types";

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
        alert(error);
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