import React from 'react';
import { hasSession } from '../Helpers';

class Property extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
          SelectedCollection : null
        };

        this.New = this.New.bind(this);
    }

    componentDidMount(){
        this.LoadProperties();
    }

    Save(name, description){
      fetch('http://localhost/api/collection/create', {
          method : "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            { 
              collection : {
                name: name,
                description: description,
                owner : 14
              }
            }
            )
      })
      .then(function(data){
          console.log(data);
          if(data.status === 201){
              alert("Collection has been created");
          }
          else{
              alert("Error while updating page");
          }
      })
      .catch(function(error){
          this.setState(
              {
                  type : "error-messages",
                  messages : "Something went wrong..."
              });
      }.bind(this));
    }

    NewProperty(){
        
    }

    LoadProperties(){
      fetch(`http://localhost/api/properties/`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collections : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }

    Create(){

    }
    
    render() {
      

      return (
        <div>
          <select>
              <option value="string">String</option>
              <option value="interger">Interger</option>
          </select>
          <input type="text" placeholder="Name your property" />
        </div>
      );
    }
  }

export default Property;