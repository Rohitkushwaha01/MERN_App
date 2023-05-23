import React, { Fragment, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Alert from "./components/layout/Alert";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Register from "./components/auth/Register";
import "./App.css";
// redux
import { Provider } from "react-redux";
import store from './store';
import { loadUser } from "./action/auth";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/register' element={<Register />} />
            <PrivateRoute exact path='/dashboard' element={<Dashboard />} />
          </Routes>
          <Alert />
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
