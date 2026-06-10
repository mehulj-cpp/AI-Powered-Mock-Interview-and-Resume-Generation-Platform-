import { Link } from "react-router"
import { useAuth } from "../features/auth/hooks/useAuth"

/**
 * Floating round avatar button (top-right) showing the signed-in user's
 * initials. Links to the Profile page. Rendered on Home and Interview so the
 * profile is reachable from anywhere inside the app.
 */
const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const AvatarButton = () => {
  const { user } = useAuth()

  return (
    <Link
      to="/profile"
      className="avatar-btn"
      aria-label="Open profile"
      title={user?.username ? `${user.username} — open profile` : "Open profile"}
    >
      {getInitials(user?.username)}
    </Link>
  )
}

export default AvatarButton
