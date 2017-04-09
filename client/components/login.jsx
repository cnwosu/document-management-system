import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, browserHistory, hashHistory, Link } from 'react-router';
import rootReducer from '../reducers';
import { Button, Row, Col, Icon, Input } from 'react-materialize';
import { loginAction } from '../actions';
import config from '../config/config.js';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isNewUser: false
    };
    this.validateUser = this.validateUser.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.setSignup = this.setSignup.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  validateEmail(email) {
    if (email === undefined) {
      return false;
    }
    const re = /[a-z,0-9]/ig;
    const dotPos = email.lastIndexOf('.');
    const atPos = email.lastIndexOf('@');
    const wsp = email.lastIndexOf(' ');
    const atPosMinus = email.substring(atPos - 1, atPos);
    return (atPos > 0 && dotPos > atPos && wsp < 0 && re.test(atPosMinus));
  }
  validateUser(event) {
    event.preventDefault();
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    const data = `${email} ${password}`;
    const errors = [];

    if (!this.validateEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (password.trim().length < 1) {
      errors.push('Password is required');
    }
    const url = `/api/users/login`;
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `email=${email}&password=${password}`
    };
    fetch(url, options)
    .then(data => data.json())
    .then((response) => {
      if (response && response.message === 'success') {
        // Set the JWT on the localstorage and dispatch to store
        localStorage.setItem('token', response.jwt);
        sessionStorage.setItem('userData', JSON.stringify(response.userData));
        this.setState({
          isLoggedIn: true
        });
        browserHistory.push('/home');
      } else {
        // Login failed handle action
        this.setState({
          isLoggedIn: false
        });
      }
    })
    .catch((error) => {
      console.log('err:', error);
    });
    this.props.updateUser(this.state.isLoggedIn, 'LOGIN_ACTION');
  }
  setSignup(e) {
    e.preventDefault();
    let newUser = true;
    if (e.target.textContent === 'Signin') {
      newUser = false;
    }
    this.setState({
      isNewUser: newUser
    });
  }
  registerUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const fullname = document.getElementById('fullname').value;
    const passwordConfirmation = document.getElementById('password_confirmation').value;
    const password = document.getElementById('user-password').value;
    const email = document.getElementById('user-email').value;
    // specify default roleId of 2 for all users by default
    const roleId = 2;

    const url = `/api/users`;
    let query = `email=${email}&password=${password}&username=${username}`;
    query += `&fullname=${fullname}&password_confirmation=${passwordConfirmation}&roleId=${roleId}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: query
    };
    fetch(url, options)
    .then(data => data.json())
    .then((response) => {
      if (response && response.userData) {
        // Set the JWT on the localstorage and dispatch to store
        localStorage.setItem('token', response.token);
        const userData = {
          fullname: response.userData.fullname,
          roleId: response.userData.roleId,
          userId: response.userData.id
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));
        this.setState({
          isLoggedIn: true
        });
        // window.location.href = 'http://localhost:3000/home';
      } else {
        // Login failed handle action
        this.setState({
          isLoggedIn: false
        });
      }
    })
    .catch((error) => {
      console.log('err:', error);
    });
    this.props.updateUser(this.state.isLoggedIn, 'SIGNUP_ACTION');
  }
  render() {
    return (
      <div className="row">
        <div className="col s8 offset-s2">
          <div className="login-title">{(!this.state.isNewUser) ? 'Login' : 'Register' }</div>
            <Row>
              <Input id="user-email" type="email" label="Email" s={12} validate />
              <Input id="user-password" type="password" label="password" s={12} />
            </Row>
          <Row>
            <Col s={6}>
            <Button id="login-button" className="login-button" waves="light" onClick={this.validateUser}>Login</Button>
              <br /><br /><br />
              Not registered? &nbsp; &nbsp;
            <Link to="/Signup">Signup</Link>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state =>
   ({
     isLoggedIn: state.get('isLoggedIn')
   });

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateUser: (isLoggedIn, action) => {
    const currentUser = {
      type: action,
      isLoggedIn
    };
    dispatch(rootReducer(currentUser));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
