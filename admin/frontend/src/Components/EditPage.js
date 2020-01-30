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
        });

        fetch("http://localhost/api/pages/status")
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({status : resp});
        })
        .catch((error) => {
            alert("Error could not fetch data.");
            return;
        });
    }

    save(){
        if (window.confirm('Are you sure you want to update this page?')) {
            const id = this.props.match.params.id;

            fetch('http://localhost/api/page/' + id, {
                method : "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ page : {
                    title: document.getElementById('title').value,
                    route: document.getElementById('route').value,
                    content: document.getElementById('content').value,
                    status: document.getElementById('status').value
                }})
            })
            .then(function(data){
                console.log(data);
                if(data.status === 200){
                    alert("Page has been updated");
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
        else{
            return;
        }
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

    getPageStatus(){
        if(this.state.status != null && this.state.page.Status != null)
        {
            let data = this.state.status.map((status, index) => {
                return <option defaultValue={status.id} value={status.id} key={status.id}>{status.status}</option>
            });

            return(
                <select id="status" defaultValue="Published">
                    {data}
                </select>
            );
        }
    }
    
    render() {
      return (
        <main className="flex">
          <Nav />
            <section>
                <h1>Edit page</h1>
                <div className="flex" id="edit-page-form">
                    <div id="main-form">
                        <label>Title</label>
                        <input id="title" type="text" defaultValue={this.state.page.Title} placeholder="The title of my new page" />
                        <label>Route</label>
                        <input id="route" type="text" defaultValue={this.state.page.Route} placeholder="/example/route" />
                        <label>Content</label>
                        <textarea id="content" defaultValue={this.state.page.Content} placeholder="My new page content here"></textarea>
                    </div>
                    <div id="settings">
                        <div className="category">
                            <h3>Publish</h3>
                            <div>
                                <span>Last Edit</span> <strong>12-11-2019</strong>
                            </div>
                            
                            <div>
                                <span>Created</span> <strong>12-10-2019</strong>
                            </div>
                            
                            <div>
                                <span>Status</span>
                                {
                                    this.getPageStatus(this.state.page.Status)
                                }
                            </div>
                            <div className="flex center">
                                <button onClick={this.delete.bind(this)} id="delete">Delete</button>
                                <button onClick={this.save.bind(this)} id="save">Save</button>
                            </div>
                            
                        </div>
                        <div className="category">
                            <h3>Tags</h3>
                        </div>
                        <div className="category">
                            <h3>Collection links</h3>
                        </div>
                        <div className="category">
                            <h3>Data Blocks</h3>
                            
                        </div>
                        
                    </div>
                </div>
            </section>
        </main>
      );
    }
  }

export default EditPage;