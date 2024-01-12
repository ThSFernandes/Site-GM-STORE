'use client'

//Formulário de registro de usuário. Usa react para esu comportamento (react-hook-form) e o componente funcional do Input.tsx

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from 'next-auth/react'
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps {
   currentUser: SafeUser | null
}

const RegisterForm: React.FC<RegisterFormProps> = ({currentUser}) => {

   const [isLoading, setIsLoading] = useState(false);
   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm<FieldValues>({
      defaultValues: {
         name: "",
         email: '',
         password: ''
      }
   });

   const router = useRouter();

   useEffect(() => {
      if(currentUser) {
         router.push("/cart");
         router.refresh();
      }
   }, [])

   const onSubmit: SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true);

      axios.post('/api/register', data).then(() => {
         toast.success('Conta criada!');

         signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
         }).then((callback) => {
            if (callback?.ok) {
               router.push('/cart');
               router.refresh();
               toast.success('Entrou com sucesso!')
            }

            if (callback?.error) {
               toast.error(callback.error);
            }
         })

      })
      .catch(() => toast.error("Algo ocorreu errado"))
      .finally(() => {
         setIsLoading(false);
      });
   }

   if(currentUser) {
      return <p className="text-center">Já está logado. Redirecionando...</p>
   }

   return (
      <>
         <Heading title="Registre-se em GM-Store" />
         <Button
            outline
            label="Continuar com o Google"
            icon={AiOutlineGoogle}
            onClick={() => { signIn('google')}}
         ></Button>
         <hr className="bg-slate-300 w-full h-px" />
         <Input
            id="name"
            label="Nome"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
         />
         <Input
            id="email"
            label="E-mail"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
         />
         <Input
            id="password"
            label="Senha"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="password"
         />
         <Button label={isLoading ? "Carregando" : "Registrar-se"} onClick={handleSubmit(onSubmit)}></Button>
         <p className="text-sm">
            Já tem uma conta? <Link className="underline" href='/login'>
               Entrar
            </Link>
         </p>
      </>
   );
}

export default RegisterForm;