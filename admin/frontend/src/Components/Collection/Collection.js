import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';
import './collection.css';

class Collection extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);

        this.state = {
          Collection : null,
          Changes : null,
          Types : null
        };
    }

    componentDidMount(){
        this.getCollection();
        this.getTypes();
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

    getTypes(){
        fetch(`http://localhost/api/type/all`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Types : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }

    Save(){
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
        let id = 0;

        if(this.state.Collection.Properties == null)
        {
            let col = this.state.Collection;
            col.Properties = [];

            this.setState({
                col
            });
        }

        try
        {
            id = parseInt(collection.Properties[(collection.Properties.length - 1)].ID) + 1;
        }
        catch
        {

        }
        

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
      });
    }
    
    render() {  
        let colName = null;
        let colDescription = null;
        let properties = null;
        let types = null;

        if(this.state.Types != null)
        {
            types = this.state.Types.map((el) => {
                return <option key={el.id} value={el.type}>{el.name}</option>
            });
        }

        if(this.state.Collection != null){
            colName = this.state.Collection.Name;
            colDescription = this.state.Collection.Description;
   
            properties = this.state.Collection.Properties.map((el, index) => {
                let status = null;

                if(parseInt(el.Locked) === 1)
                    status = <span className="gg-lock" />;
                else
                    status = <span className="gg-lock-unlock" />;

                return (
                    <tr key={el.ID}>
                        <td><input defaultValue={el.Name} type="text" placeholder="Property name"/></td>
                        <td>
                            <select defaultValue={el.Type}>
                                {types}
                            </select>
                        </td>
                        <td><input defaultValue={el.Description} type="text" placeholder="Property description"/></td>
                        <td>{status}</td>
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
                <div className="flex">
                    <h1 style={{marginTop: "0px"}}>Edit Collection</h1>
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
                <label>Name</label>
                <br />
                <input id="collection-name" style={{width: "500px"}} defaultValue={colName} type="text" placeholder="Collection name" />
                <br />
                <label>Description</label>
                <br />
                <textarea id="collection-description" style={{width: "500px", height: "150px", resize: "vertical"}} onChange={() => {}} defaultValue={colDescription}></textarea>

                
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
                                            {types}
                                        </select>
                                    </td>
                                    <td>
                                        <input id="new-property-description" type="text" placeholder="Property description"/>
                                    </td>
                                    <td></td>
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
            </div>
        </main>
      );
    }
  }

export default Collection;