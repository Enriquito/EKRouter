import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';

class Item extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);
        
        this.state = {
          Item : null,
          Changes : null
        };
    }

    componentDidMount(){
        this.getItem();
    }

    getItem(){
        fetch(`http://localhost/api/item/${this.props.match.params.id}`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Item : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }

    Save(){
      const name = document.getElementById("collection-name").value;
      const description = document.getElementById("collection-description").value;
      alert("test");

      fetch('http://localhost/api/collection', {
          method : "PUT",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              collection : {
                id : this.state.Collection.ID,
                name: name,
                description: description,
                owner : 14
              }
            }
          )
      })
      .then(function(data){
          if(data.status !== 200)
            alert("Error while updating page");
      })
      .catch(function(error){
        alert('error');
          this.setState(
              {
                  type : "error-messages",
                  messages : "Something went wrong..."
              });
      }.bind(this));
    }
    
    render() {  
        let properties = null;

        if(this.state.Item != null){

            properties = this.state.Item.Properties.map((el, index) => {
                let type = null;
                const value = el.Value;

                let inputField = null;

                if(el.Type === "textarea")
                inputField = <textarea 
                    id="collection-description" 
                    style={{width: "500px", height: "150px", resize: "vertical"}} 
                    onChange={() => {}}
                    defaultValue = {el.Value} 
                    ></textarea>
                else
                {
                    inputField = <input id="collection-name" defaultValue={value} style={{width: "500px"}} type={el.Type} placeholder="Collection name" />
                }

                return (
                    <div>
                        <label>{el.Name}</label>
                        <br />
                        {inputField}
                    </div>
                );
            });            
        }

      return (
        <main className="flex">
          <Navigation />
            <div id="holder">
                <div className="flex">
                    <h1 style={{marginTop: "0px"}}>Edit item</h1>
                    <button 
                    style={{width: "75px", height : "30px", padding : "0"}} 
                    className="theme-green-bg new-collection-button"
                    onClick={this.Save.bind(this)}
                    >Save</button>
                    <button 
                    style={{marginLeft : "0px", width: "75px", height : "30px", padding : "0"}} 
                    className="theme-red-bg new-collection-button"
                    onClick={() => {}}
                    >Delete</button>
                </div>
                {properties}
            </div>
        </main>
      );
    }
  }

export default Item;