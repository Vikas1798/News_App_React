import React, { useEffect, useState } from "react";
import { getAPI, postAPI } from "../../../Services/MasterApi";
import { NewsApp } from '../../../Services/ApiEndPoints';
import './profile.css';
import closeIcon from '../../../Assets/close-icon.svg';
import { Toastify } from '../../ReusableComponent/Toastify';
import DropdownComponent from "../../ReusableComponent/DropdownComponent/DropdownComponent";
import ButtonComponent from "../../ReusableComponent/ButtonComponent/ButtonComponent";

const ProfileComponent = (props) => {

    const [state, setState] = useState({
        profileData: {},
        profileLoad: false,

        updateProfile: {
            categories: [],
            sources: [],
            authors: []
        },
        updateProfileLoad: false,

        filterParam: {},
        filterParamLoad: false,

        //test
        tags: []

    })

    useEffect(() => {
        getUserProfileData();
        handleFilterParams();
    }, []);

    //get profile data
    const getUserProfileData = async () => {
        setState((prev) => {
            return {
                ...prev,
                profileLoad: true,
            };
        });

        var token = localStorage.getItem('token');
        const url = NewsApp.PROFILE;
        await getAPI(url, { headers: { "Authorization": `Bearer ${token}` } })
            .then((response) => {
                if (response?.data?.status) {
                    let responseData = response?.data?.data?.user ?? {};
                    setState((prev) => {
                        return {
                            ...prev,
                            profileData: responseData,
                            updateProfile: {
                                ...prev.updateProfile,
                                authors: responseData?.preferred_authors,
                                categories: responseData?.preferred_categories,
                                sources: responseData?.preferred_sources,

                            },
                        };
                    });
                }
                setState((prev) => {
                    return {
                        ...prev,
                        profileLoad: false,
                    };
                });
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    localStorage.clear();
                    Toastify("error", error)

                }
                console.log('Error', error);
                setState((prev) => {
                    return {
                        ...prev,
                        profileLoad: false,
                    };
                });
            });
    };

    //preferred sources
    const handleFilterParams = async () => {
        setState((prev) => {
            return {
                ...prev,
                filterParamLoad: true,
            };
        });

        const url = NewsApp.FILTER_PARAMS;
        await getAPI(url)
            .then((response) => {
                let responseData = response?.data?.data ?? {};
                setState((prev) => {
                    return {
                        ...prev,
                        filterParam: responseData,
                        filterParamLoad: false,
                    };
                });
            })
            .catch((error) => {
                console.log('Error', error);
                setState((prev) => {
                    return {
                        ...prev,
                        filterParamLoad: false,
                    };
                });
            });
    };

    //on change update dropdown data
    const updateDropDownData = (data, key) => {
        let d = data?.map((a) => a.name);
        setState((prev) => {
            return {
                ...prev,
                updateProfile: {
                    ...prev.updateProfile,
                    [key]: d
                }
            }
        })
    }

    //update profile
    const handleUpdateProfile = () => {
        setState((prev) => {
            return {
                ...prev,
                updateProfileLoad: true,
            };
        });

        try {
            let payload = state.updateProfile;
            var token = localStorage.getItem('token');

            const url = NewsApp.PROFILE;
            postAPI(url, payload, { headers: { "Authorization": `Bearer ${token}` } }).then((response) => {
                if (response?.data?.status) {
                    let responseData = response?.data?.data?.user ?? {};
                    setState((prev) => {
                        return {
                            ...prev,
                            profileData: responseData
                        }
                    })
                    Toastify("success", response?.data?.message);
                    // props.showDialog(false, {});
                }
                setState((prev) => {
                    return {
                        ...prev,
                        updateProfileLoad: false,
                    };
                });

            });
        } catch (error) {
            Toastify("error", error)
            console.log('Error', error);
            if (error?.response?.status === 401) {
                localStorage.clear();
                Toastify("error", error)

            }
            setState((prev) => {
                return {
                    ...prev,
                    updateProfileLoad: false,
                };
            });
            // props.showDialog(false, {});
        }
    }

    //authors tagss
    // remove authors
    const removeTags = (indexToRemove, key) => {
        setState((prev) => {
            return {
                ...prev,
                updateProfile: {
                    ...prev.updateProfile,
                    [key]: [...state?.updateProfile?.authors?.filter((_, index) => index !== indexToRemove)]
                }
            }
        })
    }

    // add authors
    const addTags = (event, key) => {
        if (event.target.value !== "") {
            setState((prev) => {
                return {
                    ...prev,
                    updateProfile: {
                        ...prev.updateProfile,
                        [key]: [...state.updateProfile.authors, event.target.value]
                    }
                }
            })
            event.target.value = "";
        }
    };

    let { profileData } = state;
    return (
        <div className='profile-wrapper'>
            <div className="profile-heading-wrapper">
                <div className="profile-heading"> Profile </div>
                <div onClick={() => props.showDialog(false, {})} className="profile-close-btn">
                    <img
                        src={closeIcon}
                        alt=""
                        width={"20px"}
                        height={"20px"}
                    />
                </div>
            </div>
            {
                state?.profileLoad ?
                    <div className="profile-data-skeleton">
                        <div className="profile-skeleton">
                        </div>
                    </div>
                    :
                    Object.keys(state?.profileData).length === 0 ? <div className="no-profile-data"> No Data Found</div> :
                        <div className="user-profile-data">
                            <div className="user-data">
                                <div className="user-data-label">
                                    Name
                                </div>
                                <div className="user-data-value">
                                    {profileData?.name}
                                </div>

                            </div>
                            <div className="user-data">
                                <div className="user-data-label">
                                    Email
                                </div>
                                <div className="user-data-value">
                                    {profileData?.email}
                                </div>

                            </div>
                        </div>
            }

            {/* search dropdown  */}
            {
                state?.filterParamLoad ?
                    <div className="profile-data-skeleton">
                        <div className="profile-skeleton">
                        </div>
                    </div>
                    :
                    <div className="preferred-main-wrapper">

                        <div className="preferred-sources-wrapper">
                            <div className="preferred-sources-label">Preferred sources</div>
                            {/* <div className="sources-labels">
                                {
                                    profileData?.preferred_sources?.map((d, i) => (
                                        <div className="source-d" key={i}>{d}</div>
                                    ))
                                }
                            </div> */}
                            <DropdownComponent
                                isSearchable
                                isMulti
                                placeHolder="Select preferred sources"
                                options={state?.filterParam?.sources}
                                onChange={(value) => updateDropDownData(value, "sources")}

                                // testing
                                apiData={profileData?.preferred_sources}
                            />
                            <hr />
                        </div>

                        <div className="preferred-sources-wrapper">
                            <div className="preferred-sources-label">Preferred categories</div>
                            {/* <div className="categories-labels">
                                {
                                    profileData?.preferred_categories?.map((d, i) => (
                                        <div className="categories-d" key={i}>{d}</div>
                                    ))
                                }
                            </div> */}
                            <DropdownComponent
                                isSearchable
                                isMulti

                                placeHolder="Select preferred categories"
                                options={state?.filterParam?.categories}
                                onChange={(value) => updateDropDownData(value, "categories")}

                                // testing
                                apiData={profileData?.preferred_categories}
                            />
                            <hr />
                        </div>

                        <div className="preferred-sources-wrapper">
                            <div className="preferred-sources-label">Preferred authors</div>
                            {/* <div className="categories-labels">
                                {
                                    profileData?.preferred_authors?.map((d, i) => (
                                        <div className="categories-d" key={i} >{d}</div>
                                    ))
                                }
                            </div> */}

                            <div className="tags-input">
                                {state?.updateProfile?.authors?.map((tag, index) => (
                                    <div key={index} className="tag">
                                        <div className='tag-title'>
                                            {tag}
                                        </div>
                                        <div onClick={() => removeTags(index, 'authors')} className='tag-close-icon'>
                                            {/* <CloseIcon /> */}
                                            x
                                        </div>
                                    </div>
                                ))}
                                <input
                                    className="authors-input"
                                    type="text"
                                    onKeyUp={event => event.key === "Enter" ? addTags(event, 'authors') : null}
                                    placeholder="Press enter to add authors"
                                />
                            </div>
                        </div>
                    </div>
            }

            <div className='update-profile-btn'>
                <ButtonComponent
                    onClick={() => handleUpdateProfile()}
                    type='filled'
                    text={!state.updateProfileLoad ? 'Update' : 'Loading..'}
                />
            </div>
        </div>
    );
};

export default ProfileComponent;