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
        <div className="row col s12">
          <div className="col s12 m6">
            <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                <span className="card-title">Document Management System</span>
                <h5> A full stack document management system,
                  complete with roles and privileges. Each document defines access rights;
                  the document defines which roles can access it.</h5>
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
