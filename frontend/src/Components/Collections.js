import React from 'react';
import { hasSession, logout } from './Helpers';
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
        fetch("http://localhost/api/collection/list/all")
            .then((resp) => resp.json())
            .then((resp) => {
                this.setState({collections : resp});
                console.log(this.state.collections);
            })
            .catch((error) => {
                alert("Error could not fetch data.");
            })
    }
    
    render() {
        if(his.state.collections !== null)
        {
            let cols = this.state.collections.map((collection, index) => {
                return (
                    <tr key={collection.id}>
                        <td>{collection.name}</td>
                        <td>0</td>
                        <td>{collection.created}</td>
                    </tr>
                );
            })
        }
      return (
        <main class="flex">
          <Nav />
            <section>
                <h1>Collections</h1>
                <div style={{margin : "10px 0"}} className="flex">
                    <button id="new-collection-button">New</button>
                </div>
                <div class="flex">
                    
                    <table>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Items</td>
                                <td>Created</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                
                            }
                            <tr>
                                <td>Test</td>
                                <td>20</td>
                                <td>10-12-2019</td>
                            </tr>
                        </tbody>
                        <tfoot>

                        </tfoot>
                    </table>
                </div>
            </section>
        </main>
      );
    }
  }

export default Collections;