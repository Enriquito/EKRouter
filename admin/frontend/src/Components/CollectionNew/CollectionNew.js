import React from 'react';
import { hasSession, ReplaceSpaces } from '../Helpers';
import Navigation from '../Navigation';

class CollectionNew extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);

        this.state = {
          Collection : null
        };
    }

    componentDidMount(){

    }

    Save(e){
      e.preventDefault();
      const name = document.getElementById("collection-name");
      const description = document.getElementById("collection-description");

      if(!name.checkValidity())
        return;

      fetch('http://localhost/api/collection', {
          method : "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              collection : {
                name: name.value,
                description: description.value,
                owner : 14
              }
            }
          )
      })
      .then(function(data){
          if(data.status === 200)
          {
            window.location = `/collection/edit/${name.value}`;
          }
          else
            alert("Error while updating page");
      })
      .catch(function(error){
        alert('error');
      });
    }
  
    render() {  

      return (
        <main className="flex">
          <Navigation item="collections" />
            <form id="holder">
                <h1 style={{marginTop: "0px"}}>New Collection</h1>
                <label>Name</label>
                <br />
                <input id="collection-name" 
                 onChange={(e) => {
                  e.target.value = ReplaceSpaces(e.target.value, '-')
                }} 
                required={true}
                style={{width: "500px"}}  type="text" placeholder="Collection name" />
                <br />
                <label>Description</label>
                <br />
                <textarea id="collection-description" style={{width: "500px", height: "150px", resize: "vertical"}} onChange={() => {}} ></textarea>
                <div className="flex">
                    <button 
                    style={{width: "75px", height : "30px", padding : "0"}} 
                    className="theme-green-bg new-collection-button"
                    onClick={(e) => {
                      this.Save(e);
                    }}
                    type="submit"
                    >Save</button>
                  <button 
                  style={{marginLeft : "0px", width: "75px", height : "30px", padding : "0"}} 
                  className="theme-blue-bg new-collection-button"
                  onClick={this.props.history.goBack}
                  >Cancel</button>
                </div>
            </form>
        </main>
      );
    }
  }

export default CollectionNew;