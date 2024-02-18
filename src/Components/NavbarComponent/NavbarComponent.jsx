import React, { useEffect, useRef, useState } from 'react';
import { EmailValidate, getAPI, postAPI } from "../../Services/MasterApi";
import { NewsApp } from '../../Services/ApiEndPoints';
import './navbar.css';
import authIcon from '../../Assets/auth_icon.svg';
import logoutIcon from '../../Assets/logout.svg';

import DialogComponent from "../ReusableComponent/DialogComponent/DialogComponent";
import closeIcon from '../../Assets/close-icon.svg';
import ButtonComponent from '../ReusableComponent/ButtonComponent/ButtonComponent';
import ProfileComponent from './ProfileComponent/ProfileComponent';
import userImage from '../../Assets/male-image.svg';
import { Toastify } from '../ReusableComponent/Toastify';
import { ValidateName } from '../../Services/MasterApi'
const NavbarComponent = (props) => {
    const authBlockRef = useRef();
    const [state, setState] = useState({
        displayAuthBlock: false,
        openDialog: false,
        dialogType: '',

        registerInput: {
            name: "",
            email: "",
            password: null,
            password_confirmation: null
        },
        registerLoad: false,
        registerInputError: {},

        logInInput: {
            // name: "",
            email: "",
            password: "",
        },
        logInLoad: false,
        logInInputError: {},

        logOutLoader: false
    })

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (!authBlockRef.current?.contains(event.target)) {
            setState((prev) => {
                return {
                    ...prev,
                    displayAuthBlock: false,
                };
            });
        }
    };

    const showDialog = (open, data) => {
        setState((prev) => {
            return {
                ...prev,
                openDialog: open,
                dialogType: data,
                displayAuthBlock: false,
            }
        })
    }

    //on change Registration data
    const updateRegistrationInput = (data, key) => {
        setState((prev) => {
            return {
                ...prev,
                registerInput: {
                    ...prev.registerInput,
                    [key]: data.target.value
                }
            }
        })
        if (key === "name") {
            if (!data.target.value) {
                setState((prev) => {
                    return {
                        ...prev,
                        registerInputError: {
                            name: "Please enter your name.",
                        },
                    };
                });
                return false;
            }
            if (data.target.value.length < 2 || data.target.value.length > 15) {
                setState((prev) => {
                    return {
                        ...prev,
                        registerInputError: {
                            name: "Required  2 to 15 characters.",
                        },
                    };
                });
                return false;
            }
            let nameValidation = ValidateName(data.target.value);
            if (!nameValidation) {
                setState((prev) => {
                    return {
                        ...prev,
                        registerInputError: {
                            name:
                                "Please enter your valid name.",
                        },
                    };
                });

                return false;
            }
            setState((prev) => {
                return { ...prev, registerInputError: { name: null } };
            });
        }

        if (key === "email") {
            if (!data.target.value) {
                setState((prev) => {
                    return {
                        ...prev,
                        registerInputError: {
                            email: "Email can not be empty.",
                        },
                    };
                });
                return false;
            }
            let emailValidation = EmailValidate(data.target.value);
            if (!emailValidation) {
                setState((prev) => {
                    return {
                        ...prev,
                        registerInputError: {
                            email: "Please enter your valid email id",
                        },
                    };
                });
                return false;
            }
            setState((prev) => {
                return { ...prev, registerInputError: { email: null } };
            });
        }


        if (key === "password") {
            if (!data.target.value) {
                setState((prev) => {
                    return {
                        ...prev,
                        registerInputError: {
                            password: "Please enter your password",
                        },
                    };
                });
                return false;
            }
            setState((prev) => {
                return { ...prev, registerInputError: { password: null } };
            });
        }
        // else {
        //     if (state.registerInput.password_confirmation !== state.registerInput.password) {
        //         setState((prev) => {
        //             return {
        //                 ...prev,
        //                 registerInputError: {
        //                     password_confirmation: "Password does not match!",
        //                 },
        //             };
        //         });
        //         return false;
        //     } else {
        //         setState((prev) => {
        //             return {
        //                 ...prev,
        //                 registerInputError: {
        //                     password_confirmation: null,
        //                 },
        //             };
        //         });
        //         return false;
        //     }
        // }
    }

    //Submit sign up info
    const handleSignUp = () => {
        setState((prev) => {
            return {
                ...prev,
                registerLoad: true,
            };
        });

        try {
            let payload = state.registerInput;
            const url = NewsApp.REGISTRATION;
            postAPI(url, payload).then((response) => {
                if (response?.data?.status) {
                    setState((prev) => {
                        return {
                            ...prev,
                            registerInput: {
                                ...prev.registerInput,
                                name: "",
                                email: "",
                                password: "",
                                password_confirmation: ""
                            }
                        }
                    })
                    Toastify("success", response?.data?.message);

                    var obj = {
                        name: response?.data?.data?.user?.name ?? '',
                        email: response?.data?.data?.user?.email ?? '',
                        preferred_sources: response?.data?.data?.user?.preferred_sources ?? [],
                        preferred_categories: response?.data?.data?.user?.preferred_categories ?? [],
                        preferred_authors: response?.data?.data?.user?.preferred_authors ?? [],
                    }
                    localStorage.setItem('userData', JSON.stringify(obj));
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('token', response?.data?.data?.token);
                    showDialog(false, {})
                }
                setState((prev) => {
                    return {
                        ...prev,
                        registerLoad: false,
                    };
                });

            });
        } catch (error) {
            Toastify("error", error)
            console.log('Error', error);
            setState((prev) => {
                return {
                    ...prev,
                    registerLoad: false,
                };
            });
            showDialog(false, {})
        }

    }

    //on change Registration data
    const updateLogInInput = (data, key) => {
        setState((prev) => {
            return {
                ...prev,
                logInInput: {
                    ...prev.logInInput,
                    [key]: data.target.value
                }
            }
        })

        // if (key === "name") {
        //     if (!data.target.value) {
        //         setState((prev) => {
        //             return {
        //                 ...prev,
        //                 logInInputError: {
        //                     name: "Please enter your name.",
        //                 },
        //             };
        //         });
        //         return false;
        //     }
        //     if (data.target.value.length < 2 || data.target.value.length > 15) {
        //         setState((prev) => {
        //             return {
        //                 ...prev,
        //                 logInInputError: {
        //                     name: "Required  2 to 15 characters.",
        //                 },
        //             };
        //         });
        //         return false;
        //     }
        //     let nameValidation = ValidateName(data.target.value);
        //     if (!nameValidation) {
        //         setState((prev) => {
        //             return {
        //                 ...prev,
        //                 logInInputError: {
        //                     name:
        //                         "Please enter your valid name.",
        //                 },
        //             };
        //         });

        //         return false;
        //     }
        //     setState((prev) => {
        //         return { ...prev, logInInputError: { name: null } };
        //     });
        // }

        if (key === "email") {
            if (!data.target.value) {
                setState((prev) => {
                    return {
                        ...prev,
                        logInInputError: {
                            email: "Email can not be empty.",
                        },
                    };
                });
                return false;
            }
            let emailValidation = EmailValidate(data.target.value);
            if (!emailValidation) {
                setState((prev) => {
                    return {
                        ...prev,
                        logInInputError: {
                            email: "Please enter your valid email id",
                        },
                    };
                });
                return false;
            }
            setState((prev) => {
                return { ...prev, logInInputError: { email: null } };
            });
        }

        if (key === "password") {
            if (!data.target.value) {
                setState((prev) => {
                    return {
                        ...prev,
                        logInInputError: {
                            password: "Please enter your password",
                        },
                    };
                });
                return false;
            }
            setState((prev) => {
                return { ...prev, logInInputError: { password: null } };
            });
        }
    }

    //Submit Log in info
    const handleLogIn = () => {
        let { email, password } = state.logInInput;

        // if (!name) {
        //     setState((prev) => {
        //         return {
        //             ...prev,
        //             logInInputError: {
        //                 name: "Please enter your name.",
        //             },
        //         };
        //     });
        //     return false;
        // }
        // if (name.length < 2 || name.length > 15) {
        //     setState((prev) => {
        //         return {
        //             ...prev,
        //             logInInputError: {
        //                 name: "Required  2 to 15 characters.",
        //             },
        //         };
        //     });
        //     return false;
        // }
        // let nameValidation = ValidateName(name);
        // if (!nameValidation) {
        //     setState((prev) => {
        //         return {
        //             ...prev,
        //             logInInputError: {
        //                 name:
        //                     "Please enter your valid name.",
        //             },
        //         };
        //     });

        //     return false;
        // }
        // setState((prev) => {
        //     return { ...prev, logInInputError: { name: null } };
        // });



        if (!email) {
            setState((prev) => {
                return {
                    ...prev,
                    logInInputError: {
                        email: "Email can not be empty.",
                    },
                };
            });
            return false;
        }
        let emailValidation = EmailValidate(email);
        if (!emailValidation) {
            setState((prev) => {
                return {
                    ...prev,
                    logInInputError: {
                        email: "Please enter your valid email id",
                    },
                };
            });
            return false;
        }
        setState((prev) => {
            return { ...prev, logInInputError: { email: null } };
        });

        if (!password) {
            setState((prev) => {
                return {
                    ...prev,
                    logInInputError: {
                        password: "Please enter your password",
                    },
                };
            });
            return false;
        }
        setState((prev) => {
            return { ...prev, logInInputError: { password: null } };
        });

        setState((prev) => {
            return {
                ...prev,
                logInLoad: true,
            };
        });

        try {
            let payload = state.logInInput;
            const url = NewsApp.LOGIN;
            postAPI(url, payload).then((response) => {
                if (response?.data?.status) {
                    setState((prev) => {
                        return {
                            ...prev,
                            logInInput: {
                                ...prev.logInInput,
                                name: "",
                                email: "",
                                password: "",
                            }
                        }
                    })

                    Toastify("success", response?.data?.message);
                    var obj = {
                        name: response?.data?.data?.user?.name ?? '',
                        email: response?.data?.data?.user?.email ?? '',
                        preferred_sources: response?.data?.data?.user?.preferred_sources ?? [],
                        preferred_categories: response?.data?.data?.user?.preferred_categories ?? [],
                        preferred_authors: response?.data?.data?.user?.preferred_authors ?? [],
                    }
                    localStorage.setItem('userData', JSON.stringify(obj));
                    localStorage.setItem('isLogin', true);
                    localStorage.setItem('token', response?.data?.data?.token);
                    showDialog(false, {});
                    window.location.reload();
                }
                setState((prev) => {
                    return {
                        ...prev,
                        logInLoad: false,
                    };
                });
            });
        } catch (error) {
            Toastify("error", error)
            console.log('Error', error);
            setState((prev) => {
                return {
                    ...prev,
                    logInLoad: false,
                };
            });
            showDialog(false, {})
        }
    }

    // Log out user
    const handleLogOut = () => {
        // Toastify("error", 'Log outed')

        // localStorage.clear();
        // showDialog(false, {});
        // window.location.reload();

        setState((prev) => {
            return {
                ...prev,
                logOutLoader: true,
            };
        });

        try {
            var token = localStorage.getItem('token');

            const url = NewsApp.LOGOUT;
            getAPI(url, { headers: { "Authorization": `Bearer ${token}` } }).then((response) => {
                Toastify("success", 'Successfully Logged out.');
                localStorage.clear();
                setState((prev) => {
                    return {
                        ...prev,
                        logOutLoader: false,
                        displayAuthBlock: false
                    };
                });


                window.location.reload();
                // showDialog(false, {})
            });
        } catch (error) {
            console.log('Error', error);
            setState((prev) => {
                return {
                    ...prev,
                    logOutLoader: false,
                    displayAuthBlock: false
                };
            });
            if (error?.response?.status === 401) {
                localStorage.clear();
            }
            window.location.reload();
            // showDialog(false, {})
        }

    }

    var isLogIn = JSON.parse(localStorage.getItem('isLogin')) ?? false;
    var userData = localStorage.getItem('userData');
    let userName = JSON.parse(userData)?.name ?? '';
    return (
        <header className='navbar'>
            <nav className="navigation">
                <div className='content'>
                    <div className='menu'>
                        Logo
                    </div>
                    <div className="search-container">
                        <input
                            placeholder="Latest News, Videos, Photos"
                            type="text"
                            value={props.search}
                            onChange={(data) => props.handleSearch(data)}
                        />
                    </div>
                    <div className='login-container'>
                        <div className="auth-container" ref={authBlockRef}>
                            <div className="show-auth-block"
                                onClick={() =>
                                    setState((prev) => {
                                        return {
                                            ...prev,
                                            displayAuthBlock: !state.displayAuthBlock,
                                        };
                                    })
                                }
                            >
                                <div className="auth-img">
                                    <img
                                        src={isLogIn ? userImage : authIcon}
                                        alt=""
                                        width={"30px"}
                                        height={"30px"}
                                    />
                                </div>
                            </div>
                            <div className="auth-block-wrapper" style={{ display: `${state.displayAuthBlock ? "flex" : "none"}`, }}>
                                <div className="indicator-icon"></div>
                                <div className="auth-block-labels">
                                    {
                                        isLogIn ?
                                            <div className='authorized'>
                                                <div className='user-name'>Hi, {userName}</div>
                                                <div className='label' onClick={() => showDialog(true, 'profile')}>Profile</div>
                                                <div className='log-out-content'>
                                                    <div className='log-out-label' onClick={() => handleLogOut()}>

                                                        {!state.logOutLoader ? "Log out" : "Loading.."}
                                                    </div>

                                                    <img
                                                        src={logoutIcon}
                                                        alt=""
                                                        width={"15px"}
                                                        height={"15px"}
                                                        style={{ color: '#0000008a' }}
                                                    />

                                                </div>
                                            </div>
                                            :
                                            <div className='unauthorized'>
                                                <div className='label' onClick={() => showDialog(true, 'signUp')}>Sign up</div>
                                                <div className='label' onClick={() => showDialog(true, 'logIn')}>Log in</div>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <DialogComponent show={state.openDialog} handleClose={showDialog} size='small'>
                {/* {
                    state.dialogType === 'profile' && <div style={{ color: 'red' }}> profile</div>
                }
                */}

                {
                    state.dialogType === 'signUp' &&
                    <div className='sign-up-wrapper'>
                        <div className="sign-up-heading-wrapper">
                            <div className="sign-up-heading"> Sign UP </div>
                            <div onClick={() => showDialog(false, {})} className="sign-up-close-btn">
                                <img
                                    src={closeIcon}
                                    alt=""
                                    width={"20px"}
                                    height={"20px"}
                                />
                            </div>
                        </div>
                        <div className='welcome-note'>
                            Welcome to News App
                        </div>
                        <div className='sign-up-input-container'>
                            <label style={{ fontSize: '12px', color: '#c0c7db' }}> Name*
                                <input
                                    className='su-input'
                                    type="text"
                                    placeholder='Enter your name'
                                    value={state?.registerInput?.name}
                                    onChange={(data) => updateRegistrationInput(data, 'name')}
                                />
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {
                                        state.registerInputError.name ? state.registerInputError.name : null
                                    }
                                </div>
                            </label>

                            <label style={{ fontSize: '12px', color: '#c0c7db' }}> Email*
                                <input
                                    className='su-input'
                                    type="text"
                                    placeholder='Enter your Email'
                                    value={state?.registerInput?.email}
                                    onChange={(data) => updateRegistrationInput(data, 'email')}
                                />
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {
                                        state.registerInputError.email ? state.registerInputError.email : null
                                    }
                                </div>
                            </label>

                            <label style={{ fontSize: '12px', color: '#c0c7db' }}> Password*
                                <input
                                    className='su-input'
                                    type="text"
                                    placeholder='Enter your password'
                                    value={state?.registerInput?.password}
                                    onChange={(data) => updateRegistrationInput(data, 'password')}
                                />
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {
                                        state.registerInputError.password ? state.registerInputError.password : null
                                    }
                                </div>
                            </label>

                            <label style={{ fontSize: '12px', color: '#c0c7db' }}> Confirm password*
                                <input
                                    className='su-input'
                                    type="text"
                                    placeholder='Confirm your password'
                                    value={state?.registerInput?.password_confirmation}
                                    onChange={(data) => updateRegistrationInput(data, 'password_confirmation')}
                                />
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {
                                        state.registerInputError.password_confirmation ? state.registerInputError.password_confirmation : null
                                    }
                                </div>
                            </label>
                        </div>
                        <div className='sign-up-btn'>
                            <ButtonComponent
                                onClick={() => handleSignUp()}
                                type='filled'
                                text={!state.registerLoad ? 'Sign Up' : 'Loading..'}
                            />
                        </div>
                    </div>
                }

                {
                    state.dialogType === 'logIn' &&
                    <div className='log-in-wrapper'>
                        <div className="log-in-heading-wrapper">
                            <div className="log-in-heading"> Log In </div>
                            <div onClick={() => showDialog(false, {})} className="log-in-close-btn">
                                <img
                                    src={closeIcon}
                                    alt=""
                                    width={"20px"}
                                    height={"20px"}
                                />
                            </div>
                        </div>
                        <div className='welcome-note'>
                            Welcome to News App
                        </div>
                        <div className='log-in-input-container'>
                            {/* <label style={{ fontSize: '12px', color: '#c0c7db' }}> Name*
                                <input
                                    className='li-input'
                                    type="text"
                                    placeholder='Enter your name'
                                    value={state?.logInInput?.name}
                                    onChange={(data) => updateLogInInput(data, 'name')}
                                />
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {
                                        state.logInInputError.name ? state.logInInputError.name : null
                                    }
                                </div>
                            </label> */}
                            <label style={{ fontSize: '12px', color: '#c0c7db' }}> Email*
                                <input
                                    className='li-input'
                                    type="text"
                                    placeholder='Enter your Email'
                                    value={state?.logInInput?.email}
                                    onChange={(data) => updateLogInInput(data, 'email')}
                                />
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {
                                        state.logInInputError.email ? state.logInInputError.email : null
                                    }
                                </div>
                            </label>
                            <label style={{ fontSize: '12px', color: '#c0c7db' }}> Password*
                                <input
                                    className='li-input'
                                    type="text"
                                    placeholder='Enter your password'
                                    value={state?.logInInput?.password}
                                    onChange={(data) => updateLogInInput(data, 'password')}
                                />
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {
                                        state.logInInputError.password ? state.logInInputError.password : null
                                    }
                                </div>
                            </label>
                        </div>
                        <div className='log-in-btn'>
                            <ButtonComponent
                                onClick={() => handleLogIn()}
                                type='filled'
                                text={!state.logInLoad ? 'Log In' : 'Loading..'}
                            />
                        </div>
                    </div>
                }

                {state.dialogType === 'profile' && <ProfileComponent showDialog={showDialog} />}
            </DialogComponent>

        </header>
    )
};

export default NavbarComponent;