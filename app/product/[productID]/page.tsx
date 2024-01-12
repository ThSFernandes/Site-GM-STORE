import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/products/NullData";
import AddRating from "./AddRating";
import getCurrentUser from "@/actions/getCurrentUser";

// Define uma interface chamada IPrams com uma propriedade opcional ProductID do tipo string.
interface IParams {
    productID?: string;
}

// Define um componente funcional do React chamado Product que recebe um objeto com uma propriedade params do tipo IPrams como suas props.
const Product = async({params}: { params: IParams }) => {
    
    // Registra o valor do objeto params no console.
    //console.log("params", params);  

    const product = await getProductById(params);
    const user = await getCurrentUser();

    if(!product) return <NullData title="Oops! Produto com o id selecionado não existe."/>
    
    return ( <div>
        <Container>
            <ProductDetails product={product}/>
            <div className="flex flex-col mt-20 gap-4">
               <AddRating product={product} user={user}/>
               <ListRating product={product}/>
            </div>
        </Container>
    </div>);
};

// Exporta o componente Product como a exportação padrão deste módulo.
export default Product;