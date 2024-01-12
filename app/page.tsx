export const revalidate = 0;

import getProducts, { IProductParams } from "@/actions/getProducts";
import { truncateText } from "@/utils/truncateText";
import Container from "./components/Container";
import NullData from "./components/products/NullData";
import ProductCard from "./components/products/ProductCard";

interface HomeProps{
  searchParams: IProductParams;
}

export default async function Home({searchParams}: HomeProps) {
  const products = await getProducts(searchParams);

  if(products.length === 0){
    return <NullData title='Nenhum produto encontrado! Cliquem em "Tudo" para limpar o filtro'/>
  }

  //mostrar os produtos de forma aleatória toda hora que recarregar a página
  function shuffleArray(array: any){
    for(let i = array.length -1; i > 0; i--){
      const j = Math. floor(Math. random() * (i+1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledProducts = shuffleArray(products);

  return (
  <div className="p-8">
    <Container>
      <div className="grid grid-cols-2 
      sm:grid-cols-3 lg:grid-cols- 4 xl:grid-cols-5
      2x1:grid-cols-5 gap-8">
        {shuffledProducts.map((product: any)=>{
          return <ProductCard data={product} key={product.id}/>;
        })}
      </div>
    </Container>
  </div>
  );
}