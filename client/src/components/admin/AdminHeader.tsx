import React from 'react';

const AdminHeader: React.FC = () => {
    return (
        <header className="bg-black text-white p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div>
                {/* You can add additional header elements here, like notifications or user profile */}
            </div>
        </header>
    );
};

export default AdminHeader;