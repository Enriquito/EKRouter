import React from 'react';
import { hasSession } from '../Helpers';
import Properties from '../Properties';
import './collections.css';

class Collections extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);

        this.state = {
          Collections: [],
          NewCollectionWindowOpen : false,
          SelectedCollection : null
        };
    }

    componentDidMount(){
        this.LoadCollections();
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
    
    closeNewWindow(){
      this.setState({
        NewCollectionWindowOpen : false
      });
    }

    newWindow(){
      this.setState({
        NewCollectionWindowOpen : true
      });
    }

    LoadCollections(){
      fetch("http://localhost/api/collection/list/all")
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collections : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }

    LoadCollectionProperties(){
      
    }
    
    render() {
      let cols = null;

      if(this.state.Collections != null){
        cols = this.state.Collections.map((el, index) => {
          return(<li onClick={() => {this.setState({SelectedCollection : index});}} key={el.ID}>{el.Name}</li>)
        });
      }

      const colList = <ul id="collection-list">{cols}</ul>;

      let newCollectionWindow = null;

      if(this.state.NewCollectionWindowOpen)
      {
        newCollectionWindow = (
          <div className="flex center vertical-center" id="overlay">
            <form className="flex center vertical-center">
                <div id="input-holder">
                    <h2>New Collection</h2>
                    <input id="collection-name" type="text" placeholder="Collection name" />
                    <br />
                    <textarea id="collection-description"></textarea>
                    <br />
                    <div style={{width: "100%" ,padding: " 0 5px", "boxSizing": "border-box"}} className="flex center">
                        <button onClick={this.closeNewWindow.bind(this)} className="theme-red-bg">Cancel</button>
                        <button onClick={this.Save.bind(this)} className="theme-green-bg">Save</button>
                    </div>
                </div>  
            </form>
          </div>
        );
      }

      let propList = null;

      if(this.state.SelectedCollection != null){
        propList = (<Properties 
        id={this.state.SelectedCollection}
        CollectionID = {this.state.Collections[this.state.SelectedCollection].ID}
        />);
      }
    
      return (
            <div id="holder">
                <div style={{height: "100%"}} className='flex'>
                    <div id="collection-holder">
                        <div className="flex vertical-center">
                          <h3>Collections</h3>
                          <button 
                            className="theme-green-bg new-collection-button" 
                            onClick={this.newWindow.bind(this)}>New</button>
                        </div>
                        {newCollectionWindow}
                        {colList}
                    </div> 
                    <div id="type-holder">
                        {propList}
                    </div>
                </div>
            </div>
      );
    }
  }

export default Collections;