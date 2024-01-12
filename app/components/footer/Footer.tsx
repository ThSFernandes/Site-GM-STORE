import Link from "next/link";
import Container from "../Container";
import FooterList from "./FooterList";
import { MdFacebook } from 'react-icons/md';
import { AiFillInstagram } from 'react-icons/ai';
import { AiFillTwitterCircle } from 'react-icons/ai';

const Footer = () => {
    return (
        //TailWindCss
        <footer className="
    bg-neutral-900
    text-slate-200 text-sm mt-16
    ">
            <Container>
                <div className="flex flex-col md:flex-row justify-beetween pt-16 pb-8">
                    <FooterList>
                        <h3 className="text-base font-bold 
                    mb-2 font-questrial
                    ">Categorias:</h3>
                        <Link href="#" className="text-sm font-questrial">Shorts</Link>
                        <Link href="#" className="text-sm font-questrial">Bermudas</Link>
                        <Link href="#" className="text-sm font-questrial">Saias</Link>
                        <Link href="#" className="text-sm font-questrial">Jardineira</Link>
                        <Link href="#" className="text-sm font-questrial">Vestidos</Link>
                        <Link href="#" className="text-sm font-questrial">Jaquetas</Link>
                    </FooterList>

                    <FooterList>{/* Parte de atendimento ao cliente*/}
                        <h3 className="text-base font-bold  mb-2 mr-4 font-questrial">Atendimento ao cliente</h3>
                        <Link href={'#'}> Contato</Link>
                        <Link href={'#'}> Política de envio</Link>
                        <Link href={'#'}> Devoluções e trocas</Link>
                        <Link href={'#'}> FAQS</Link>

                    </FooterList>


                    <div className="w-full  md:w-1/3 mb:6 md:mb-0 mr-10">
                        <h3 className="text-base font-bold 
                        mb-2 font-questrial
                        ">Quem Somos:</h3>
                        <p className="mb-2">A casa GM store visa ser reconhecida em todo o brasil como uma empresa de excelência séria e comprometida
                            com seus clientes, atual com as tendências do mercado de moda casual
                            e beleza visando sempre o crescimento sustentável. </p>
                        <p>&copy; {new Date().getFullYear()} Gm-Store. Todos direitos reservados</p>
                    </div>



                    <FooterList>
                        <h3 className="text-base font-bold mb-2 font-questrial">Siga-nos:</h3>
                        <div className="flex gap-2 font-questrial" >
                            <Link href="#"> <MdFacebook size={24} /> </Link>
                            <Link href="#"> <AiFillInstagram size={24} /> </Link>
                            <Link href="#"> <AiFillTwitterCircle size={24} /> </Link>
                        </div>
                    </FooterList>
                </div>
            </Container>

        </footer>
    );
}

export default Footer;