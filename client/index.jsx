import React from 'react';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Router, Route, browserHistory, hashHistory } from 'react-router';
import AppComponent from './containers/appComponent.jsx';
import LoginComponent from './containers/loginComponent.jsx';
import SignupComponent from './containers/signupComponent.jsx';
import LandingPage from './containers/landingPage.jsx';

import rootReducer from './reducers';

const loggerMiddleware = createLogger();

function configureStore(initialState) {
  return createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(
                thunkMiddleware,
                loggerMiddleware
            ),
        )
    );
}

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  // For monitoring store changes
});
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={LandingPage} />
      <Route path="/home" component={AppComponent} />
      <Route path="/login" component={LoginComponent} />
      <Route path="/signup" component={SignupComponent} />
      <Route path="*" component={AppComponent} />
    </Router>
  </Provider>, document.getElementById('app'));
