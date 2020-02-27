import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';
import './items.css';

class Items extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);

        this.state = {
          
        };
    }

    componentDidMount(){
        
    }

    Save(event){
      const name = document.getElementById("collection-name").value;
      const description = document.getElementById("collection-description").value;

      fetch('http://localhost/api/collection/create', {
          method : "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              collection : {
                name: name,
                description: description,
                owner : 14
              }
            }
          )
      })
      .then(function(data){
          if(data.status === 201){
              alert("Collection has been created");
          }
          else{
              alert("Error while updating page");
          }
      })
      .catch(function(error){
        alert('error');
          this.setState(
              {
                  type : "error-messages",
                  messages : "Something went wrong..."
              });
      }.bind(this));

      event.preventDefault();
      
    }
    
    LoadItems(){
      fetch("http://localhost/api/collection/list/all")
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collections : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }
    
    render() {
          
      return (
        <main className="flex">
          <Navigation />
          <div id="holder">
            <h1>Items</h1>
            
            <table>
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Title</th>
                </tr>
              </thead>
            </table>
          </div>
        </main>
      );
    }
  }

export default Items;