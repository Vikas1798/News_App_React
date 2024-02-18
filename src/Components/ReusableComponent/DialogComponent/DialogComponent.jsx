import React from "react";
import './dialog.css';
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const DialogComponent = ({ handleClose, show, children, size}) => {
     /**
     * @param {*
     *      size: default ||  small || medium || large
     * }
     */

    const showHideClassName = show ? "modal-wrapper display-block" : "modal-wrapper display-none";
    return (
        <div className={showHideClassName}>
            <section className={`modal-main ${size}-modal`}>
                {children}
            </section>
        </div>
    );
};

export default DialogComponent;

// import it like this
{/* <DialogComponent show={this.state.show} handleClose={this.hideModal} >
            <p>Modal</p>
            <p>Data</p>
          </DialogComponent> */}


        //   state = { show: false }
  
        //   showModal = () => {
        //     this.setState({ show: true });
        //   }
          
        //   hideModal = () => {
        //     this.setState({ show: false });
        //   }
            
        //   render() {
        //     return (
        //       <main>
        //         <h1>React Modal</h1>
        //         <DialogComponent show={this.state.show} handleClose={this.hideModal} >
        //           <p>Modal</p>
        //           <p>Data</p>
        //         </DialogComponent>
        //         <button type='button' onClick={this.showModal}>Open</button>
        //       </main>
        //     )
        //   }