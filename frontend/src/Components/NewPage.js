import React from 'react';
import { hasSession } from './Helpers';
import Nav from './Nav';

class NewPage extends React.Component {
    constructor(props){
        super(props);
        hasSession();

        this.state = {
            page: {Title : null, Content : null}
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
                title: document.getElementById('title').value,
                content: document.getElementById('content').value,
            }})
        })
        .then((resp) => resp.json())
        .then(function(data){
            
            console.log(data);
            if(data.code === 201){
                window.location = '/pages';
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
                <h1>New page</h1>
                <div className="flex">
                    <button onClick={this.save.bind(this)} id="save">Save</button>
                </div>
                <div className="flex" id="edit-page-form">
                    <div style={{flexGrow : 1}}>
                        {/* <h2>Page settings</h2> */}
                        <input id="title" type="text" defaultValue={this.state.page.Title} placeholder="Page title" />
                        <textarea id="content" defaultValue={this.state.page.Content} placeholder="Page content"></textarea>
                    </div>
                    <div id="settings">
                        {/* <h2>Aditional settings</h2> */}
                        <div>
                            <h3>Tags</h3>
                            <h3>Collection links</h3>
                        </div>
                    </div>
                </div>
            </section>
        </main>
      );
    }
  }

export default NewPage;