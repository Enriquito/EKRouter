import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';
import './collections.css';

class Collections extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);

        this.state = {
          Collections: [],
          Changes : {
            Properties : null,
            Collection : {
              Name : null,
              Description : null
            }
          }
        };
    }

    componentDidMount(){
        this.loadCollections();
    }

    update(){
      if(this.state.Changes.Properties !== null){
        
      }
    }

    save(event){
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
    
    loadCollections(){
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
      let cols = null;

      if(this.state.Collections != null){
        cols = this.state.Collections.map((el) => {
          return(
            <tr key={el.ID}>
              <td>{el.Name}</td>
              <td>{el.Created}</td>
              <td>{el.ItemCount}</td>
              <td onClick={() => {document.location = `collection/edit/${el.Name.toLowerCase()}`}}><div className="gg-pen"></div></td>
              <td onClick={() => {document.location = `items/${el.Name.toLowerCase()}`}}><div className="gg-feed"></div></td>
            </tr>
            )
        });
      }

      return (
        <main className="flex">
          <Navigation />
          <div id="holder">
            <div className="flex">
              <h1 style={{marginTop: "0px"}}>Collections</h1>
              <button style={{width: "100px", height : "30px", marginLeft : "10px"}} className="theme-green-bg new-collection-button">New</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {cols}
              </tbody>
            </table>
          </div>
        </main>
      );
    }
  }

export default Collections;