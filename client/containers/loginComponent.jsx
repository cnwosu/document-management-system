import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Login from '../components/login.jsx';
// import actionTypes from '../actions/actionTypes';
import rootReducer from '../reducers';

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    const isLoggedIn = false;
    this.state = { isLoggedIn };
  }
  componentWillMount() {

    // Before component mount, check local storage for token and update state
    // @TODO: verify token integrity to ensure it is not tampered with
    const loginState = !!localStorage.getItem('token'); // returns true if token and false otherwise
    this.setState({
      isLoggedIn: loginState
    });

    this.props.updateUser(loginState);
  }
  render() {
    return (
      <div>
        <Header />
        <Login />
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
