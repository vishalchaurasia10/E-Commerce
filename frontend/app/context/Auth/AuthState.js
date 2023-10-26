import { Toaster } from "react-hot-toast";
import AuthContext from "./authContext";

const AuthState = (props) => {

    const signUp = async (user) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Toaster />
            <AuthContext.Provider
                value={{
                    signUp
                }}>
                {props.children}
            </AuthContext.Provider>
        </>
    )
}

export default AuthState;