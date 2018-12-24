import Link from 'next/link';
import {Mutation} from 'react-apollo'

import NavStyles from './styles/NavStyles';
import User from './User';
import SignOut from './SignOut'
import {CART_TOGGLE_MUTATION} from './Cart'
import CartCount from './CartCount'

const Nav = () => (
  <User>
    {({ data: {me} }) => (
        <NavStyles>
          <Link href="/shop">
            <a>Shop</a>
          </Link>
          
          { me && (
            <>
              <Link href="/sell">
                <a>Sell</a>
              </Link>
              <Link href="/orders">
                <a>Orders</a>
              </Link>
              <Link href="/me">
                <a>Account</a>
              </Link>
              <SignOut/>
              <Mutation mutation={CART_TOGGLE_MUTATION}>
                {(cartToggle)=>(
                  <button onClick={cartToggle}>
                    My Cart
                    <CartCount count={me.cart.reduce((tally, cartItem)=>  tally + cartItem.quantity, 0)}/> 
                  </button>
                )}
              </Mutation>
            </>
          )}
          {!me && (
            <Link href="/signup">
              <a>Sign In</a>
            </Link> 
          )}
          
        </NavStyles>
      )
    }
  </User>
);

export default Nav;
