export interface AdminLink {
    name: string;
    path: string;
    icon: React.ReactNode;
}

export interface AdminSidebarProps {
    links: AdminLink[];
}

export interface AdminLayoutProps {
    children: React.ReactNode;
}