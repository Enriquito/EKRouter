import React from 'react';
import './properties.css';
import Property from '../Property';

class Properties extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          PropertyList : [],
          ShowNewPropertyWindow : false
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
              this.forceUpdate();
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
      fetch(`http://localhost/api/properties/`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collections : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }

    NewProperty(){
      this.setState({
        ShowNewPropertyWindow : true
      });
    }

    Create(){

    }
    
    render() {
      let screen = null;
      let newProperty = null;
      let propertyList = null;

      if(this.state.ShowNewPropertyWindow){
        newProperty = <Property CreateMode={true} />;
      }

      if(this.state.PropertyList != null){
        propertyList = this.state.PropertyList.map((el) => {
            return(<Property key={el.id} CreateMode={false} id={el.id} />);
        });
      }

      if(this.props.id != null){
        screen = (
          <div id="properties-holder">
            <div className="flex vertical-center">
              <h3>Properties</h3>
              <button id="new-property-button" className="theme-green-bg" onClick={this.NewProperty.bind(this)}>New</button>
            </div>
            <div>
                {newProperty}
            </div>
            <div>
              {propertyList}
            </div>
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