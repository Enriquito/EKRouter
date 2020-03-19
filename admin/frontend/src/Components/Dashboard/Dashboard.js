import React from 'react';
import { hasSession, getUser } from '../Helpers';
import Navigation from '../Navigation';
import Topbar from '../Topbar';

class Dashboard extends React.Component {
    constructor(props){
        hasSession();
        super(props);

        this.state = {
          CurrentUser : null,
          data: null,
        };
    }

    componentDidMount(){
      getUser().then((resp) => {
        this.setState({CurrentUser : resp});
      });
    }
    
    render() {
      let bar = null;

      if(this.state.CurrentUser != null)
        bar = <Topbar user={this.state.CurrentUser}/>;

      return (
        <main>
          {bar}
          <div style={{height: "100%"}} className="flex">
            <Navigation item="dashboard"/>
          </div>
          
        </main>
      );
    }
  }

export default Dashboard;