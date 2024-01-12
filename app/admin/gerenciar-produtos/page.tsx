import Container from "@/app/components/Container";
import GerenciarProdutosClient from "./GerenciarProdutosClient";
import getProducts from "@/actions/getProducts";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/products/NullData";


const GerenciarProdutos = async () => {

    const products = await getProducts({ category: null })
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return <NullData title="Oops! Acesso negado!"></NullData>
    }


    return (<div className="pt-8">
        <Container>
            <GerenciarProdutosClient products = {products}/>

        </Container>
    </div>);
}

export default GerenciarProdutos;