import AdminNav from "../components/admin/AdminNav"

export const metadata = {
    title: 'GM-Store Admin',
    description: 'GM-Store Admin Dashboard'
}

const AdminLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <div>
            <AdminNav />
            {children}
        </div>
    );
}
 
export default AdminLayout;