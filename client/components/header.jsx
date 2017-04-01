import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userData: {}
    };
    this.signup = this.signup.bind(this);
  }
  componentWillMount() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    this.setState({
      userData
    });
  }
  signup(e) {
    e.preventDefault();
    $('#signup_button').trigger('click');
  }
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    window.location.reload();
  }
  render() {
    const loginLogoutButton = localStorage.getItem('token')
      ? <a onClick={this.logout}>Logout</a>
      : <a onClick={this.signup}>Signup</a>;
    let dynamicNav = null;
    if (true) {
      dynamicNav = (
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {(this.state.userData) ?
            <li>
              <a href="!#">Welcome {this.state.userData.fullname}</a>
            </li>
          : null
        }
          <li>
            <a href="!#">My documents</a>
          </li>
          <li>
            {loginLogoutButton}
          </li>
        </ul>);
    } else {
      dynamicNav = (
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <a onClick={this.signup}> Signup </a>
          </li>
        </ul>);
    }

    return (
      <nav className="d-header">
        <div className="nav-wrapper teal">
          <a href="!#" className="brand-logo site-title">MarkyDoc</a>
          {dynamicNav}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.isLoggedIn
});

export default connect(mapStateToProps)(Header);
