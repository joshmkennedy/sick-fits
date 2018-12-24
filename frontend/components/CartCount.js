import React from 'react'
import styled from 'styled-components'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

const AnimationStyles = styled.span`
  position:relative;
  .count{
    display:block;
    backface-visibility:hidden;
    position:relative;
    transition:all .4s;
  }
  .count-enter{
    transform: rotateX(0.5turn);
  }
  .count-enter-active{

    transform: rotateX(0);
  }
  .count-exit{
    position:absolute;
    top:0;
    transform: rotateX(0.5turn);
  }
  .count-exit-active{
    transform:  rotateX(0);

  }
`

const Dot = styled.div`
  background:${props => props.theme.red };
  border-radius:50%;
  color:white;
  padding:.5rem;
  line-height:2rem;
  min-width:3rem;
  margin-left: 3rem;
  font-weight:100;
  font-feature-settings:"tnum";
  font-variant-numeric: tabular-nums;
`

const CartCount = ({count})=>(
  <AnimationStyles>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        className="count"
        classNames="count"
        key={count}
        timeout={{ enter: 400, exit: 400 }}
      >
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyles>
)
export default CartCount