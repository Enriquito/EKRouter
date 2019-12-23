import React from 'react';
import { hasSession } from './Helpers';
import Nav from './Nav';

class NewBlock extends React.Component {
    constructor(props){
        super(props);
        hasSession();

        this.state = {
            block: {Name : null, Content : null},
            page : {}
        };
    }

    replaceSpaces(){
        const name = document.getElementById('name');

        name.value = name.value.replace(' ', '-');
    }

    save(){
        fetch('http://localhost/api/block', {
            method : "POST",
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
            if(data.status === 201){
                window.location = '/blocks';
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

    newPageLink(){
        const holder = document.getElementById('page-link-holder');
        const newLink = document.createElement('div');
        newLink.classList.add('page-link');
        newLink.innerHTML = "New Link";

        holder.appendChild(newLink);
    }

    linkPage(pageid, blockid){
        fetch('http://localhost/api/block/create/link', {
            method : "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ blocklink : {
                pageID: pageid,
                blockID: blockid
            }})
        })
        .then(function(data){
            if(data.status !== 201){
                window.location = '/blocks';
            }
            else{
                alert("Something went wrong while linking blocks");
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

    searchPage(){
        const inp = document.getElementById("searh-page-input").value;
        const holder = document.getElementById('page-link-holder');

        holder.querySelector('ul').innerHTML = "";

        fetch("http://localhost/api/page/search/" + inp)
        .then((resp) => resp.json())
        .then((resp) => {
            resp.forEach(element => {
                console.log(element);
                const li = document.createElement('li');
                li.addEventListener('click', () => {
                    this.linkPage(element.id, this.state.block.id)
                });
                li.innerHTML = element.title
                holder.querySelector('ul').appendChild(li);
            });
        })
        .catch((error) => {
            console.error(error);
        });
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
                        <input onChange={this.replaceSpaces} id="name" type="text" placeholder="The name of my new block" />
                        <label>Content</label>
                        <textarea id="content" placeholder="My new page content here"></textarea>
                    </div>
                    
                    <div id="settings">
                        {/* <h2>Aditional settings</h2> */}
                        <div className="category">
                            <div className="flex">
                                <button onClick={this.save.bind(this)} id="save">Save</button>
                            </div>                            
                        </div>
                        <div className="category">
                            <h3>Page links</h3>
                            <div className="flex">
                                <input placeholder="Link this block to page..." type="text" id="searh-page-input" onChange={this.searchPage.bind(this)} />
                                <button>Add</button>
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

export default NewBlock;