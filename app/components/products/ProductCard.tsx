// Para o React saber que é client-side invés de server-side
"use client";

import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    data: any
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {

    const router = useRouter()

    // Construido a lógica para fazer a média das classificações
    const productRating =
        data.reviews.reduce((acc: number, item: any) =>
            item.rating + acc, 0) / data.reviews.length

    return (
        <div 
    onClick={() => router.push(`/product/${data.id}`)}  // Cria a ação de pegar o Id do produto para criar uma pagina nova
            className="col-span-1
        cursor-pointer
        border-[1.2px]
        Mborder-slate-200
        Ebg-slate-50
        rounded-sm
        p-2
        transition
        hover:scale-105
        text-center
        text-sm">
            <div className="
            fex
            flex-col
            items-center
            w-full
            gap-1"
            >
            </div>


            <div className="aspect-square overflow-hidden relative w-full">
                <Image
                    fill
                    src={data.images[0].image}
                    alt={data.name}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="mt-5"> {truncateText(data.name)} {/* Margem do top, relação ao nome abaixo do cartão do item */}
            </div>
            <div>
                
                <Rating value={productRating} readOnly /> {/*Muda a classificação dos produtos */}
            </div>
            <div>{data.reviews.length} reviews </div>
            <div className="font-semibold">{formatPrice(data.price)}</div>
        </div>
    );
}

export default ProductCard;