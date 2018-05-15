import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
 import AccountsWrapper from './AccountsUIWrapper';
import Task from './Task.js';
 
// App component - represents the whole app
class App extends Component {
    handleSubmit(event) {
        event.preventDefault();
     
        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
     
        Tasks.insert({
          text,
          createdAt: new Date(),
          owner: Meteor.userId(),           // _id of logged in user
          username: Meteor.user().username,  // current time
        });
     
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
      }
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
                return (
                <div className="container">
                    <header>
                    <h1>Todo List</h1>
                    <AccountsWrapper />
                    </header>
                { this.props.currentUser ?               
                    <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                        <input
                        type="text"
                        ref="textInput"
                        placeholder="Type to add new tasks"
                        />
                        
                    </form> 
                    :  <h1> Please Log in.. </h1>
                  }
                         <ul>
                              {this.renderTasks()}
                         </ul>
                   
                </div>
                );
            }


}
 
export default withTracker(() => {
    return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    };
  })(App);