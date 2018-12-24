import React, { Component } from 'react'
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';


import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email:String! $password:String!){
    signin(email:$email password:$password){
      name
      id
      email
    }
  }
`

export default class SignIn extends Component {
  state = {
    email: '',
    password: '',
  }

  handleOnChange = (e) => {
    this.setState(
      { [e.target.name]: e.target.value }
    )
  }
  render() {
    return (
      <Mutation 
        mutation={SIGNIN_MUTATION} 
        variables={this.state}
        refetchQueries={ [ { query: CURRENT_USER_QUERY } ] }
      >
        {(signin, { loading, error }) => {
          return (
            <Form
              method="post"
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await signin()
               // console.log(res)
                this.setState({
                  email: '',
                  password: '',
                })

              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign In</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                <input type="text" name="email" value={this.state.email} onChange={this.handleOnChange} />
                </label>
                <label htmlFor="password">
                  Password
                <input type="text" name="password" value={this.state.password} onChange={this.handleOnChange} />
                </label>

                <input type="submit" />
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
