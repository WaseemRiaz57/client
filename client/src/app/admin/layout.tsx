import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 bg-gray-100 p-4">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;