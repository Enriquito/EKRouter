import React from 'react';
import { hasSession } from './Helpers';
import Nav from './Nav';

class EditPage extends React.Component {
    constructor(props){
        super(props);
        hasSession();

        this.state = {
            page: {Title : null, Content : null}
        };
    }

    componentDidMount(){
        const id = this.props.match.params.id;

        fetch("http://localhost/api/page/" + id)
            .then((resp) => resp.json())
            .then((resp) => {
                this.setState({page : resp});
            })
            .catch((error) => {
                alert("Error could not fetch data.");
            })
    }

    save(){
        const id = this.props.match.params.id;

        fetch('http://localhost/api/page/' + id, {
            method : "PUT",
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
            
        })
        .catch(function(error){
            this.setState(
                {
                    type : "error-messages",
                    messages : "Something went wrong..."
                });
        }.bind(this));
    }

    delete(){
        if (window.confirm('Are you sure you want to delete this page?')) {
            const id = this.props.match.params.id;

            fetch('http://localhost/api/page/' + id, {
                method : "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data){
                console.log(data);
                if(data.status === 200){
                    window.location = '/pages';
                }
            })
            .catch(function(){
                this.setState(
                    {
                        type : "error-messages",
                        messages : "Something went wrong..."
                    });
            }.bind(this));
        }
        else {
            return;
        }
    }
    
    render() {
      return (
        <main className="flex">
          <Nav />
            <section>
                <h1>Edit page</h1>
                <div className="flex">
                    <button onClick={this.save.bind(this)} id="save">Save</button>
                    <button onClick={this.delete.bind(this)} id="delete">Delete</button>
                </div>
                <div className="flex" id="edit-page-form">
                    <div style={{flexGrow : 1}}>
                        {/* <h2>Page settings</h2> */}
                        <input id="title" type="text" defaultValue={this.state.page.Title} placeholder="Page title" />
                        <textarea id="content" defaultValue={this.state.page.Content} placeholder="Page content"></textarea>
                    </div>
                    <div id="settings">
                        {/* <h2>Aditional settings</h2> */}
                        <div style={{textAlign : "center"}}>
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

export default EditPage;