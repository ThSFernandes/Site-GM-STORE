import Container from "@/app/components/Container";
import PedidosClient from "./PedidosClient";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/products/NullData";
import getOrdersByUserId from "@/actions/getOrderByUserId";


const Pedidos = async () => {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return <NullData title="Oops! Acesso negado!"></NullData>
    }

    const orders = await getOrdersByUserId(currentUser.id);

    if (!orders) {
        return <NullData title="Nenhum pedido feito ainda!"></NullData>
    }

    return (<div className="pt-8">
        <Container>
            <PedidosClient orders = {orders}/>
        </Container>
    </div>);
}

export default Pedidos;