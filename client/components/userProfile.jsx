import React, { Component } from 'react';
import { Row, Input } from 'react-materialize';
import config from '../config/config.js';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      successMsg: '',
      allUsers: []
    };
    this.updateUser = this.updateUser.bind(this);
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
  updateUser(e) {
    const token = localStorage.getItem('token');
    const email = document.getElementById('edit-email').value;
    const fullname = document.getElementById('edit-fullname').value;
    const username = document.getElementById('edit-username').value;
    const password = document.getElementById('edit-password').value;
    const confirmPassword = document.getElementById('edit-confirm-password').value;
    const url = `/api/users/${this.state.user.id}`;

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
      });
    this.props.getUser();
  }
  render() {
    const allUsers = (this.state.allUsers.length > 0)
      ? this.state.allUsers.map(user => (
        <li key={user.id}>
          <div>
            <hr />
            <a>
              <i className="small material-icons" /><span className=" email">{user.fullname}</span>
              <i className="small material-icons right">delete</i>
              <i className="small material-icons right">mode_edit</i>
            </a>
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
            ? <li><a className="all_user_profile_tab waves-effect" onClick={() => { $('.slide-out').sideNav('hide'); }} data-activates="slide-out-all-users">
              <i className="small material-icons">supervisor_account</i>
                View All Users</a>
            </li>
            : null
          }
          <li><a className="waves-effect" href="#!"><i className="small material-icons">mode_edit</i>Update profile</a></li>
          <li><a className="waves-effect" onClick={this.props.logout}> <i className="material-icons">power_settings_new</i> Logout</a></li>
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
          <li onClick={() => { this.updateUser(); }}><a className="waves-effect"><i className="small material-icons">done_all</i>Save</a></li>
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
        </ul>
      </div>
    );
  }
}
