import React from 'react';
import { hasSession } from '../Helpers';
import Navigation from '../Navigation';

class ItemNew extends React.Component {
    constructor(props){
        hasSession(false);
        super(props);
        this.Item = [];
        
        this.state = {
            Collection : null
        };
    }

    componentDidMount(){
        this.Load();
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


    Save(){
      fetch('http://localhost/api/item', {
          method : "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              item : {
                collection : this.state.Collection.ID,
                creator : 14,
                values : this.Item
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

    update(event, index, id){        
        this.Item.forEach((el) => {
            // eslint-disable-next-line
            if(el.property == id){
                el.value =  event.target.value
            }
        });
    }
    
    render() {  
        let properties = null;

        if(this.state.Collection != null){

            properties = this.state.Collection.Properties.map((el, index) => {
                this.Item.push({
                    property : el.ID,
                    value : ""
                });
                let inputField = null;

                if(el.Type === "textarea")
                inputField = <textarea
                    id={`item-${el.Name}`}
                    style={{width: "500px", height: "150px", resize: "vertical"}} 
                    onChange={(e) => {
                      this.update(e, index, el.ID)
                    }}
                    ></textarea>
                else
                {
                    inputField = <input 
                    id={`item-${el.Name}`} 
                    onChange={(e) => {
                      this.update(e, index, el.ID)
                    }}
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
            
            console.log(this.Item);
        }

      return (
        <main className="flex">
          <Navigation item="collections" />
            <div id="holder">
                <h1 style={{marginTop: "0px"}}>New item</h1>
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

export default ItemNew;