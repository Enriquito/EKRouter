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
        fetch("http://localhost/api/collection/list/all")
            .then((resp) => resp.json())
            .then((resp) => {
                this.setState({collections : resp});
            })
            .catch((error) => {
                alert("Error could not fetch data.");
            })
    }
    
    render() {
        let cols;

        if(this.state.collections !== null)
        {
            cols = this.state.collections.map((collection, index) => {
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
        <main className="flex">
          <Nav />
            <section>
                <h1>Collections</h1>
                <div style={{margin : "10px 0"}} className="flex">
                    <button id="new-collection-button">New</button>
                </div>
                <div className="flex">
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
                                cols
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Name</td>
                                <td>Items</td>
                                <td>Created</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>
        </main>
      );
    }
  }

export default Collections;