import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Icon, Input } from 'react-materialize';
import { Router, Route, browserHistory, hashHistory, Link } from 'react-router';
import rootReducer from '../reducers';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    const loginState = !!localStorage.getItem('token'); // returns true if token and false otherwise
    if (!loginState) {
      browserHistory.push('/');
    } else {
      browserHistory.push('/home');
    }
  }
  displayHome() {
    return (
      <div>
        <Header />
        <div className="centerDiv">
          <div className="row col s12">
            <div className="col s6 m6">
              <div className="card">
                <div className="card-content">
                  <span className="card-title font-effect-3d-float teal"><h4>Document Management System</h4></span>
                  <h5> A complete document management system,
                   with roles and privileges. Each document defines access rights;
                    the document defines which roles can access it.</h5>
                </div>
                <div className="card-action">
                  <Link className="font-effect-3d-float" id="landingLoginButton" to="/login">Login</Link>
                  <Link className="font-effect-3d-float" id="landingSignupButton" to="/signup">Signup</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  render() {
    return this.displayHome();
  }
}
export default LandingPage;
