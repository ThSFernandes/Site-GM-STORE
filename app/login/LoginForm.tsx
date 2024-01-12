'use client'

//Formulário de registro de usuário. Usa react para esu comportamento (react-hook-form) e o componente funcional do Input.tsx

import { signIn } from "next-auth/react"
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";

interface LoginFormProps {
   currentUser: SafeUser | null
}

const LoginForm: React.FC<LoginFormProps> = ({currentUser}) => {

   const [isLoading, setIsLoading] = useState(false);
   const {
      register,
      handleSubmit,
      formState: {errors}
   } = useForm<FieldValues>({
      defaultValues:{
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

   const onSubmit:SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true);
      signIn('credentials', {
         ...data,
         redirect: false
      }).then((callback) => {
         setIsLoading(false);

         if (callback?.ok) {
            router.push('/cart');
            router.refresh();
            toast.success('Entrou com sucesso!')
         }

         if (callback?.error) {
            toast.error(callback.error);
         }
      })
      console.log(data);
   }

   if(currentUser) {
      return <p className="text-center">Já está logado. Redirecionando...</p>
   }

   return (
      <>
         <Heading title="Entre com sua conta em GM-Store"/> 
         <Button
            outline
            label="Continuar com o Google"
            icon={AiOutlineGoogle}
            onClick={() => {(signIn('google'))}}
         ></Button>
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
         <Button label = {isLoading ? "Carregando" : "Entrar em sua conta"} onClick={handleSubmit(onSubmit)}></Button>
         <p className="text-sm">
            Não tem uma conta? <Link className="underline" href='/register'>
            Inscrever-se
            </Link>
         </p>
      </>
   );
}
export default LoginForm;

