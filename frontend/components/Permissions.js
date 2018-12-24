import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import {CURRENT_USER_QUERY} from './User'
import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'
import propTypes from 'prop-types'


const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY{
    users{
      permissions
      id
      email
      name
    }
  }
`
const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_POSSIBLE_PERMISSIONS = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const Permissions = props =>(
  <Query query={ALL_USERS_QUERY}>
    {({data, error})=>
      console.log(data) ||
      (
      <div>
        <Error error={error}/>
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {ALL_POSSIBLE_PERMISSIONS.map((permission, index)=>(
                  <th key={index}>{permission}</th>
                ))}
                  <th>👇</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user, index)=>(<UserPermission key={index} user={user}/>))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
)


class UserPermission extends React.Component{
  static propTypes = {
    user: propTypes.shape({
      name:propTypes.string,
      email:propTypes.string,
      id:propTypes.string,
      permissions:propTypes.array,
    }).isRequired
  }
  state = {
    permissions:this.props.user.permissions,
  }
  handleOnPermissionChange = (e, updatePermissions)=>{
    const checkbox = e.target
    let updatedPermissions = [...this.state.permissions]
    if(checkbox.checked){
      updatedPermissions.push(checkbox.value)
    }else{
      updatedPermissions = updatedPermissions.filter(permission=> permission !== checkbox.value)
    }
    this.setState({ permissions: updatedPermissions }, updatePermissions)
    
    
  }
  render(){
    const { user } = this.props
    return(
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions:this.state.permissions,
          userId:this.props.user.id
        }}
      >
        {(updatePermissions,{loading, error})=>(
          <>
          {console.log(this.props.user.id)}
            {error && <tr><td colSpan="8"><Error error={error} /></td></tr>}
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {ALL_POSSIBLE_PERMISSIONS.map((permission, index) => (
              <td key={index}>
                <label htmlFor={`${user.id}-permission-${permission}`}>
                  <input
                    type="checkbox"
                    checked={this.state.permissions.includes(permission)}
                    value={permission}
                    onChange={(e)=>this.handleOnPermissionChange(e, updatePermissions)}
                    id={`${user.id}-permission-${permission}`}
                  />
                </label>
              </td>
            ))}
            <td>
              <SickButton
                type="button"
                disabled={loading}
                onClick={updatePermissions}
              >
                  Updat{loading ? 'ing' : 'e'}
              </SickButton>
            </td>
          </tr>
          </>
        )}
      </Mutation>
    )
  }
}
export default Permissions