import React, { Component } from 'react'
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email:String! $name:String! $password:String!){
    signup(email:$email name:$name password:$password){
      name
      id
      email
      permissions
    }
  }
`

export default class SignUp extends Component {
  state={
    name:'',
    email:'',
    password:'',
  }

  handleOnChange=(e)=>{
    this.setState(
      {[e.target.name]:e.target.value}
    )
  }
  render() {
    return (
      <Mutation 
        mutation={SIGNUP_MUTATION} 
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
        {(signup, {loading, error})=>{
          return(
          <Form 
            method="post"
            onSubmit={ async(e)=>{
              e.preventDefault();
              const res = await signup()
              console.log(res)
              this.setState({
                name: '',
                email: '',
                password: '',
              })
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up</h2>
              <Error error={error}/>
              <label htmlFor="email">
                Email
                <input type="text" name="email" value={this.state.email} onChange={this.handleOnChange} />
              </label>
              <label htmlFor="name">
                Name
                <input type="text" name="name" value={this.state.name} onChange={this.handleOnChange} />
              </label>
              <label htmlFor="password">
                Password
                <input type="text" name="password" value={this.state.password} onChange={this.handleOnChange} />
              </label>
              
              <input type="submit"/>
            </fieldset>
          </Form>
          )
        }}
      </Mutation>
    )
  }
}
