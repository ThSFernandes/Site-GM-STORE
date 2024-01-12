'use client';

import { ImageType } from "@/app/admin/adicionar-produtos/AdicionarProdutoForm";
import { useCallback } from "react";
import {useDropzone} from 'react-dropzone';


interface SelectImageProps {
    item?: ImageType;
    handleFileChange: (value: File) => void;
}

//arrastar uma imagem para um input para fazer upload da imagem
const SelectImage: React.FC<SelectImageProps> = ({item, handleFileChange}) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length > 0){
            handleFileChange(acceptedFiles[0]);
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, 
    accept: {"image/*": [".jpeg", ".jpg", ".png"] },
});
    
    return ( 
    <div {...getRootProps()} className="border-2 border-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex items-center justify-center">
        <input {...getInputProps()} />
        {isDragActive ? (
            <p>Arraste uma imagem aqui...</p>
        ) : (
            <p>+ {item?.color} Imagem</p>
        )}
    </div>
    );
}

export default SelectImage;