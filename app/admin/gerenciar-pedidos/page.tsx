import Container from "@/app/components/Container";
import GerenciarPedidosClient from "./GerenciarPedidosClient";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/products/NullData";
import getOrders from "@/actions/getOrders";


const GerenciarPedidos = async () => {

    const orders = await getOrders();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return <NullData title="Oops! Acesso negado!"></NullData>
    }


    return (<div className="pt-8">
        <Container>
            <GerenciarPedidosClient orders = {orders}/>
        </Container>
    </div>);
}

export default GerenciarPedidos;