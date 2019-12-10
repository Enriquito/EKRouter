import React from 'react';
import { hasSession, formatDate } from './Helpers';
import Nav from './Nav';

class Pages extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
            pages: null,
        };
    }

    componentDidMount(){
        fetch("http://localhost/api/page/list/all")
            .then((resp) => resp.json())
            .then((resp) => {
                this.setState({pages : resp});
            })
            .catch((error) => {
                alert("Error could not fetch data.");
            })
    }
    
    render() {
        let pages;

        const test = (page) => {window.location = "/page/" + page.id}

        if(this.state.pages !== null)
        {
            pages = this.state.pages.map((page, index) => {
                if(page.edited === "0000-00-00 00:00:00")
                    page.edited = "Never";
                else
                {
                    const date = formatDate(page.edited);
                    page.edited = date.day + "-" + date.month + "-" + date.year;
                }

                const date = formatDate(page.created);
                page.created = date.day + "-" + date.month + "-" + date.year;
                
                return (
                    <tr onClick={() => test(page)} key={page.id}>
                        <td>{page.title}</td>
                        <td>{page.created}</td>
                        <td>{page.edited}</td>
                    </tr>
                );
            })
        }
      return (
        <main className="flex">
          <Nav />
            <section>
                <h1>Pages</h1>
                <div style={{margin : "10px 0"}} className="flex">
                    <button onClick={() => window.location = "/new/page"} id="new-collection-button">New</button>
                </div>
                <div className="flex">
                    <table>
                        <thead>
                            <tr>
                                <td>Title</td>
                                <td>Created</td>
                                <td>Edited</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pages
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
      );
    }
  }

export default Pages;