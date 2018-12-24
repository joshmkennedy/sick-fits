import React, { Component } from 'react'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import Link from 'next/link'
import styled from 'styled-components';
import {formatDistance } from 'date-fns'

import formatMoney from '../lib/formatMoney'
import OrderItemStyles from './styles/OrderItemStyles'
import Error from './ErrorMessage'

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY{
    orders(orderBy:createdAt_DESC){
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

const OrdersUl = styled.ul`
  display:grid;
  grid-gap:40px;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr) );
`

export default class Orders extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({data, error, loading})=>{
          if(loading) return <p>Loading...</p>
          if(error) return <Error error={error}/>
          return (
            <div>
              <h2>You have {data.orders.length}</h2>
              <OrdersUl>
                {data.orders.map(order=>(
                  <OrderItemStyles key={order.id}>
                    <Link href={{
                      pathname:'/order',
                      query: {id:order.id}
                    }}>
                      <a>
                        <div className="order-meta">
                          <p>{order.items.reduce((a, b)=> a + b.quantity, 0)} items</p>
                          <p>{order.items.length} Products</p>
                          <p>{formatDistance(order.createdAt, new Date())}</p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item=>(
                            <img key={item.id} src={item.image} alt={item.title}/>
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </OrdersUl>
            </div>
          )
        }}
      </Query>
    )
  }
}
