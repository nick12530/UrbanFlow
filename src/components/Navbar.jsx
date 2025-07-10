import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="main-nav">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/transport">Transport</NavLink>
      <NavLink to="/food">Food</NavLink>
    </nav>
  );
}