import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';
import './collection.css';

class Collection extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);

        this.state = {
          Collection: null
        };
    }

    componentDidMount(){
        this.getCollection();
    }

    getCollection(){
        fetch(`http://localhost/api/collection/${this.props.match.params.name}`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collection : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }

    Save(event){
      const name = document.getElementById("collection-name").value;
      const description = document.getElementById("collection-description").value;

      fetch('http://localhost/api/collection', {
          method : "PUT",
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

    deleteProperty(id, arrayIndex){

        let r = window.confirm("Are you sure you want to delete this property?");

        if(r === false)
            return;

        const collection = this.state.Collection;
        collection.Properties.splice(arrayIndex, 1);

        fetch(`http://localhost/api/property/destroy/${id}`, {
          method : "DELETE",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
      .then(function(data){
          
          if(data.status === 200){
              this.setState({
                  Collection : collection
              });
          }
          else{
              alert("Error while deleting property");
          }
      }.bind(this))
    }

    createNewProperty(){
        const collection = this.state.Collection;
        const nameEl = document.getElementById("new-property-name");
        const descriptionEl = document.getElementById("new-property-description");
        const typeEl = document.getElementById("new-property-type");
        const id = parseInt(collection.Properties[(collection.Properties.length - 1)].ID) + 1;

        const prop = {
            "Collection" : this.state.Collection.ID,
            "Description" : descriptionEl.value,
            "ID" : id,
            "Name" : nameEl.value,
            "Type" : typeEl.value
        };

        collection.Properties.push(prop);

        this.setState({
            Collection : collection
        });

        fetch('http://localhost/api/property', {
          method : "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              property : {
                "collection" : this.state.Collection.ID,
                "description" : descriptionEl.value,
                "name" : nameEl.value,
                "type" : typeEl.value
              }
            }
          )
      })
      .then(function(data){
          if(data.status !== 201){
            alert("Error while updating page");
          }

        nameEl.value = "";
        descriptionEl.value = "";
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
        let colName = null;
        let colDescription = null;
        let properties = null;

        if(this.state.Collection != null){
            colName = this.state.Collection.Name;
            colDescription = this.state.Collection.Description;
            console.log(this.state.Collection.Description);

            properties = this.state.Collection.Properties.map((el, index) => {
                return (
                    <tr key={el.ID}>
                        <td><input defaultValue={el.Name} type="text" placeholder="Property name"/></td>
                        <td>
                            <select defaultValue={el.Type}>
                                <option value="Interger">Interger</option>
                                <option value="String">String</option>
                            </select>
                        </td>
                        <td><input defaultValue={el.Description} type="text" placeholder="Property description"/></td>
                        <td>
                            <button 
                            style={{width: "75px", height : "30px", padding : "0"}} 
                            className="theme-red-bg new-collection-button"
                            onClick={() => {this.deleteProperty(el.ID, index);}}
                            >Delete</button>
                        </td>
                    </tr>
                );
            });            
        }

      return (
        <main className="flex">
          <Navigation />
            <div id="holder">
                <h1>Edit Collection</h1>
                <h2 style={{margin: "10px 0"}}>Info</h2>
                <label>Name</label>
                <br />
                <input  defaultValue={colName} type="text" placeholder="Collection name" />
                <br />
                <label>Description</label>
                <br />
                <textarea onChange={() => {}} defaultValue={colDescription}></textarea>

                
                <h2 style={{margin: "10px 0"}}>Properties</h2>
                <div>
                    <div className="flex center">
                        <table>
                            <thead>
                                <tr>
                                    <td>Name</td>
                                    <td>Type</td>
                                    <td>Description</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input id="new-property-name" type="text" placeholder="Property name"/>
                                    </td>
                                    <td>
                                        <select id="new-property-type">
                                            <option value="String">String</option>
                                            <option value="Interger">Interger</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input id="new-property-description" type="text" placeholder="Property description"/>
                                    </td>
                                    <td>
                                        <button 
                                        style={{width: "75px", height : "30px", padding : "0"}} 
                                        className="theme-green-bg new-collection-button"
                                        onClick={() => {this.createNewProperty()}}
                                        >New</button>
                                        </td>
                                </tr>
                                {properties}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex">
                    <button 
                    style={{width: "75px", height : "30px", padding : "0"}} 
                    className="theme-green-bg new-collection-button"
                    onClick={() => {}}
                    >Save</button>
                    <button 
                    style={{width: "75px", height : "30px", padding : "0"}} 
                    className="theme-red-bg new-collection-button"
                    onClick={() => {}}
                    >Delete</button>
                </div>
                
            </div>
        </main>
      );
    }
  }

export default Collection;