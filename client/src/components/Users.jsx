import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Users = () => {
  const [users, setUsers] = useState()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('api/auth/users', {
          signal: controller.signal,
        })
        const userNames = response.data.map((user) => user.username)
        isMounted && setUsers(userNames)
      } catch (error) {
        console.error(error)
      }
    }

    getUsers()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [axiosPrivate])

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  )
}

export default Users
