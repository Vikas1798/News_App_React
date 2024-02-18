import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toastify = (type, content) => {
    /**
     * 
     * @param {*
     *      type: 'success', 'error', 'info', 'warn', 'dark', 'warning',
     * } props 
     */

    return toast[type](content);
}

export default function ToastifyComponent(props) {
    /**
     * 
     * @param {*
     *      hideProgressBar,
     *      newestOnTop,
     *      position : 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'
     *      rtl,
     *      autoClose : default(5000),
     *      closeOnClick,
     * } props 
     */

    return (
        <div>
            <ToastContainer
                position={props.position}
                autoClose={props.autoClose}
                hideProgressBar={props.hideProgressBar}
                newestOnTop={props.newestOnTop}
                closeOnClick={props.closeOnClick}
                rtl={props.rtl}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}