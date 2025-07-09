import React from 'react';
import { assets } from '../../assets/assets';
import { LayoutDashboard, SquarePlus, List, ListCollapse } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const user = {
    firstName: 'Admin',
    lastName: 'User',
    imageUrl: assets.profile,
  };

  const adminNavlinks = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Add Shows',
      path: '/admin/add-shows',
      icon: SquarePlus,
    },
    {
      name: 'List Shows',
      path: '/admin/list-shows',
      icon: List,
    },
    {
      name: 'List Bookings',
      path: '/admin/list-bookings',
      icon: ListCollapse,
    },
  ];

  return (
    <div className="h-[calc(100vh)] flex flex-col items-center pt-8 w-full md:w-64 border-r border-gray-700 bg-gray-900/50 backdrop-blur-sm">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <img
          className="h-14 w-14 rounded-full border-2 border-purple-400/30 object-cover"
          src={user.imageUrl}
          alt="Admin profile"
        />
        <p className="mt-3 text-lg font-medium text-gray-300">
          {user.firstName} <span className="text-cyan-400">{user.lastName}</span>
        </p>
      </div>

      {/* Navigation Links */}
      <div className="w-full px-2 space-y-1">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/15 to-cyan-500/15 text-cyan-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <link.icon className={`w-5 h-5 ${link.icon === SquarePlus ? 'stroke-[2.5]' : ''}`} />
                <span className="text-sm font-medium">{link.name}</span>
                <span
                  className={`ml-auto h-2 w-2 rounded-full ${
                    isActive ? 'bg-cyan-400' : 'bg-transparent group-hover:bg-gray-600'
                  }`}
                />
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer/Version */}
      <div className="mt-auto mb-6 text-xs text-gray-500">
        v1.0.0
      </div>
    </div>
  );
};

export default AdminSidebar;