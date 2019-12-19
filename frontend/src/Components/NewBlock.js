import React from 'react';
import { hasSession } from './Helpers';
import Nav from './Nav';

class NewBlock extends React.Component {
    constructor(props){
        super(props);
        hasSession();

        this.state = {
            block: {Name : null, Content : null}
        };
    }

    save(){
        fetch('http://localhost/api/page', {
            method : "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ page : {
                title: document.getElementById('name').value,
                content: document.getElementById('content').value
            }})
        })
        .then((resp) => resp.json())
        .then(function(data){
            
            console.log(data);
            if(data.code === 201){
                window.location = '/blocks';
                alert("test");
            }
            else{
                alert("Something went wrong");
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
    
    render() {
      return (
        <main className="flex">
          <Nav />
            <section>
                <h1>New Block</h1>
                <div className="flex">
                    
                </div>
                <div className="flex" id="edit-page-form">
                    <div id="main-form">
                        {/* <h2>Page settings</h2> */}
                        <label>Name</label>
                        <input id="name" type="text" placeholder="The name of my new block" />
                        <label>Content</label>
                        <textarea id="content" placeholder="My new page content here"></textarea>
                    </div>
                    <div id="settings">
                        {/* <h2>Aditional settings</h2> */}
                        <button onClick={this.save.bind(this)} id="save">Save</button>
                    </div>
                </div>
            </section>
        </main>
      );
    }
  }

export default NewBlock;