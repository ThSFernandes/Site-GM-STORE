'use client'

import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { formatPrice } from "@/utils/formatPrice";
import { Order } from "@prisma/client";
import moment from "moment";
import 'moment/locale/pt-br';
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from "react-icons/md";
import OrderItem from "./OrderItem";

interface OrderDetailsProps {
    order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {

    return (
        <div className="max-w-[1150px] m-auto flex flex-col gap-2">
            <div className="mt-8">
                <Heading title="Detalhes da Ordem" />
            </div>
            <div>ID da Ordem: {order.id}</div>
            <div>
                Valor total: <span className="font-bold">{formatPrice(order.amount)}</span>
            </div>
            <div className="flex gap-2 item-center">
                <div>Status do Pagamento:</div>
                <div>
                    {order.status == 'pending' ? (
                        <Status
                            text="pendente"
                            icon={MdAccessTimeFilled}
                            bg="bg-slate-200"
                            color="text-slate-700"
                        />
                    ) : order.status === 'complete' ? (
                        <Status
                            text="completo"
                            icon={MdDone}
                            bg="bg-green-200"
                            color="text-green-700"
                        />
                    ) : <></>}
                </div>
            </div>
            <div className="flex gap-2 item-center">
                <div>Status da Entrega:</div>
                <div>
                    {order.deliveryStatus == 'pending' ? (
                        <Status
                            text="pendente"
                            icon={MdAccessTimeFilled}
                            bg="bg-slate-200"
                            color="text-slate-700"
                        />
                    ) : order.deliveryStatus === 'dispatched' ? (
                        <Status
                            text="despachado"
                            icon={MdDeliveryDining}
                            bg="bg-purple-200"
                            color="text-purple-700"
                        />
                    ) : order.deliveryStatus === 'delivered' ? (
                        <Status
                            text="entregue"
                            icon={MdDone}
                            bg="bg-green-200"
                            color="text-green-700"
                        />
                    ) : <></>}
                </div>
            </div>
            <div>Data: {moment(order.createDate).locale('pt-br').fromNow()}</div>
            <div>
                <h2 className="font-semibold mt-4 mb-2">Produtos dos pedidos</h2>
                <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center">
                    <div className="col-span-2 justify-self-start">PRODUTO</div>
                    <div className="justify-self-center">PREÇO</div>
                    <div className="justify-self-center">QUANTIDADE</div>
                    <div className="justify-self-end">TOTAL</div>
                </div>
                {order.products &&
                    order.products.map((item) => {
                        return <OrderItem key={item.id} item={item}></OrderItem>
                    })}
            </div>
        </div>
    );
}

export default OrderDetails;