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
        });
    }

    Save(){
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
    }

    updateItem(event, index){
      const data = this.state.Item;

      data.Properties[index].Value = event.target.value;

      this.setState({
        Item : data
      });
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
            <div id="holder">
                <h1 style={{marginTop: "0px"}}>Edit item</h1>
                {properties}
                <div className="flex">
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
            </div>
        </main>
      );
    }
  }

export default Item;