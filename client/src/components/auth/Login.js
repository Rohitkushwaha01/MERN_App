import {React, useState}from 'react'
import { Link, Navigate } from 'react-router-dom'
import { connect} from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../action/auth';

const Login = ({login, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const {email, password} = formData;

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async(e) =>{
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  }

  // redirect if logged in

  if(isAuthenticated){
    return <Navigate to="/dashboard"/>;
  }

  return (
    <section className="container">
      {/* <div className="alert alert-danger">
        Invalid credentials
      </div> */}
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={onChange} 
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={onChange} 
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  )
}

login.PropTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login);
