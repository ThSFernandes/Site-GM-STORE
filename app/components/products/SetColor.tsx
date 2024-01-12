'use client'

import { CartProductType, SelectedImgType } from "@/app/product/[productID]/ProductDetails";

//mudar a cor de acordo com o valor passado, algo assim
interface SetColorProps{
    images: SelectedImgType[],
    cartProduct: CartProductType,
    handleColorSelect: (value: SelectedImgType) => void
}

//mudar a cor de acordo com a cor escolhida dentre as opções do produto
const SetColor: React.FC<SetColorProps> = ({
    images, 
    cartProduct, 
    handleColorSelect,
}) => {
    return ( 
        <div>
            <div className="flex gap-4 itens-center">
                <span className="font-semibold">Cor:</span>
                <div className="flex gap-1">
                    {
                        images.map((image) => {
                            return (
                            <div 
                            key={image.color}
                            onClick={() => handleColorSelect(image)} //esse image tem a cor e a imagem, lembrar disso

                            className={`
                            h-7
                            W-7
                            rounded-full
                            border-teal-300
                            flex
                            items-center
                            justify-center
                            ${
                                cartProduct.selectedImg.color === image.color 
                                ? "border-[1.5px]"
                                : "border-none"
                            }
                            `}
                            >
                                
                                <div style={{background: image.colorCode}} className="
                                h-5
                                w-5
                                rounded-full
                                border-slate-300
                                cursor-pointer"></div>
                            </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
     );
}
 
export default SetColor;