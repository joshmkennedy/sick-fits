import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components'

import Error from './ErrorMessage';



const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id:ID!){
    item(where:{id:$id}){
      id
      title
      description
      largeImage
      price
    }
  }
`

const ItemStyles = styled.div`
  max-width:1200px;
  display:grid;
  margin:2rem auto;
  box-shadow:${props => props.theme.bs};
  grid-auto-flow:column;
  grid-template-columns:1fr;
  min-height:800px;
  img{
    width:100%;
    height:100%;
    object-fit:contain;
  }
`

class SingleItem extends Component {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{id:this.props.id}}>
        {({data, loading, error})=>{
          if(loading) return <p>Loading...</p>
          if(error) return <Error error={error}/>
          if(!data.item) return <p>No items found for this Id {this.props.id}</p>
          return(
            <ItemStyles>
              <img src={data.item.largeImage} alt={data.item.title}/>
              <div>
                <h3>{data.item.title}</h3>
                <p>{data.item.description}</p>
              </div>
            </ItemStyles>
          )
        }}
      </Query>
    )
  }
}
export default SingleItem