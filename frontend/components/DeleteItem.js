import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id:ID!){
    deleteItem(id:$id){
      id
    }
  }
`

class DeleteItem extends Component {
  update = (cache, payload)=>{
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    console.log(data)
     data.items = data.items.filter((item)=>item.id!==payload.data.deleteItem.id) 
    /* console.log(data.items)
    console.log(payload) */
    cache.writeQuery({query: ALL_ITEMS_QUERY, data})
  }
  render() {
    return (
      <Mutation 
        mutation={DELETE_ITEM_MUTATION} 
        variables={{id:this.props.id}}
        update={this.update}
        optimisticResponse={{
          __typename:'Mutation',
          deleteItem:{
            __typename:'Item',
            id: this.props.id
          }
        }}
      >
        {(deleteItem, {data, loading, error})=>{

          return(
            <button onClick={()=>{
              if (confirm("are you sure you want to delete this item")) {
                deleteItem().catch((err)=>{
                  alert(err.message)
                })
              }
            }}>
            {this.props.children}
            </button>
          )
        }}
      </Mutation>
    )
  }
}
export default DeleteItem