import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import {format} from 'date-fns'
import Head from 'next/head'
import gql from 'graphql-tag'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import OrderStyles from './styles/OrderStyles'

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id:ID!){
    order(id:$id){
      id
      charge
      total
      createdAt
      user{
        id
        email
      }
      items{
        id
        title
        description
        image
        price
        quantity
      }
      
    }
  }
`

export default class Order extends Component {
  static PropTypes = {
    id: PropTypes.string.isRequired
  }
  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{id:this.props.id}}>
        {({data, loading, error})=>{
          if(loading) return <p>Loading...</p>
          if(error) return <Error error={error}/>
          const {order} = data
          return <OrderStyles>
            <p>
              <span>Order Id:</span>
              <span>{order.id}</span> 
            </p>
            <p>
              <span>Charge:</span>
              <span>{order.charge}</span>
            </p>
            <p>
              <span>Date:</span>
              <span>{format(order.createdAt, 'MMMM d, yyyy h:m a')}</span>
            </p>
            <p>
              <span>Order Total:</span>
              <span>{formatMoney(order.total)}</span>
            </p>
            <p>
              <span>Order Count:</span>
              <span>{order.items.length}</span>
            </p>
            <div className="items">
              {order.items.map(item=>(
                <div className="order-item" key={item.id}>
                  <img src={item.image} alt={item.title}/>
                  <div className="item-details">
                    <h2>{item.title}</h2>
                    <p>Qty: {item.quantity}</p>
                    <p>Each: {item.price}</p>
                    <p>Sub Total: {item.price * item.quantity}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </OrderStyles>
        }}
      </Query>
    )
  }
}
