import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

import Form from './styles/Form'
import Error from './ErrorMessage'
import formmatMoney from '../lib/formatMoney'
import {ALL_ITEMS_QUERY} from './Items'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title:String! 
    $description:String! 
    $price:Int!
    $image:String 
    $largeImage:String
  ){
    createItem(
      title :$title
      description : $description
      price:$price
      image:$image
      largeImage: $largeImage
    ){
      id
    }
  }
`

class CreateItem extends Component {
  state={
    title:'',
    description:'',
    image:'',
    largeImage:'',
    price:{},
  }
  handleOnChange = (e)=>{
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value): value
    this.setState({
      [name]:val
    })
  }
  uploadFile = async e=>{
    console.log('uploading file...')
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'sickfits')

    const res = await fetch('https://api.cloudinary.com/v1_1/bc-of-cloudinary/image/upload',{
      method:'POST',
      body: data,
    });
    const file = await res.json()
    console.log(file)
    this.setState({
      image:file.secure_url,
      largeImage:file.eager[0].secure_url,
    })
  }
  
  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state} refetchQueries={[{query:ALL_ITEMS_QUERY}]}>
        {(createItem, {error, loading})=>(

          <Form onSubmit={ async (e)=>{
            //stop form from submitting
            e.preventDefault();
            //creates the Item
            const res = await createItem()
            //change the page
            Router.push({
              pathname:'/item',
              query: {id:res.data.createItem.id}
            })
            console.log(res)
          }} >
            <h2>Create An Item To Sell</h2>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input type='text' id="title" name="title" placeholder="title"  value={this.state.title} onChange={this.handleOnChange} required />
              </label>
              <label htmlFor="price">
                Price
                <input type='number' id="price" name="price" placeholder="price" value={this.state.price} onChange={this.handleOnChange} required />
              </label>
              <label htmlFor="description">
                Description
                <textarea id="description" name="description" placeholder="description"  value={this.state.description} onChange={this.handleOnChange} required/>
              </label>
              <label htmlFor="image">
                Image
                  <input type='file' id="image" name="image" placeholder="image" onChange={this.uploadFile} />
                {this.state.image && <img src={this.state.image} alt={this.state.title}/> }
              </label> 
              <input type="submit" />
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}
export default CreateItem
export { CREATE_ITEM_MUTATION }