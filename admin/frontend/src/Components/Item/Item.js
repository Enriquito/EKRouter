import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';

class Item extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);
        
        this.state = {
          Item : null
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
            window.location = `/dashboard`;
        });
    }

    Save(e){
      
      const title = document.getElementById('item-Title');

      if(!title.checkValidity())
        return;

        console.log(title);

      fetch('http://localhost/api/item', {
          method : "PUT",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              item : {
                id : this.state.Item.ID,
                collection : this.state.Item.Collection,
                created : this.state.Item.Created,
                creator : this.state.Item.Creator,
                properties : this.state.Item.Properties
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
      });

      e.preventDefault();
    }

    updateItem(event, index){
      const data = this.state.Item;

      data.Properties[index].Value = event.target.value;

      this.setState({
        Item : data
      });
    }

    delete(e){
      let r = window.confirm("Are you sure you want to delete this item?");

      if(!r)
          return;

      fetch(`http://localhost/api/item/destroy/${this.state.Item.ID}`, {
          method : 'DELETE'
      })
      .then((data) => {
        console.log(data);
          if(data.status === 200)
          {
            this.props.history.goBack();
          }
          else
          {
            alert("Error while deleting item");
            this.props.history.goBack();
          }
              
      })
      .catch((error) => {
          alert(error);
      });

      e.preventDefault();
  }
    
    render() {  
        let properties = null;

        if(this.state.Item != null){

            properties = this.state.Item.Properties.map((el, index) => {
                const value = el.Value;

                let inputField = null;

                if(el.Type === "textarea")
                inputField = <textarea
                    id={`item-${el.Name}`}
                    style={{width: "500px", height: "150px", resize: "vertical"}} 
                    defaultValue = {el.Value} 
                    onChange={(e) => {
                      this.updateItem(e, index)
                    }}
                    ></textarea>
                else
                {
                    if(el.Name === "Title"){
                      inputField = <input 
                      required={true}
                      id={`item-${el.Name}`} 
                      onChange={(e) => {
                        this.updateItem(e, index)
                      }}
                      defaultValue={value} 
                      style={{width: "500px"}} 
                      type={el.Type} 
                      placeholder="Enter your content here" />
                    }
                    else
                    {
                      inputField = <input 
                      id={`item-${el.Name}`} 
                      onChange={(e) => {
                        this.updateItem(e, index)
                      }}
                      defaultValue={value} 
                      style={{width: "500px"}} 
                      type={el.Type} 
                      placeholder="Enter your content here" />
                    }
                    
                }

                return (
                    <div key={el.Name}>
                        <label>{el.Name}</label>
                        <br />
                        {inputField}
                    </div>
                );
            });            
        }

      return (
        <main className="flex">
          <Navigation item="collections" />
            <form id="holder">
                <h1 style={{marginTop: "0px"}}>Edit item</h1>
                {properties}
                <div className="flex">

                    <button 
                    style={{width: "75px", height : "30px", padding : "0"}} 
                    className="theme-green-bg new-collection-button"
                    onClick={(e) => {
                      this.Save(e);
                    }}
                    >Save</button>

                    <button 
                    style={{marginLeft : "0px", width: "75px", height : "30px", padding : "0"}} 
                    className="theme-blue-bg new-collection-button"
                    onClick={this.props.history.goBack}
                    >Cancel</button>

                    <button 
                    style={{marginLeft : "0px", width: "75px", height : "30px", padding : "0"}} 
                    className="theme-red-bg new-collection-button"
                    onClick={(e) => {
                      this.delete(e)
                    }}
                    >Delete</button>
                </div>
            </form>
        </main>
      );
    }
  }

export default Item;