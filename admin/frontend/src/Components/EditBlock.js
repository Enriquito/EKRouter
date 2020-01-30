import React from 'react';
import { hasSession, formatDate } from './Helpers';
import Nav from './Nav';

class EditBlock extends React.Component {
    constructor(props){
        super(props);
        hasSession();

        this.state = {
            block: {Name : null, Content : null}
        };
    }

    componentDidMount(){
        const id = this.props.match.params.id;

        fetch("http://localhost/api/block/" + id)
        .then((resp) => resp.json())
        .then((resp) => {
            this.setState({block : resp});
            console.log(this.state.block);
            if(this.state.block.id === undefined)
                window.location = "/blocks";
        })
        .catch((error) => {
            alert("Error could not fetch data.");
            window.location = "/blocks";
        });
    }

    save(){
        if (window.confirm('Are you sure you want to update this page?')) {
            const id = this.props.match.params.id;

            fetch('http://localhost/api/block/' + id, {
                method : "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ block : {
                    name: document.getElementById('name').value,
                    content: document.getElementById('content').value
                }})
            })
            .then(function(data){
                console.log(data);
                if(data.status === 200){
                    alert("Block has been updated");
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
        if (window.confirm('Are you sure you want to delete this block?')) {
            const id = this.props.match.params.id;

            fetch('http://localhost/api/block/' + id, {
                method : "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data){
                console.log(data);
                if(data.status === 200){
                    window.location = '/blocks';
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

    replaceSpaces(){
        const name = document.getElementById('name');
        name.value = name.value.replace(' ', '-');
    }

    searchPage(){
        const inp = document.getElementById("searh-page-input").value;
        const holder = document.getElementById('page-link-holder');
        fetch("http://localhost/api/page/search/" + inp)
            .then((resp) => resp.json())
            .then((resp) => {
                holder.querySelector('ul').innerHTML = "";
                resp.forEach(element => {
                    console.log(element);
                    const li = document.createElement('li');
                    li.addEventListener('click', () => {
                        this.linkPage(element.id, this.state.block.id)
                    });
                    li.innerHTML = element.title;
                    
                    holder.querySelector('ul').appendChild(li);
                });
            })
            .catch((error) => {
                console.error(error);
            });

        setTimeout(() => {
            
        }, 500);
    }
    
    render() {
        let created = "";
        let edited = "";

        if(this.state.block.id !== undefined){
            created = formatDate(this.state.block.created)
            edited = formatDate(this.state.block.edited)

            if(edited.year === "0000")
                edited = "Never";
            else
                edited = edited.day + "-" + edited.month + "-" + edited.year;

            created = created.day + "-" + created.month + "-" + created.year;
        }

      return (
        <main className="flex">
          <Nav />
            <section>
                <h1>Edit block</h1>
                <div className="flex" id="edit-page-form">
                    <div id="main-form">
                        <label>Name</label>
                        <input id="name" onChange={this.replaceSpaces} type="text" defaultValue={this.state.block.name} placeholder="Your block name" />
                        <label>Content</label>
                        <textarea id="content" defaultValue={this.state.block.content} placeholder="Your block content here"></textarea>
                    </div>
                    <div id="settings">
                        <div className="category">
                            <div>
                                <span>Last Edit</span> <strong>{edited}</strong>
                            </div>
                            
                            <div>
                                <span>Created</span> <strong>{created}</strong>
                            </div>
                            <div className="flex center">
                                <button onClick={this.delete.bind(this)} id="delete">Delete</button>
                                <button onClick={this.save.bind(this)} id="save">Save</button>
                            </div>
                            
                        </div>
                        <div className="category">
                            <h3>Page links</h3>
                            <div className="flex">
                                <input placeholder="Link this block to page..." type="text" id="searh-page-input" onChange={this.searchPage.bind(this)} />
                            </div>
                            <div id="page-link-holder" className="flex wrap">
                                <ul>
                                    
                                </ul>
                            </div>                            
                        </div>                     
                    </div>
                </div>
            </section>
        </main>
      );
    }
  }

export default EditBlock;