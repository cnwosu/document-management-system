import React, { Component } from 'react';
import { Router, Route, browserHistory, hashHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import UserProfile from './userProfile.jsx';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userData: {}
    };
    this.signup = this.signup.bind(this);
    this.getUser = this.getUser.bind(this);
  }
  componentWillMount() {
    this.getUser();
  }
  signup(e) {
    e.preventDefault();
    $('#signup_button').trigger('click');
  }
  getUser() {
    const userData = (sessionStorage.getItem('userData') !== 'undefined')
      ? JSON.parse(sessionStorage.getItem('userData'))
      : browserHistory.push('login');
    this.setState({
      userData
    });
  }
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    browserHistory.push('login');
  }
  render() {
    const loggedIn = localStorage.getItem('token');
    const loginLogoutButton = (loggedIn) 
      ? <a onClick={this.logout}>Logout</a>
      : <a onClick={this.signup}>Signup</a>;
      
    let dynamicNav = null;
    if (loggedIn) {
      dynamicNav = (
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><a data-activates="slide-out-edit" className="user_profile_tab">
            <i className="small material-icons">mode_edit</i></a></li>
          {(this.state.userData) ?
            <li>
              <a data-activates="slide-out" className="user_profile_tab">{this.state.userData.fullname}</a>
            </li>
          : null
        }
          <li>
            {loginLogoutButton}
          </li>
        </ul>);
    } else {
      dynamicNav = (
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <Link className="" to="/login">Signup</Link>
          </li>
        </ul>);
    }
    const profileSideBar = (this.state.userData && this.state.userData.fullname)
        ? <UserProfile userData={this.state.userData} logout={this.logout} getUser={this.getUser} />
        : null;
    return (
      <div>
        {profileSideBar}
        <nav className="d-header">
          <div className="nav-wrapper teal">
            <a className="brand-logo site-title">MarkyDoc</a>
            {dynamicNav}
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default connect(mapStateToProps)(Header);
