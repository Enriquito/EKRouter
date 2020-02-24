import React from 'react';
import "./property.css";

class Property extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          ID : null,
          Name : null,
          Type : 2,
          Description : null,
          Collection : this.props.CollectionID
        };
    }

    componentDidMount(){
      if(!this.props.CreateMode)
        this.LoadProperties();
    }

    Save(){
      fetch('http://localhost/api/property/create', {
          method : "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            { 
              property : {
                name: this.state.Name,
                description: this.state.Description,
                type : this.state.Type,
                collection : this.state.Collection
              }
            }
            )
      })
      .then(function(data){
          
          if(data.status === 201){
              alert("Property has been created");
              console.log(this.props.RemoveComponent);
              console.log(true);
          }
          else{
              alert("Error while createing property");
          }
      })
      .catch(function(error){
          this.setState({
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
      fetch('http://localhost/api/property/create', {
          method : "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              property : {
                name: this.state.Name,
                description: this.state.Description,
                type: this.state.Type,
                collection: this.state.Collection
              }
            }
          )
      })
      .then(function(data){
          if(data.status === 201){
              alert("Property has been created");
              this.props.RemoveComponent(true);
              return;
          }
          else{
              alert("Error while createing property");
          }
      }.bind(this))
      .catch(function(error){
          this.setState({
              type : "error-messages",
              messages : "Something went wrong..."
          });
          console.log(error);
      }.bind(this))

      
    }

    Delete(){
      fetch(`http://localhost/api/property/destroy/${this.state.ID}`, {
          method : "DELETE",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      })
      .then(function(data){
          
          if(data.status === 200){
              alert("Property has been deleted");
              this.props.ReRenderParent();
          }
          else{
              alert("Error while deleting property");
          }
      }.bind(this))
    }

    onChange(event){
      let type = null;
      let name = null;

      switch(event.target.tagName)
      {
        case "SELECT":
          switch(event.target.value)
          {
            case "String":
              type = 2;
              break;
            case "Interger":
              type = 1;
              break;
            default:
              type = 2;
              break;
          }
          this.setState({
            Type : type
        });
          break;
          case "INPUT":
            this.setState({
              Name : event.target.value
          });
          break;
      }

      this.setState({
        Collection : this.state.Collection
      });
    }
    
    render() {
      
      let delButton = null;

      if(!this.props.CreateMode){
        delButton = <button onClick={this.Delete.bind(this)} className="theme-red-bg">Delete</button>;
      }

      return (
        <div className="flex vertical-center property-holder">
          <select onChange={(e) => {this.onChange(e)}} value={this.state.Type}>
              <option value="String">String</option>
              <option value="Interger">Interger</option>
          </select>
          <input onChange={(e) => {this.onChange(e)}} defaultValue={this.state.Name} type="text" placeholder="Name your property" />
          <button onClick={this.Create.bind(this)} className="theme-green-bg">Save</button>
          {delButton}
        </div>
      );
    }
  }

export default Property;