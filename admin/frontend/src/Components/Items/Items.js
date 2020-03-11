import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';
import './items.css';

class Items extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);
        
        this.state = {
          Collection : null
        };
    }

    componentDidMount(){
        this.Load();
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
    
    Load(){
      fetch(`http://localhost/api/collection/${this.props.match.params.collection}`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collection : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }
    
    render() {

      let items = null;

      if(this.state.Collection != null){
        items = this.state.Collection.Items.map((el) => {
          let title = null;

          el.Properties.forEach(el => {
            if(el.Name === "Title")
              title = el.Value
          });

          return(
            <tr key={el.ID}>
              <td>{title}</td>
              <td></td>
              <td>{el.Created}</td>
              <td onClick={() => {document.location = `/item/edit/${el.ID.toLowerCase()}`}}><div className="gg-pen"></div></td>
            </tr>
            )
        });
      }
          
      return (
        <main className="flex">
          <Navigation item="collections" />
          <div id="holder">
          <div className="flex">
            <h1 style={{marginTop: "0px"}}>{this.props.match.params.collection} items</h1>
            <button 
            style={{width: "75px", height : "30px", padding : "0"}}
            onClick={() => {
              window.location = `/item/new/collection/${this.state.Collection.Name}`
            }}
            className="theme-green-bg new-collection-button">New</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          </div>
        </main>
      );
    }
  }

export default Items;