import Container from "@/app/components/Container";
import OrderDetails from "./OrderDetails";
import getOrderById from "@/actions/getOrderById";
import NullData from "@/app/components/products/NullData";

// Define uma interface chamada IPrams com uma propriedade opcional OrderID do tipo string.
interface IParams {
    orderId?: string;
}

// Define um componente funcional do React chamado Order que recebe um objeto com uma propriedade params do tipo IPrams como suas props.
 const Order = async ({ params }: { params: IParams }) => {
    const order = await getOrderById(params);
    
    if(!order) return <NullData title="Sem pedidos ainda"></NullData>

    return (
        <div className="p-8">
            <Container>
                <OrderDetails order={order}/>
            </Container>
        </div>
    );
};

export default Order;