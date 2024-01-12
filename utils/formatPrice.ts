
// Aqui sera formatado o preço 'R$'
export const formatPrice = 
(amount: number) => {
    return new Intl.NumberFormat('en-US',{ style: 'currency', currency:'BRL'}).format(amount);
             
};