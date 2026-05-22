import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Book, 
  Grid, 
  Clock, 
  Heart, 
  Settings, 
  LogOut, 
  Package, 
  UserCircle 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Books', icon: Book, path: '/books' },
    { name: 'Categories', icon: Grid, path: '/categories' },
    { name: 'Wishlist', icon: Heart, path: '/wishlist' },
    { name: 'My Orders', icon: Package, path: '/orders' },
    { name: 'Reading History', icon: Clock, path: '/history' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar-container">
          <UserCircle size={28} />
          <div className="status-indicator"></div>
        </div>
        <div className="profile-text">
          <span className="profile-name">Zeeshan Ahmed</span>
          <span className="profile-role">Premium Member</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <Settings size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span>Settings</span>
            </>
          )}
        </NavLink>
        <button className="logout-btn">
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
