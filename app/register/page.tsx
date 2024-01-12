import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import RegisterForm from "./RegisterForm";


// Página para registrar - formulário
const Register = async () => {

    const currentUser = await getCurrentUser();
    return (
        <Container>
           <FormWrap>
            <RegisterForm currentUser = {currentUser}>
                
            </RegisterForm>
           </FormWrap>
        </Container>
    );
}
export default Register;