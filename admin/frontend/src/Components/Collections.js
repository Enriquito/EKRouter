import React from 'react';
import { hasSession } from './Helpers';
import Nav from './Nav';

class Collections extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
          collections: null,
        };
    }

    componentDidMount(){
        
    }

    New(){
        let inp = document.createElement('input');
        let li = document.createElement('li');
        li.append(inp)
        let coll = document.getElementById("collection-list");
        coll.append(li)
        console.log('a');
    }
    
    render() {
        
      return (
        <main className="flex">
          <Nav />
            <div id="holder">
                <div style={{height: "100%"}} className='flex'>
                    <div id="collection-holder">
                        <h4>Collections</h4>
                        <ul>
                            <li onClick={this.New}>New</li>
                        </ul>
                        <ul id="collection-list">
                            <li></li>
                        </ul>
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