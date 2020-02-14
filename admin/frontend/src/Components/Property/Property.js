import React from 'react';

class Property extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          ID : null,
          Name : null,
          Type : null,
          Description : null
        };
    }

    componentDidMount(){
      if(!this.props.CreateMode)
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

    LoadProperties(){
      const data = this.props.data;

      this.setState({
          ID : data.ID,
          Name : data.Name,
          Type : data.Type,
          Description : data.Description
      });
    }

    Create(){

    }
    
    render() {
      

      return (
        <div className="flex vertical-center">
          <select value={this.state.Type}>
              <option value="String">String</option>
              <option value="Interger">Interger</option>
          </select>
          <input defaultValue={this.state.Name} type="text" placeholder="Name your property" />
          <button>Save</button>
        </div>
      );
    }
  }

export default Property;