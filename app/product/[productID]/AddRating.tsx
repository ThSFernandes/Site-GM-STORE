'use client'

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import { SafeUser } from "@/types";
import { Rating } from "@mui/material";
import { Order, Product, Review } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

interface AddRatingProps {
    product: Product & {
        reviews: Review[];
    };
    user: (SafeUser & {
        orders: Order[];
    }) | null

}

const AddRating: React.FC<AddRatingProps> = ({ product, user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            comment: '',
            rating: 0
        }

    })

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldTouch: true,
            shouldDirty: true,
            shouldValidate: true
        })
    }

    //fazer uma requisição http para salvar a avaliação no banco
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if(data.rating === 0){
            setIsLoading(false);
            {return toast.error("Nenhuma avaliação selecionada")}
        }
        const ratingData = {...data, userId: user?.id, product: product}

        axios.post('/api/rating', ratingData).then(() =>{
            toast.success('Avaliação enviada');
            router.refresh();
            reset();
        }).catch((error) =>{
            toast.error('Algo deu errado durante a avaliação');
        }).finally(() =>{
            setIsLoading(false);
        })
    }

    if(!user || !product){
        return null;
    }

    const deliveredOrder =  user?.orders.some(order  => 
        order.products.find(item  => item.id == product.id) && order.deliveryStatus == 'delivered')
    
        //não será possível avaliar um produto mais de uma vez
        const userReview = product?.reviews.find(((review: Review) => {
            return review.userId == user.id
        }))

    if(userReview || !deliveredOrder){
        return null;
    }

    return (
        <div className="flex flex-col gap-2 max-w-[500px]">
            <Heading title="Avalie este produto" />
            <div className="rating-container">
            <Rating onChange={(event, newValue)=>{
                setCustomValue('rating', newValue)
            }}></Rating>
            </div>

            <Input 
            id = 'comment'
            label = "Comente"
            disabled = {isLoading}
            register = {register}
            errors = {errors}
            required
            />

            <Button label={isLoading ? "Carregando" : "Avalie o produto"} onClick={handleSubmit(onSubmit)} />
        </div>
    );
}

export default AddRating;