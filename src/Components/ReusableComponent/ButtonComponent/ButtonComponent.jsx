import React from "react";
import './button.css';

const ButtonComponent = ({ type, color, text, height, onClick, radius, width }) => {
    /**
     * @param {*
     *      type: default ||  "filled" || 'outline'
     *      onClick: ()
     *      text: ''
     * }
     */

    return (
        <button
            className={`default-button ${type}-button`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default ButtonComponent;


// import it like this
{/* <ButtonComponent
                        onClick={() => handleClose()}
                        type='filled'
                        text='Click'
                    /> */}