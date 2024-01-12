'use client'

import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatPrice } from "@/utils/formatPrice";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";

interface GerenciarProdutosClientProps {
    products: Product[];
}

const GerenciarProdutosClient: React.FC<GerenciarProdutosClientProps> = ({products}) => {
    
    const router = useRouter();
    const storage = getStorage(firebaseApp);
    let rows: any = [];

    if (products) {
        rows = products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                images: product.images,
            };
        });
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 220 },
        { field: 'name', headerName: 'Nome', width: 200 },

        {
            field: 'price',
            headerName: 'Preço (BRL)',
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="font-bold text-slate-800">{params.row.price}</div>
                );
            },
        },

        { field: 'category', headerName: 'Categoria', width: 100 },
        { field: 'brand', headerName: 'Marca', width: 100 },

        {
            field: 'inStock',
            headerName: 'Em estoque',
            width: 150,
            renderCell: (params) => {
                return (
                    <div >
                        {params.row.inStock == true ? (
                            <Status
                                text="Em estoque"
                                icon={MdDone}
                                bg="bg-teal-200"
                                color="text-teal-700"
                            />
                        ) : (
                            <Status
                                text="Fora do estoque"
                                icon={MdClose}
                                bg="bg-rose-200"
                                color="text-rose-700"
                            />)}
                    </div>
                );
            },
        },

        {
            field: 'action',
            headerName: 'Ações',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="flex justify-between gap-4 w-full">
                        <ActionBtn icon={MdCached} onClick={() =>{
                            handleToogleStock(params.row.id, params.row.inStock);
                        }} />
                        <ActionBtn icon={MdDelete} onClick={() =>{
                            handleDelete(params.row.id, params.row.images);
                        }} />
                        <ActionBtn icon={MdRemoveRedEye} onClick={() =>{
                            router.push(`product/${params.row.id}`);
                        }} />
                    </div>
                );
            },
        },

    ];

    //atualizar se o produto está em estoque ou não
    const handleToogleStock = useCallback((id: string ,inStock: boolean) => {
        axios.put('/api/product', {
            id,
            inStock: !inStock
        }).then((res) =>{
            toast.success("Produto foi alterado!");
            router.refresh();
        }).catch((err) =>{
            toast.error('Oops! Algo deu errado!');
            console.log(err);
        });
    },[]);


    //deletar produto e suas imagens do banco 
    const handleDelete = useCallback(async(id: string, images: any[]) =>{
        toast('Excluindo produto, por favor aguarde!');

        //primeiro excui as imagens 
        const handleImageDelete = async() =>{ 
            try{
                for(const item of images){
                    if(item.image){
                        const imageRef = ref(storage, item.image);
                        await deleteObject(imageRef);
                        console.log('Imagem excluída', item.image);
                    }
                }
            }
            catch(error){
                console.log("ID: " + id);
                return console.log("Erro ao excluir imagens", error);
            }
        };

        await handleImageDelete();

        axios.delete(`/api/product/${id}`).then((res) => {
            toast.success("Produto foi excluído.");
            router.refresh();
        }).catch((err) =>{
            toast.error('Erro ao deletar produto.');
            console.log(err);
        });

    }, []);

    return (
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Gerenciar Produtos" center></Heading>
            </div>


            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 9 },
                        },
                    }}
                    pageSizeOptions={[9, 10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>

        </div>
    );
}

export default GerenciarProdutosClient;