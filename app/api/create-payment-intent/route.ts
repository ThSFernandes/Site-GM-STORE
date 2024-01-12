import Stripe from 'stripe'
import prisma from '@/libs/prismadb'
import { NextResponse } from 'next/server'
import { CartProductType } from '@/app/product/[productID]/ProductDetails';
import { getCurrentUser } from '@/actions/getCurrentUser';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16",
});

const calculateOrderAmount = (items: CartProductType[]) => {
    const totalPrice = items.reduce((acc, item) => {
        const itemTotal = item.price * item.quantity;

        return acc + itemTotal;
    }, 0)

    const price: any = Math.floor(totalPrice);

    return price;
}

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return NextResponse.json({error: "Não autorizado"}, {
            status: 401
        })
    }

    const body = await request.json();
    const {items, payment_intent_id} = body;
    const total = calculateOrderAmount(items) * 100;
    const orderData = {
        user: {connect: {id: currentUser.id}},
        amount: total,
        currency: "brl",
        status: "pending",
        deliveryStatus: "pending",
        paymentIntentId: payment_intent_id,
        products: items
    }

    if(payment_intent_id) {
        const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)

        if(current_intent) {
            const updated_intent = await stripe.paymentIntents.update(
                payment_intent_id, {amount: total}
            );

            //atualizar o pedido
    
            const [existing_order, update_order] = await Promise.all([
                prisma.order.findFirst({
                    where:  { paymentIntentId: payment_intent_id}
                }),
                prisma.order.update({
                    where: {paymentIntentId: payment_intent_id},
                    data: {
                        amount: total,
                        products: items
                    }
                })
            ])
    
            if(!existing_order) {
                return NextResponse.json(
                    {error: 'Intenção de pagamento inválida'},
                    {status: 400}
                );
            }
    
            return NextResponse.json({ paymentIntent: updated_intent });
        }
        
    } else {
        //criar a intenção de pagamento
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'brl',
            automatic_payment_methods: {enabled: true}
        })
        //criar o pedido

        orderData.paymentIntentId = paymentIntent.id;

        await prisma.order.create({
            data: orderData
        });

        return NextResponse.json({ paymentIntent });
    }

    return NextResponse.error();
}