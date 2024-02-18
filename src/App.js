import React, { useState } from "react";
import NavbarComponent from "./Components/NavbarComponent/NavbarComponent";
import InformationComponent from "./Components/InformationComponent/InformationComponent";
import ToastifyComponent from './Components/ReusableComponent/Toastify';

const App = () =>{
    const [state, setState] = useState({
        search:""
    })

    let handleSearch = (data) =>{
        setState((prev)=>{
            return{
                ...prev,
                search:data.target.value
            }
        })
    }

    return (
        <main>
            <NavbarComponent handleSearch={handleSearch} search={state?.search}/>
            <InformationComponent search={state?.search}/>
            <ToastifyComponent />

        </main>
    )

}

export default App;


