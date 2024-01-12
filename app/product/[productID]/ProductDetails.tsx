"use client";

import SetColor from "@/app/components/products/SetColor";
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { useCallback } from 'react';
import Product from "./page";
import SetQuantity from "@/app/components/products/SetQuantity";
import Button from "@/app/components/Button";
import ProductImage from "@/app/components/products/ProductImage";
import { useCart } from "@/hooks/UseCart";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

// Lembrar que o do tipo cliente e não servidor 
interface ProductDetailsProps {
    product: any
}

export type CartProductType = {
    id: string,
    name: string,
    description: string,
    category: string,
    brand: string,  
    selectedImg: SelectedImgType,
    quantity: number,
    price: number
}

export type SelectedImgType = {
    color: string,
    colorCode: string,
    image: string
}

const Horizontal = () => {
    return <hr className="W-[30% my-3" />;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    const {handleAppProductToCart, cartProducts} = useCart();
    const [isProductInCart, setIsProductInCart] = useState(false);
    const [cartProduct, setCartProduct] =
     useState<CartProductType>({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand, //talvez não precise da marca depois 
        selectedImg: { ...product.images[0] },
        quantity: 1,
        price: product.price,
    });
    const router = useRouter()

    //verificar pelo console que altera o atributo cor do produto
    console.log(cartProducts);
  
    useEffect(() =>{
        setIsProductInCart(false)

        if(cartProducts){
            const existingIndex = cartProducts.findIndex((item)=> item.id == product.id)

            if(existingIndex > -1){
                setIsProductInCart(true)
            }
        }
    } ,[cartProducts])

    const productRating =
        product.reviews.reduce((acc: number, item: any) =>
            item.rating + acc, 0) / product.reviews.length

    const handleColorSelect = useCallback(
        (value: SelectedImgType) => {
            setCartProduct((prev) => {
                return { ...prev, selectedImg: value };
            });
        },
        [cartProduct.selectedImg]
    );

    const handleQtyIncrease = useCallback(() => {
        if (cartProduct.quantity == 99) {
            return;
        }
        setCartProduct((prev) => {
            return { ...prev, quantity: prev.quantity + 1 };
        });
    }, [cartProduct]);
    const handleQtyDecrease = useCallback(() => {
        if (cartProduct.quantity == 1) {
            return;
        }
        setCartProduct((prev) => {
            return { ...prev, quantity: prev.quantity - 1 };
        })
    }, [cartProduct]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-5">
            <ProductImage cartProduct={cartProduct}
                product={product}
                handleColorSelect={handleColorSelect}
            />
            <div className="flex flex-col gap-1 text-slate-500 tex-sm">
                <h2 className="text-3xl font-medium text-slate-700 mt-8"> {product.name} </h2>
                <div className="flex items-center gap-2">
                    <Rating value={productRating} readOnly />
                    <div>{product.reviews.length} reviews</div>
                </div>
                <Horizontal />
                <div className="text-justify"> {product.description}
                    <Horizontal />
                    <div>
                        <span className="font-semibold"> Categoria:</span> {product.category}
                    </div>
                    <div>
                        <span className="font-semibold"> Marca:</span> {product.brand}
                    </div>
                    <div className={product.inStock ? " text-teal-400" : "text-rose-400"}> {product.inStock ? "Em estoque " : "Sem estoque "} {/* Se tiver estoque verificando por operador lógico */}
                    </div>
                    <Horizontal />
                    {isProductInCart ? (
                    <>
                    <p className="mb-2 text-slate-500 flex item-center gap-1">
                        <MdCheckCircle className="text-teal-400" size={20}/>
                        <span>Produto adicionado no carrinho </span>
                    </p>
                    <div>
                        <Button label="Ver carrinho" outline onClick={() => {
                            router.push("/cart");
                        }}/>
                    </div>
                    </> 
                    ): (<>
                        <SetColor
                            cartProduct={cartProduct}
                            images={product.images}
                            handleColorSelect={handleColorSelect}
                        />
                        <Horizontal />
                        <SetQuantity
                            cartProduct={cartProduct}
                            handleQtyIncrease={handleQtyIncrease}
                            handleQtyDecrease={handleQtyDecrease}
                        />
                        <Horizontal />

                        <div className="max-w-[300px]">  {/*Muda o tamanho do botão */}
                            <Button label="Adicionar ao Carrinho" onClick={() => handleAppProductToCart(cartProduct)}
                            />
                        </div>
                        </> 
                        )}
                </div>
            </div>
        </div>

    );
};

export default ProductDetails;