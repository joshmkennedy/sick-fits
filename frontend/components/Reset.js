import React, { Component } from 'react'
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken:String! $password:String! $confirmPassword:String!){
    resetPassword(resetToken:$resetToken password:$password confirmPassword:$confirmPassword){
     id
     email
     name
    }
  }
`

export default class Reset extends Component {
  state = {
    password:'',
    confrimPassword:''
  }

  handleOnChange = (e) => {
    this.setState(
      { [e.target.name]: e.target.value }
    )
  }
  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken:this.props.resetToken,
          password:this.state.password,
          confirmPassword:this.state.confirmPassword,
        }}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(resetRequest, { loading, error, called }) => {
          return (
            <Form
              method="post"
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await resetRequest()
                console.log(res)
                this.setState({
                  password:'',
                  confirmPassword:''
                })
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request Password</h2>
                <Error error={error} />
               
                <label htmlFor="email">
                  Password
                <input type="text" name="password" value={this.state.password} onChange={this.handleOnChange} />
                </label>
                <label htmlFor="email">
                  Confirm Password
                <input type="text" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleOnChange} />
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
