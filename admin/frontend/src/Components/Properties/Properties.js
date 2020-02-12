import React from 'react';
//import Property from '../Property';

class Properties extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          
        };

    }

    componentDidMount(){
        
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
      let screen = null;

      if(this.props.id != null){
        screen = (
          <div>
            <h4>Properties</h4>
            <button onClick={this.NewProperty}>New</button>
          </div>
        );
      }

      return (
        <div>
            {screen}
        </div>
      );
    }
  }

export default Properties;