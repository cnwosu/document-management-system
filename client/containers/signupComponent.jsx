import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Signup from '../components/signup.jsx';
// import actionTypes from '../actions/actionTypes';
import rootReducer from '../reducers';

class SignupComponent extends Component {
  constructor(props) {
    super(props);
    const isLoggedIn = false;
    this.state = { isLoggedIn };
  }

  componentWillMount() {
    browserHistory.push('/signup');
    // Before component mount, check local storage for token and update state
    // @TODO: verify token integrity to ensure it is not tampered with
    const loginState = !!localStorage.getItem('token'); // returns true if token and false otherwise

  }

  render() {
    return (
      <div>
        <Header />
        <Signup />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.get('isLoggedIn')
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateUser: (isLoggedIn) => {
      const currentUser = {
        type: 'LOGIN_ACTION',
        isLoggedIn
      };
      dispatch(rootReducer(currentUser));
      // window.location.href = `${window.location}home`;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupComponent);
