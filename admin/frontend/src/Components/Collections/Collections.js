import React from 'react';
import { hasSession, formatDate, getUser } from '../Helpers';
import Navigation from '../Navigation';
import './collections.css';
import editIcon from '../../icons/edit.svg';
import listIcon from '../../icons/list.svg';
import Topbar from '../Topbar';

class Collections extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);

        this.state = {
          CurrentUser : null,
          Collections: [],
        };
    }

    componentDidMount(){
        this.loadCollections();

        getUser().then((resp) => {
          this.setState({CurrentUser : resp});
        });
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
          const date = formatDate(el.Created);
          return(
            <tr key={el.ID}>
              <td>{el.Name}</td>
              <td>{`${date.day}-${date.month}-${date.year}`}</td>
              <td>{el.ItemCount}</td>
              <td>{el.Owner}</td>
              <td className='flex'>
                <div onClick={() => {document.location = `collection/edit/${el.Name.toLowerCase()}`}}>
                  <img style={{height : "40px"}} src={editIcon} alt='Edit collection' />
                </div>
                <div onClick={() => {document.location = `items/${el.Name.toLowerCase()}`}}>
                  <img style={{height : "40px"}} src={listIcon} alt='List items' />
                </div>
                </td>
            </tr>
            )
        });
      }

      let bar = null;

      if(this.state.CurrentUser != null)
        bar = <Topbar user={this.state.CurrentUser}/>;

      return (
        <main>
          {bar}
          <div style={{height: "100%"}} className="flex">
            <Navigation item="collections" />
            <div id="holder">
              <div className="flex">
                <h1 style={{marginTop: "0px"}}>Collections</h1>
                <button onClick={() => {window.location = "/collection/new"}} style={{width: "100px", height : "30px", marginLeft : "10px"}} className="theme-green-bg new-collection-button">New</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Items</th>
                    <th>Created by</th>
                    <th>Actions</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cols}
                </tbody>
              </table>
            </div>
          </div>
        </main>  
      );
    }
  }

export default Collections;