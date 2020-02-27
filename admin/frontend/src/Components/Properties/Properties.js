import React from 'react';
import './properties.css';
import Property from '../Property';

class Properties extends React.Component {
    constructor(props){
        super(props);

        this.state = {
          Collection : null,
          ShowNewPropertyWindow : false
        };
    }

    componentDidMount(){
        this.loadCollection();
    }

    loadCollection(){
      fetch(`http://localhost/api/collection/${this.props.CollectionID}`)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collection : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
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

    NewProperty(){
      this.setState({
        ShowNewPropertyWindow : true
      });
    }

    reRender(){
      this.loadCollection();
    }

    RemoveNewProperty(){
      this.loadCollection();
      this.setState({
        ShowNewPropertyWindow : false
      });
    }
    
    render() {
      let screen = null;
      let newProperty = null;
      let pl = null;

      if(this.state.ShowNewPropertyWindow){
        newProperty = <Property RemoveComponent={this.RemoveNewProperty.bind(this)} CollectionID={this.state.Collection.ID} CreateMode={true} />;
      }

      if(this.state.Collection != null){
        pl = this.state.Collection.Properties.map((el) => {
          return(<Property ReRenderParent={this.reRender.bind(this)} key={el.ID} CreateMode={false} data={el} />);
        });
      }

      if(this.props.CollectionID != null){
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
              {pl}
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