'use client'

import { Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { MdAccessTime, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import moment from "moment";
import 'moment/locale/pt-br';

interface PedidosClientProps {
    orders: ExtendedOrder[];
}

type ExtendedOrder = Order & {
    user: User;
}

const PedidosClient: React.FC<PedidosClientProps> = ({orders}) => {
    
    const router = useRouter();
    let rows: any = [];

    if (orders) {
        rows = orders.map((order) => {
            return {
                id: order.id,
                customer: order.user.name,
                amount: formatPrice(order.amount / 100),
                paymentStatus: order.status,
                date: moment(order.createDate).locale('pt-br').fromNow(),
                deliveryStatus: order.deliveryStatus,
            };
        });
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'customer', headerName: 'Nome do cliente', width: 130 },

        {
            field: 'amount',
            headerName: 'Preço (BRL)',
            width: 130,
            renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">{params.row.amount}</div>
                );
            },
        },
        {
            field: 'deliveryStatus',
            headerName: 'Status de entrega',
            width: 130,
            renderCell: (params) => {
                return (
                    <div >
                        {params.row.deliveryStatus == 'pending' ? (
                            <Status
                                text="Pendente"
                                icon={MdAccessTime}
                                bg="bg-slate-200"
                                color="text-slate-700"
                            />
                        ) : params.row.deliveryStatus == 'dispatched' ?(
                            <Status
                                text="Despachado"
                                icon={MdDeliveryDining}
                                bg="bg-purple-200"
                                color="text-purple-700"
                            />): params.row.deliveryStatus == 'delivered' ?
                            <Status
                            text="Entregue"
                            icon={MdDone}
                            bg="bg-green-200"
                            color="text-green-700"
                        /> : <></>}
                    </div>
                );
            },
        },

        {
            field: 'paymentStatus',
            headerName: 'Status do pagamento',
            width: 130,
            renderCell: (params) => {
                return (
                    <div >
                        {params.row.paymentStatus == 'pending' ? (
                            <Status
                                text="Pendente"
                                icon={MdAccessTime}
                                bg="bg-slate-200"
                                color="text-slate-700"
                            />
                        ) : params.row.paymentStatus == 'complete' ? (
                            <Status
                                text="Completo"
                                icon={MdDone}
                                bg="bg-green-200"
                                color="text-green-700"
                            />):  
                            <></>
                            }
                    </div>
                );
            },
        },
        { field: 'date', headerName: 'Data', width: 130 },

        {
            field: 'action',
            headerName: 'Ações',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flex justify-between gap-4 w-full">
                        <ActionBtn icon={MdRemoveRedEye} onClick={() =>{
                            router.push(`/order/${params.row.id}`);
                        }} />
                    </div>
                );
            },
        },

    ];

    return (
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Gerenciar Pedidos" center></Heading>
            </div>


            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 9 },
                        },
                    }}
                    pageSizeOptions={[9, 10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>

        </div>
    );
}

export default PedidosClient;