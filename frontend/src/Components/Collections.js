import React from 'react';
import { hasSession, logout } from './Helpers';
import Nav from './Nav';

class Collections extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
          data: null,
        };
    }
    
    render() {
      return (
        <main class="flex">
          <Nav />
            <section>
                <h1>Collections</h1>
                <button></button>
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