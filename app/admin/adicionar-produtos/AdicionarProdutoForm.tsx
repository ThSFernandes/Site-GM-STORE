'use client'

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import firebaseApp from "@/libs/firebase";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { data } from "autoprefixer";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { error } from "console";
import axios from "axios";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

//tipo de imagem que seleciona no checkbox
export type ImageType = {
    color: string;
    colorCode: string;
    image: File | null;
}

//imagem que será enviada
export type UploadedImageType = {
    color: string;
    colorCode: string;
    image: string;
}

const AdicionarProdutoForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<ImageType[] | null>();
    const [isProductCreated, setIsProductCreated] = useState(false);


    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            description: "",
            brand: "",
            category: "",
            inStock: false,
            images: [],
            price: "",
        },
    });

    useEffect(() => {
        setCustomValue('images', images);
    }, [images]);

    useEffect(() => {
        if (isProductCreated) {
            reset();
            setImages(null);
            setIsProductCreated(false);
        }
    }, [isProductCreated]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        console.log("Informações do produto", data);
        //fazer upload de imagens para fb
        //salvar o produto no mongodb
        setIsLoading(true)
        let uploadedImages: UploadedImageType[] = []

        if (!data.category) {
            setIsLoading(false)
            return toast.error('Categoria não foi selecionada')
        }

        if (!data.images || data.images.length == 0) {
            setIsLoading(false)
            return toast.error('Nenhuma imagem selecionada!')
        }

        const handleImageUploads = async () => {
            toast('Criando produto, aguarde...');
            try {
                for (const item of data.images) {
                    if (item.image) {
                        const fileName = new Date().getTime() + "-" + item.image.name;
                        const storage = getStorage(firebaseApp);
                        const storageRef = ref(storage, `products/${fileName}`);
                        const uploadTask = uploadBytesResumable(storageRef, item.image);

                        await new Promise<void>((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Upload está ' + progress + '% realizado');
                                    switch (snapshot.state) {
                                        case 'paused':
                                            console.log('O upload está pausado');
                                            break;
                                        case 'running':
                                            console.log('O upload está em execução');
                                            break;
                                    }
                                },
                                (error) => {
                                    console.log('Erro ao carregar a imagem', error)
                                    reject(error)
                                },

                                () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then
                                        ((downloadURL) => {
                                            uploadedImages.push({
                                                ...item,
                                                image: downloadURL
                                            })
                                            console.log('Arquivo disponível em ', downloadURL);
                                            resolve();
                                        }
                                        ).catch((error) => {
                                            console.log("Erro ao obter o URL de download", URL);
                                            reject(error);

                                        });
                                }

                            ); // fim uploaTask

                        });
                    }
                }

            } catch (error) {
                setIsLoading(false)
                console.log('Erro ao lidar com uploads de imagens', error);
                return toast.error('Erro ao lidar com uploads de imagens');

            }

        };

        await handleImageUploads();
        const productData = {...data, images: uploadedImages};

        axios.post('/api/product', productData).then(() => {
            toast.success("Produto criado!");
            setIsProductCreated(true);
            router.refresh();
        }).catch((error) => {
            toast.error("Algo aconteceu de erro ao salvar no banco de dados");
        }).finally(() => {
            setIsLoading(false);
        });

    };

    const category = watch('category');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    const addImageToState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if (!prev) {
                return [value];
            }

            return [...prev, value]
        })
    }, []);

    const removeImageFromState = useCallback((value: ImageType) => {
        setImages((prev) => {
            if (prev) {
                const filteredImages = prev.filter(
                    (item) => item.color !== value.color);
                return filteredImages;
            }
            return prev;
        });
    }, []);

    return (
        <>
            <Heading title="Adicionar um Produto" center />
            <Input
                id="name"
                label="Nome"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id="price"
                label="Preço"
                disabled={isLoading}
                register={register}
                errors={errors}
                type="number"
                required
            />
            <Input
                id="brand"
                label="Marca"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <TextArea
                id="description"
                label="Descrição"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <CustomCheckBox id="inStock" register={register} label="Produto está em estoque" />
            <div className="w-full font-medium">
                <div className="mb-2 font-semibold">Selecione uma categoria</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
                    {categories.map((item) => {
                        if (item.label === 'Tudo') {
                            return null;
                        }

                        return (
                            <div key={item.label} className="col-span">
                                <CategoryInput
                                    onClick={(category) => setCustomValue("category", category)}
                                    selected={category === item.label}
                                    label={item.label}
                                    //icon={item.icon}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col flex-wrap gap-4">
                <div>
                    <div className="font-bold">
                        Selecione as cores disponíveis do produto e envie suas imagens
                    </div>
                    <div className="text-small">
                        Você deve enviar as imagens para cada uma das imagens selecionadas, caso contrário a seleção de cores será ignorada.
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {colors.map((item, index) => {
                        return (<SelectColor
                            key={index}
                            item={item}
                            addImageToState={addImageToState}
                            removeImageFromState={removeImageFromState}
                            isProductCreated={isProductCreated}
                        />
                        );
                    })}
                </div>
            </div>
            <Button label={isLoading ? 'Carregando...' : 'Adicionar produtos'} onClick={handleSubmit(onSubmit)}></Button>
        </>
    );
}

export default AdicionarProdutoForm;