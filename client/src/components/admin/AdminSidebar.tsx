import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Box, ShoppingCart, Users, Settings as SettingsIcon, LogOut } from 'lucide-react';

const AdminSidebar = () => {
    return (
        <div className="fixed left-0 top-0 h-full w-16 bg-black text-white flex flex-col">
            <div className="flex flex-col items-center mt-4">
                <Link to="/admin/dashboard" className="flex items-center justify-center w-full h-16 hover:bg-gray-800">
                    <Home size={24} />
                </Link>
                <Link to="/admin/products" className="flex items-center justify-center w-full h-16 hover:bg-gray-800">
                    <Box size={24} />
                </Link>
                <Link to="/admin/orders" className="flex items-center justify-center w-full h-16 hover:bg-gray-800">
                    <ShoppingCart size={24} />
                </Link>
                <Link to="/admin/customers" className="flex items-center justify-center w-full h-16 hover:bg-gray-800">
                    <Users size={24} />
                </Link>
                <Link to="/admin/settings" className="flex items-center justify-center w-full h-16 hover:bg-gray-800">
                    <SettingsIcon size={24} />
                </Link>
            </div>
            <div className="mt-auto mb-4">
                <button className="flex items-center justify-center w-full h-16 hover:bg-gray-800">
                    <LogOut size={24} />
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;