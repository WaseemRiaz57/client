import AdminLayout from '../layout';

const AdminPage = () => {
    return (
        <AdminLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="mt-2">Welcome to the admin dashboard. Use the sidebar to navigate through different sections.</p>
            </div>
        </AdminLayout>
    );
};

export default AdminPage;