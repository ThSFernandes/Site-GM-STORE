'use client'

import Link from "next/link";
import AdminNavItem from "./AdminNavItem";
import { MdDashboard, MdDns, MdFormatListBulleted, MdLibraryAdd } from "react-icons/md";
import { usePathname } from "next/navigation";
import Container from "../Container";

const AdminNav = () => {

    const pathname = usePathname()

    return (
        <div className="w-full shadow-sm top-28 border-b-[1px] pt-4">
            <Container>
                <div className="flex flex-row items-center justify-between md:justify-center gap-8 md:gap-12 overflow-auto flex-nowrap">
                    <Link href="/admin">
                        <AdminNavItem
                            label="Sumário"
                            icon={MdDashboard}
                            selected={pathname === '/admin'}
                        />
                    </Link>
                    <Link href="/admin/adicionar-produtos">
                        <AdminNavItem
                            label="Adicionar Produtos"
                            icon={MdLibraryAdd}
                            selected={pathname === '/admin/adicionar-produtos'}
                        />
                    </Link>
                    <Link href="/admin/gerenciar-produtos">
                        <AdminNavItem
                            label="Gerenciar Produtos"
                            icon={MdDns}
                            selected={pathname === '/admin/gerenciar-produtos'}
                        />
                    </Link>
                    <Link href="/admin/gerenciar-pedidos">
                        <AdminNavItem
                            label="Gerenciar Pedidos"
                            icon={MdFormatListBulleted}
                            selected={pathname === '/admin/gerenciar-pedidos'}
                        />
                    </Link>
                </div>
            </Container>
        </div>
    );
}

export default AdminNav;