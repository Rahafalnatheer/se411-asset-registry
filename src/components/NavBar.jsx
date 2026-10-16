import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Computers', end: true },
  { to: '/add', label: 'Add computer' },
  { to: '/about', label: 'About' },
]

export default function NavBar() {
  return (
    <header className="topbar">
      <span className="brand">Computer Asset Registry</span>
      <nav aria-label="Main menu">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
