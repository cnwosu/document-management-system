import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import Login from '../components/login.jsx';
import HomePage from '../components/home.jsx';
import rootReducer from '../reducers';

class AppComponent extends Component {
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
        {
            (this.state.isLoggedIn)
                ? <HomePage />
                : <Login />
        }
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
