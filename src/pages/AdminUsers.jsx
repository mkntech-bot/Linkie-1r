import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminUsers() {
  const { isAdmin, loading } = useAuth()

  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!loading && isAdmin) {
      fetchUsers()
    }
  }, [loading, isAdmin])

  async function fetchUsers() {
    setLoadingUsers(true)
    setError(null)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      setUsers(data || [])
    }

    setLoadingUsers(false)
  }

  if (loading) {
    return <div>Checking access...</div>
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  if (loadingUsers) {
    return <div>Loading users...</div>
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Total users: <strong>{users.length}</strong>
      </p>

      {error && <p>Error: {error}</p>}

      <button onClick={fetchUsers}>Refresh Users</button>

      <hr />

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id}>
              <h3>{user.display_name || 'No name'}</h3>
              <p>Email: {user.email || 'No email'}</p>
              <p>Admin: {user.is_admin ? 'Yes' : 'No'}</p>
              <p>
                Created:{' '}
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : 'Unknown'}
              </p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}