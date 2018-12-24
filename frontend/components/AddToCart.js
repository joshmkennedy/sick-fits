import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import {CURRENT_USER_QUERY} from './User'

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id:ID!){
    addToCart(id:$id){
      id
      quantity
    }
  }
`

export default class AddToCart extends Component {
  render() {
    const { id } = this.props
    return (
      <Mutation 
        mutation={ADD_TO_CART_MUTATION} 
        variables={{id}}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
      >
        {(addToCart, {data, loading})=>(
          <div>
          <button onClick={addToCart} disabled={loading}>Add{loading && 'ing'} To Cart 🛒</button>
          </div>
        )}
      </Mutation>
    )
  }
}
