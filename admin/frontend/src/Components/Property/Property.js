import React from 'react';
import "./property.css";

class Property extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          ID : null,
          Name : null,
          Type : null,
          Description : null,
          Collection : null
        };
    }

    componentDidMount(){
      if(!this.props.CreateMode)
        this.LoadProperties();
    }

    Save(name, description, type, collection){
      fetch('http://localhost/api/property/create', {
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
                type : type,
                collection : collection
              }
            }
            )
      })
      .then(function(data){
          console.log(data);
          if(data.status === 201){
              alert("Property has been created");
          }
          else{
              alert("Error while createing property");
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

    LoadProperties(){
      const data = this.props.data;

      this.setState({
          ID : data.ID,
          Name : data.Name,
          Type : data.Type,
          Description : data.Description,
          Collection : data.Collection
      });
    }

    Create(){

    }
    
    render() {
      

      return (
        <div className="flex vertical-center property-holder">
          <select value={this.state.Type}>
              <option value="String">String</option>
              <option value="Interger">Interger</option>
          </select>
          <input defaultValue={this.state.Name} type="text" placeholder="Name your property" />
          <button className="theme-green-bg">Save</button>
        </div>
      );
    }
  }

export default Property;