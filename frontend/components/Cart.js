import React from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'

import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'
import User from './User'
import CartItem from './CartItem'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'
import TakeMyMoney from './TakeMyMoney'

const LOCAL_STATE_QUERY= gql`
 query LOCAL_STATE_QUERY{
   cartOpen @client
 }
`
const CART_TOGGLE_MUTATION= gql`
 mutation CART_TOGGLE_MUTATION{
cartToggle @client
 }
`

const Composed = adopt({
  user: ({render})=><User>{render}</User>,
  cartToggle: ({ render }) => <Mutation mutation={CART_TOGGLE_MUTATION}>{render}</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
}) 

const Cart = (props)=>{

  return(
    <Composed>
      {({user, cartToggle, localState})=>{
        const me = user.data.me
        if(!me) return null;
        return(  
          <CartStyles open={localState.data.cartOpen}>
            <header>
              <CloseButton onClick={cartToggle} title="close">&times;</CloseButton>
              <Supreme>{me.name}'s Cart</Supreme>
              <p>You have {me.cart.length} items in your cart</p>
            </header>
            <ul>
              {me.cart.map(cartItem=>(
                <CartItem cartItem={cartItem} key={cartItem.id}/>
              ))}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              {me.cart.length && (
                <TakeMyMoney>
                  <SickButton>Checkout</SickButton>
                </TakeMyMoney>
              )}
            </footer>
          </CartStyles>
        )
      }}
    </Composed>
  )
}
export default Cart
export {LOCAL_STATE_QUERY, CART_TOGGLE_MUTATION}