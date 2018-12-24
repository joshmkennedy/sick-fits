import React, { Component } from 'react'
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import {CURRENT_USER_QUERY } from './User'

const SIGN_OUT_MUTATION = gql`
 mutation SIGN_OUT_MUTATION{
   signout{
     message
   }
 }
`

export default class SignOut extends Component {
  render() {
    return (
      <Mutation 
        mutation={SIGN_OUT_MUTATION}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(signout)=> <button onClick={signout}>Sign out</button>}
      </Mutation>
    )
  }
}
