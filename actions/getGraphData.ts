import prisma from "@/libs/prismadb";
import moment from "moment";

export default async function getGraphData() {
    try {
        // Pega as datas de início e fim para o afaixa de datas (7 dias atrás para agora)
        const startDate = moment().subtract(6, "days").startOf("day");
        const endDate = moment().endOf("day");
        
        // Query para o banco de dados pegar os dados do pedidos agrupados por createData
        const result = await prisma.order.groupBy({
            by: ["createDate"],
            where: {
                createDate: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString(),
                },
                status: "complete",
            },
            _sum: {
                amount: true,
            },
        });

        // Inicializa um objeto para agregar o dado por dia
        const aggregatedData: {
            [day: string]: { day: string; date: string; totalAmount: number }
        } = {};

        // Cria um clone da data inicial para iterar sobre cada dia
        const currentDate = startDate.clone();

        // Itera sobre cada dia em uma faixa de dias
        while (currentDate <= endDate) {
            // Formata os dias como uma string (ex: "Domingo")
            const day = currentDate.format("dddd");
            console.log("dia<<<<", day, currentDate);

            // Inicializa o dado agregado para o dia com o day, date e totalAmount
            aggregatedData[day] = {
                day,
                date: currentDate.format("YYYY-MM-DD"),
                totalAmount: 0,
            }

            // Move para o próximo dia
            currentDate.add(1, "day");
        }

        // Calcula o valor total para cada dia por meio da soma dos valores dos pedidos
        result.forEach((entry) => {
            const day = moment(entry.createDate).format("dddd");
            const amount = entry._sum.amount || 0;
            aggregatedData[day].totalAmount += amount;
        })

        // Converte o objeto aggregatedData para um array e ordena ele por data
        const formattedData = Object.values(aggregatedData).sort((a, b) => 
            moment(a.date).diff(moment(b.date))
        )

        // Retorna a data formatada
        return formattedData;
    } catch (error: any) {
        throw new Error(error);
    }
}