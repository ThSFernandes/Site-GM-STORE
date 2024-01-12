// Importa o componente Link do Next.js, Container e Redressed de next/font/google.
import Link from "next/link";
import Container from "../Container";
import {Questrial} from "next/font/google";  /* Importação da fonte usada*/
import 'boxicons/css/boxicons.min.css';   /* Importação de ícones */
import React from 'react';
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import Categories from "./Categories";
import SearchBar from "./SearchBar";

// Comentado, provavelmente um trecho de código que não está sendo utilizado ou está comentado por algum motivo.
const questrial = Questrial({ subsets: ["latin"], weight: ["400"] });

// Declaração do componente funcional NavBar.
const NavBar = async () => {


  const currentUser = await getCurrentUser();
    
    // Retorna o JSX que representa a barra de navegação.
    return (
        <div
            className="
            sticky
            top-0
            w-full
            bg-violet-300
            z-30
            shadow-sm
            "
        >
            {/* Início do contêiner para centralizar o conteúdo da barra de navegação. */}
            <div className="py-4 border-h-[1px]">
                <Container>
                    {/* Container flexível com alinhamento e espaçamento entre os itens. */}
                    <div className="
                        flex
                        itens-center
                        justify-between
                        gap-3
                        md-gap-0
                    ">
                        {/* Link para a página inicial. */}
                        <Link href="/" className={`${questrial.className} font-bold text-2xl text-black`}>
                            <i className="bx bx-shopping-bag"></i>Casa GM.Store</Link>

                        {/* Elemento de texto 'Pesquisar' visível apenas em dispositivos de médio porte (md). */}
                        <div className="hidden md:block text-black"><SearchBar/></div>
                        {/* Container flexível com espaçamento entre os itens. */}
                        <div className="
                            flex
                            itens-center
                            gap-8
                            md:gap-12
                        ">
                            <div className="flex items-center gap-8 md:gap-12">
                                <div className="align-middle">
                                    <UserMenu currentUser={currentUser} />
                                </div>
                                <div className="ml-auto pr-8">
                                    <CartCount />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <Categories/>
        </div>
    );
}

// Exporta o componente NavBar para ser utilizado em outros lugares.
export default NavBar;
