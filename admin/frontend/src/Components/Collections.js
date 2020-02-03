import React from 'react';
import { hasSession } from './Helpers';
import Nav from './Nav';

class Collections extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
          SelectedCollection : null,
          Collections: [],
        };

        this.New = this.New.bind(this);
    }

    componentDidMount(){
        this.Load();
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

    New(){
        let inp = document.createElement('input');
        let li = document.createElement('li');
        li.append(inp)
        let coll = document.getElementById("collection-list");

        let acceptButton = document.createElement('button');
        acceptButton.innerHTML = "Save";

        acceptButton.addEventListener('click', function(){
          const name = inp.value;
          li.removeChild(inp);
          const col = document.createElement("strong");
          col.innerHTML = name;

          li.innerHTML = "";
          
          li.append(col);

          let colls = this.state.Collections;

          colls.push({
            Name : name,
            Types : []
          });

          this.Save(name, "");

          this.setState({
              SelectedCollection : 0,
              Collections : colls
          });

        }.bind(this));

        let cancelButton = document.createElement('button');
        cancelButton.innerHTML = "Cancel";

        li.append(acceptButton)
        li.append(cancelButton)
        coll.append(li)
    }

    Load(){
      fetch("http://localhost/api/collection/list/all")
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({Collections : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
        });
    }
    
    render() {

      if(this.state.Collections != null){
        
      }

      return (
        <main className="flex">
          <Nav />
            <div id="holder">
                <div style={{height: "100%"}} className='flex'>
                    <div id="collection-holder">
                        <h4>Collections</h4>
                        <button onClick={this.New}>New</button>
                        <ul id="collection-list"></ul>
                    </div>
                    <div id="type-holder">
                        <h4>Types</h4>
                    </div>
                </div>
                
            </div>
        </main>
      );
    }
  }

export default Collections;