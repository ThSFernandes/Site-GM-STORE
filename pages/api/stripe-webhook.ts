import Stripe from "stripe"
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";


export const config = {
    api: {
        bodyParser: false
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16"
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    if(!sig) {
        return res.status(400).send("Faltando a assinatura do stripe");
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!       
        )
    } catch(err) {
        return res.status(400).removeHeader("Erro do Webhook" + err);
    }

    switch(event.type) {
        case 'charge.succeeded':
            const charge: any = event.data.object as Stripe.Charge;
            
            if(typeof charge.payment_intent === 'string') {
                await prisma?.order.update({
                    where: {paymentIntentId: charge.payment_intent},
                    data: { status: 'complete', address: charge.shipping?.address },
                    
                });
            }
            break;

        default:
            console.log('Evento de tipo não tratado' + event.type);
    }

    res.json({ received: true })
}