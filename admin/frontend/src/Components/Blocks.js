import React from 'react';
import { hasSession, formatDate } from './Helpers';
import Nav from './Nav';

class Blocks extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
            blocks: null,
        };
    }

    componentDidMount(){
        fetch("http://localhost/api/block/list/all")
            .then((resp) => resp.json())
            .then((resp) => {
                this.setState({blocks : resp});
            })
            .catch((error) => {
                alert("Error could not fetch data.");
            })
    }
    
    render() {
        let blocks;

        const redirect = (block) => {window.location = "/block/" + block.id}

        if(this.state.blocks !== null)
        {
            blocks = this.state.blocks.map((block, index) => {
                if(block.edited === "0000-00-00 00:00:00")
                block.edited = "Never";
                else
                {
                    const date = formatDate(block.edited);
                    block.edited = date.day + "-" + date.month + "-" + date.year;
                }

                const date = formatDate(block.created);
                block.created = date.day + "-" + date.month + "-" + date.year;
                
                return (
                    <tr onClick={() => redirect(block)} key={block.id}>
                        <td>{block.name}</td>
                        <td>{block.created}</td>
                        <td>{block.edited}</td>
                    </tr>
                );
            })
        }
      return (
        <main className="flex">
          <Nav />
            <section>
                <h1>Blocks</h1>
                <div style={{margin : "10px 0"}} className="flex">
                    <button onClick={() => window.location = "/new/block"} id="new-collection-button">New</button>
                </div>
                <div className="flex">
                    <table>
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Created</td>
                                <td>Edited</td>
                            </tr>
                        </thead>
                        <tbody>
                            {blocks}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
      );
    }
  }

export default Blocks;