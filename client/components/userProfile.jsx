import React, { Component } from 'react';
import { Row, Input } from 'react-materialize';
import config from '../config/config.js';
import { Button, Col, Icon } from 'react-materialize';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      successMsg: '',
      allUsers: [],
      selectedUser: {},
      selectedUserColor: 'green',
      clickAction: null
    };
    this.updateUser = this.updateUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }
  componentWillMount() {
    // Get all users if current user is an admin
    if (this.props.userData.roleId === 1) {
      const url = '/api/users';
      const token = localStorage.getItem('token');
      const options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: token
        }
      };
      fetch(url, options).then(data => data.json())
      .then((res) => {
        this.setState({
          allUsers: res.users
        });
      });
    }
  }
  componentDidMount() {
    if (this.props.userData) {
      const url = `/api/users/${this.props.userData.userId}`;
      const token = localStorage.getItem('token');
      const options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: token
        }
      };
      fetch(url, options).then(data => data.json())
      .then((res) => {
        this.setState({
          user: res.user
        });
      });
    }
  }
  updateUser(user) {
    const owner = (user === 'currentUser');
    const token = localStorage.getItem('token');
    const email = (owner)
      ? document.getElementById('edit-email').value
      : document.getElementById('edit-other-email').value;
    const fullname = (owner)
      ? document.getElementById('edit-fullname').value
      : document.getElementById('edit-other-fullname').value;
    const username = (owner)
      ? document.getElementById('edit-username').value
      : document.getElementById('edit-other-username').value;
    const password = (owner)
      ? document.getElementById('edit-password').value
      : document.getElementById('edit-other-password').value;
    const confirmPassword = (owner)
      ? document.getElementById('edit-other-confirm-password').value
      : document.getElementById('edit-other-confirm-password').value;
    const url = (owner)
      ? `/api/users/${this.state.user.id}`
      : `/api/users/${this.state.selectedUser.id}`;

    let query = `email=${email}&password=${password}&username=${username}`;
    query += `&fullname=${fullname}&password_confirmation=${confirmPassword}`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Authorization: token
      },
      body: query
    };

    fetch(url, options).then(data => data.json())
      .then((res) => {
        if(owner) {
          const userData = {
            fullname: res.userData.fullname,
            roleId: res.userData.roleId,
            userId: res.userData.id
          };
          localStorage.setItem('token', res.token);
          sessionStorage.setItem('userData', JSON.stringify(userData));
          this.setState({
            user: userData,
            successMsg: 'Update Successful!'
          });
        }
      });
    this.props.getUser();
  }
  editUser(user, action = 'edit') {
    if (action === 'delete') {
      this.setState({
        clickAction: 'delete'
      });
    } else {
      this.setState({
        clickAction: null
      });
    }
    this.setState({
      selectedUser: user,
      selectedUserColor: (action === 'delete') ? 'red' : 'green'
    });
  }
  deleteUser(type) {
    if (type !== 'cancel') {
      const token = localStorage.getItem('token');
      const url = `/api/users/${this.state.selectedUser.id}`;
      const options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: token
        }
      };
      fetch(url, options).then((data) => {
        console.log(data);
      });
    } else {
      this.setState({
        selectedUser: {},
        clickAction: null
      });
    }
  }
  render() {
    const boldStyle = {
      color: this.state.selectedUserColor,
      fontSize: '17px',
      fontWeight: 'bold',
      cursor: 'pointer',
      paddingLeft: '15px'
    };
    const iconStyle = {
      cursor: 'pointer'
    };
    const allUsers = (this.state.allUsers.length > 0)
      ? this.state.allUsers.map(user => (
        <li key={user.id}>
          <div>
            <hr />
            <div>
              <i className="small material-icons" />
              <span
                style={(this.state.selectedUser.id === user.id) ? boldStyle : { paddingLeft: '15px' }}
                data-activates="slide-out-edit-user"
                className="all_user_profile_edit_tab"
              >
                {user.fullname}
              </span>
              <i style={iconStyle} onClick={() => { this.editUser(user, 'delete'); }} className="small material-icons right">delete</i>
              <i style={iconStyle} onClick={() => { this.editUser(user, 'edit'); }} className="small material-icons right">mode_edit</i>
            </div>
          </div>
        </li>
        )) : null;
    return (
      <div>
        {/* Display user profile nav */}
        <ul id="slide-out" className="side-nav left">
          <li>
            <div className="userView">
              <a><i className="large material-icons">perm_identity</i></a>
              <a href="#!">{this.state.user.username}</a>
              <a href="#!name"><span className="name">{this.state.user.fullname}</span></a>
              <a href="#!email"><span className=" email">{this.state.user.email}</span></a>
            </div>
          </li>
          <li><div className="divider" /></li>
          {(this.state.user.roleId === 1)
            ? <li><a className="all_user_profile_tab waves-effect" data-activates="slide-out-all-users">
              <i className="small material-icons">supervisor_account</i>
                View All Users</a>
            </li>
            : null
          }
          <li><a className="waves-effect" onClick={this.props.logout}> <i className="material-icons">power_settings_new</i> Logout</a></li>
          <li><div className="divider" /></li>
          <li><a className="waves-effect"><i className="small material-icons">reply</i>Back</a></li>
        </ul>
        {/* Display edit profile side nav */}
        <ul id="slide-out-edit" className="side-nav left">
          <li>
            <div className="userView">
              <a><i className="large material-icons">perm_identity</i></a>
              <a><span className="name">Edit Profile</span></a>
              <Input id="edit-email" type="email" placeholder={this.state.user.email} s={12} validate />
              <Input id="edit-fullname" type="text" placeholder={this.state.user.fullname} s={12} validate />
              <Input id="edit-username" type="text" placeholder={this.state.user.username} s={12} validate />
              <Input id="edit-password" type="password" placeholder="Password" s={12} validate />
              <Input id="edit-confirm-password" type="password" placeholder="Confirm password" s={12} validate />
            </div>
          </li>
          { (this.state.successMsg.length > 0)
              ? <li><a> {this.state.successMsg} </a></li>
              : null
             }
          <li><div className="divider" /></li>
          <li onClick={() => { this.updateUser('currentUser'); }}><a className="waves-effect"><i className="small material-icons">done_all</i>Save</a></li>
          <li><a className="waves-effect"><i className="small material-icons">reply</i>Back</a></li>
          <li><a className="waves-effect" onClick={this.props.logout}> <i className="material-icons">power_settings_new</i> Logout</a></li>
        </ul>
        {/* List all users */}
        <ul id="slide-out-all-users" className="side-nav left">
          <li>
            <div className="userView">
              <a><i className="large material-icons">supervisor_account</i></a>
              <a><span className="name"><h5>All Users</h5></span></a>
            </div>
          </li>
          { allUsers }
          <li><div className="divider" /></li>
          <li><a className="waves-effect"><i className="small material-icons">reply</i>Back</a></li>
          <li><div className="divider" /></li>
          {(this.state.clickAction !== null)
            ? <div>
              <br /><br />
              <h5>Delete User?</h5>
              <li><div className="divider" /></li>
              <br />
              <li><a className="waves-effect right" onClick={() => { this.deleteUser(); }}>
                <i className="small material-icons">delete</i> Yes</a></li>
              <li><a className="waves-effect left" onClick={() => { this.deleteUser('cancel'); }}> <i className="small material-icons">cancel</i> No</a></li>
            </div>
            : null
            }
        </ul>
        {/* Display edit user profile side nav */}
        <ul id="slide-out-edit-user" className="side-nav left">
          <li>
            <div className="userView">
              <a><i className="large material-icons">perm_identity</i></a>
              <a><span className="name">Edit User Profile</span></a>
              <Input id="edit-other-email" type="email" placeholder={this.state.selectedUser.email} s={12} validate />
              <Input id="edit-other-fullname" type="text" placeholder={this.state.selectedUser.fullname} s={12} validate />
              <Input id="edit-other-username" type="text" placeholder={this.state.selectedUser.username} s={12} validate />
              <Input id="edit-other-password" type="password" placeholder="Password" s={12} validate />
              <Input id="edit-other-confirm-password" type="password" placeholder="Confirm password" s={12} validate />
            </div>
          </li>
          { (this.state.successMsg.length > 0)
              ? <li><a> {this.state.successMsg} </a></li>
              : null
             }
          <li><div className="divider" /></li>
          <li>
            <div>
              <a className="waves-effect right" onClick={() => { this.updateUser('otherUser'); }}> <i className="small material-icons">done_all</i> Save</a>
              <a className="waves-effect left"> <i className="small material-icons">reply</i> Back</a>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
