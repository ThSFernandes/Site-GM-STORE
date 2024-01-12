'use client'

import { useCart } from "@/hooks/UseCart";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import Button from "../components/Button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const CheckoutClient = () => {
    const {cartProducts, paymentIntent, handleSetPaymentIntent} = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const router = useRouter();

    console.log("paymentInte", paymentIntent)
    console.log("clientSecret", clientSecret)

    useEffect(() => {
        //criar um paymentIntent logo quando a página carregar
        if(cartProducts) {
            setLoading(true);
            setError(false);

            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    items: cartProducts,
                    payment_intent_id: paymentIntent
                })
            }).then((res) => {
                setLoading(false);
                if(res.status === 401) {
                    return router.push('/login');
                }

                return res.json();
            }).then((data) => {
                setClientSecret(data.paymentIntent.client_secret);
                handleSetPaymentIntent(data.paymentIntent.id);
            }).catch((error) => {
                console.log("Erro", error);
                toast.error("Algo deu erro");
            })
        }

    }, [cartProducts, paymentIntent]);
    
    const options: StripeElementsOptions = {
      clientSecret,
      appearance:{
        theme: 'stripe',
        labels: "floating"
      }  
    };

    const handleSetPaymentSuccess = useCallback ((value: boolean) => {
        setPaymentSuccess(value)
    }, [])
    
    return (
        <div className="w-full">
            {clientSecret && cartProducts && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm clientSecret={clientSecret} handleSetPaymentSuccess={handleSetPaymentSuccess} />
                </Elements>
            )}
            {loading && <div className="text-center">Carregando tela de checkout...</div>}
            {error && <div className="text-center text-rose-500">Erro ao carregar tela de pagamento...</div>}
            {paymentSuccess && (
                <div className="flex items-center flex-col gap-4">
                    <div className="text-teal-500 text-center">Pagamento feito com sucesso</div>
                    <div className="max-w-[220px] w-full">
                        <Button
                            label="Ver suas compras"
                            onClick={() => router.push('/orders')}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};


export default CheckoutClient;