import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, ShieldAlert, Settings } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', padding: '0 0.875rem 0.5rem' }}>
        Administration
      </div>
      <NavLink to="/admin" end className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <LayoutDashboard size={18} />
        <span>Overview</span>
      </NavLink>
      <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <Users size={18} />
        <span>Users</span>
      </NavLink>
      <NavLink to="/admin/items" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <FileText size={18} />
        <span>Items</span>
      </NavLink>
      <NavLink to="/admin/claims" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
        <ShieldAlert size={18} />
        <span>Claims</span>
      </NavLink>
    </aside>
  );
};

export default Sidebar;
