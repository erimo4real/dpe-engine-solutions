import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '../features/auth/authSlice'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user, checking } = useSelector((s) => s.auth)
  const checked = useRef(false)

  useEffect(() => {
    if (!checked.current) {
      checked.current = true
      dispatch(checkAuth())
    }
  }, [dispatch])

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="size-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
      </div>
    )
  }

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/admin/login?redirect=${redirect}`} replace />
  }

  return children
}
