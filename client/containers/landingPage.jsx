import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, browserHistory, hashHistory, Link } from 'react-router';
import rootReducer from '../reducers';
import { Button, Row, Col, Icon, Input } from 'react-materialize';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  displayHome() {
    return (
      <div>
        <Header />
        <div className="row col s12">
          <div className="col s12 m6">
            <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                <span className="card-title">Document Management System</span>
                <h5>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</h5>
              </div>
              <span className="card-title">Get Started</span>
              <div className="card-action">
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
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
