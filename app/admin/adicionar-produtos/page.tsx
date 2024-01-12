import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import AdicionarProdutoForm from "./AdicionarProdutoForm";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/products/NullData";

const AdicionarProdutos = async() => {

    const currentUser = await getCurrentUser();

    if(!currentUser || currentUser.role !== 'ADMIN') {
        return <NullData title="Oops! Acesso negado!"></NullData>
    }

    return ( <div className="p-8">
    <Container>
        <FormWrap>
            <AdicionarProdutoForm/>
        </FormWrap>
    </Container>
    </div> );
}
 
export default AdicionarProdutos;