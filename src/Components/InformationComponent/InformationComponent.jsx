import React, { useEffect, useState, useCallback, useRef } from "react";
import { getAPI } from "../../Services/MasterApi";
import { NewsApp } from '../../Services/ApiEndPoints';
import './information.css';
import DialogComponent from "../ReusableComponent/DialogComponent/DialogComponent";
import closeIcon from '../../Assets/close-icon.svg';
import useNews from './useNews';
import noData from '../../Assets/no-data.svg';
import nullImage from '../../Assets/null-Image.png'
import { convertDate } from "../../Services/MasterApi";

const InformationComponent = (props) => {
    const [state, setState] = useState({
        openDialog: false,
        newsDetails: {},
        toggleFilters: false,
        filterParam: {},
        filterParamLoad: false,

        getNews: {
            from: "",
            to: "",
            search: '',
            categories: [],
            sources: [],
            preferred_content: false
        },
        pageNumber: 1,
    })

    const { allNews, hasMoreNews, loading, error } = useNews(state.getNews, state.pageNumber);
    const ref = useRef();
    let { current: observer } = ref;
    const lastNewsElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer) observer.disconnect();
            observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreNews) {
                    setState((prev) => {
                        return {
                            ...prev,
                            pageNumber: state.pageNumber + 1,
                        };
                    });
                }
            });
            if (node) observer.observe(node);
        },
        [loading, hasMoreNews]
    );

    useEffect(() => {
        if (state?.search !== props?.search) {
            setTimeout(() => {
                setState((prev) => {
                    return {
                        ...prev,
                        getNews: {
                            ...prev.getNews,
                            search: props?.search,
                        }
                    };
                });
            }, 2000);
        }
    }, [props?.search, state?.search]);


    useEffect(() => {
        handleFilterParams();
    }, []);

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

    const handleFilterNews = (e, check) => {
        if (check === "categories") {
            let category = state.getNews.categories;
            if (e.target.checked) {
                category?.push(e.target.value);
            } else {
                let valueToRemove = e.target.value;
                category = category?.filter((item) => item !== valueToRemove);
            }
            setState((prev) => {
                return {
                    ...prev,
                    pageNumber: 1,
                    getNews: {
                        ...prev.getNews,
                        [check]: category,
                    }
                }
            })
        }

        if (check === "sources") {
            let source = state.getNews.sources;
            if (e.target.checked) {
                source?.push(e.target.value);
            } else {
                let valueToRemove = e.target.value;
                source = source?.filter((item) => item !== valueToRemove);
            }
            setState((prev) => {
                return {
                    ...prev,
                    pageNumber: 1,
                    getNews: {
                        ...prev.getNews,
                        [check]: source,
                    }
                }
            })
        }
    };

    //open dialog
    const showDialog = (open, data) => {
        setState((prev) => {
            return {
                ...prev,
                openDialog: open,
                newsDetails: data
            }
        })
    }

    const handlePreferredContent = (e) => {
        setState((prev) => {
            return {
                ...prev,
                getNews: {
                    ...prev.getNews,
                    preferred_content: e.target.checked,
                }
            };
        });
    }

    const handleChangeDate = (e, param) => {
        setState((prev) => {
            return {
                ...prev,
                getNews: {
                    ...prev.getNews,
                    [param]: (e.target.value).split("-").reverse().join("-"),
                }
            }
        })
    }
    var isLogIn = JSON.parse(localStorage.getItem('isLogin')) ?? false;
    return (
        <div className="info-main-wrapper">
            {
                isLogIn ?
                    <div className="filter-by-content">
                        <div className="content-label"> Preferred Content </div>
                        <label className="content-switch">
                            <input
                                type="checkbox"
                                onChange={(e) => { handlePreferredContent(e); }}
                                checked={state?.getNews?.preferred_content}
                            />
                            <span className="content-slider content-round"></span>
                        </label>
                    </div>
                    : null
            }

            <div className="info-container">
                <div className='filter-container'>
                    <div className="filter-by-date">
                        <div className="date-label"> Date</div>
                        <label style={{ fontSize: '12px' }}>
                            From
                            <input
                                className="date-filter"
                                type="date"
                                value={state.getNews.from.split("-").reverse().join("-")}
                                onChange={(e) => handleChangeDate(e, 'from')}
                            />
                        </label>
                        <label style={{ fontSize: '12px' }}>
                            To
                            <input
                                className="date-filter"
                                type="date"
                                value={state.getNews.to.split("-").reverse().join("-")}
                                onChange={(e) => handleChangeDate(e, 'to')}
                            />
                        </label>
                    </div>

                    {
                        state?.getNews?.preferred_content ? null :
                            <>
                                <hr />
                                <div className="filter-by-category">
                                    <div className="category-label"> Categories </div>
                                    <div className="all-categories">
                                        {
                                            state.filterParamLoad ?
                                                <div className="categories-skeleton-container">
                                                    {
                                                        [1, 2, 3, 4, 5, 6, 7].map((d, i) => (
                                                            <div key={i} className="categories-skeleton"></div>
                                                        ))
                                                    }
                                                </div>
                                                :
                                                state?.filterParam?.categories?.length === 0 ? <div> No data </div> :
                                                    state?.filterParam?.categories?.map((d, i) => (
                                                        <div key={i} className="filter-category">
                                                            <input
                                                                type="checkbox"
                                                                className="check-box-input"
                                                                id={d.name}
                                                                autoComplete="off"
                                                                value={d.name}
                                                                onChange={(e) => handleFilterNews(e, 'categories')}
                                                            />
                                                            <div className="checkbox-label">{d?.name}</div>
                                                        </div>
                                                    ))
                                        }
                                    </div>

                                </div>
                                <hr />
                            </>
                    }
                    {
                        state?.getNews?.preferred_content ? null :
                            <>
                                <div className="filter-by-source">
                                    <div className="source-label"> Sources </div>
                                    <div className="all-sources">
                                        {
                                            state.filterParamLoad ?
                                                <div className="sources-skeleton-container">
                                                    {
                                                        [1, 2, 3, 4].map((d, i) => (
                                                            <div key={i} className="sources-skeleton"></div>
                                                        ))
                                                    }
                                                </div>

                                                :
                                                state?.filterParam?.sources?.length === 0 ? <div> No data </div> :
                                                    state?.filterParam?.sources?.map((d, i) => (
                                                        <div key={i} className="filter-source">
                                                            <input
                                                                type="checkbox"
                                                                className="check-box-input"
                                                                id={d.name}
                                                                autoComplete="off"
                                                                value={d.name}
                                                                onChange={(e) => handleFilterNews(e, 'sources')}
                                                            />
                                                            <div className="checkbox-label">{d?.name}</div>
                                                        </div>
                                                    ))
                                        }
                                    </div>
                                </div>
                            </>
                    }

                </div>
                <div className="news-data-main-container">
                    <div className="news-data-container">

                        {allNews?.map((data, index) => {
                            if (allNews?.length === index + 1) {
                                return (
                                    <div ref={lastNewsElementRef} key={index} className="news-main-wrapper" onClick={() => showDialog(true, data)}>
                                        <img src={data?.image ?? nullImage} alt="" className="news-img" />
                                        <div className="news-source"> {data?.source} </div>
                                        <div className="news-headline"> {data?.title} </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={index} className="news-main-wrapper" onClick={() => showDialog(true, data)}>
                                        <img src={data?.image ?? nullImage} alt="" className="news-img" />
                                        <div className="news-source"> {data?.source} </div>
                                        <div className="news-headline"> {data?.title} </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    {loading ? (
                        <div className="news-list-skeleton">
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((d, i) => (
                                    <div className="list-skeleton" key={i}>
                                        <div className="news-list"></div>
                                    </div>
                                ))
                            }
                        </div>

                    ) : (
                        allNews?.length === 0 && (
                            <div className="not-data-found-main-container">
                                <img
                                    src={noData}
                                    alt="img"
                                    className='not-found-image'
                                />
                                <h6 className='not-found-text'>
                                    It's Empty in here
                                </h6>
                            </div>
                        )
                    )}
                    <div>{error && "Error"}</div>
                </div>
            </div>

            <DialogComponent show={state.openDialog} handleClose={showDialog} size='medium'>
                <div className="news-detail-wrapper">
                    <div className="news-heading-wrapper">
                        <div className="detail-heading"> News Detail </div>
                        <div onClick={() => showDialog(false, {})} className="news-detail-close-btn">
                            <img
                                src={closeIcon}
                                alt=""
                                width={"20px"}
                                height={"20px"}
                            />
                        </div>
                    </div>
                    <hr />
                    <img
                        className="news-image"
                        src={state?.newsDetails?.image ?? nullImage}
                        alt=""
                    />
                    <div className="all-news-details">
                        <div className="details-data">
                            <div className="details-label">Source</div>
                            <div className="details-value">{state?.newsDetails?.source}</div>

                        </div>
                        <div className="details-data">
                            <div className="details-label">Title</div>
                            <div className="details-value">{state?.newsDetails?.title}</div>

                        </div>
                        <div className="details-data">
                            <div className="details-label">Author</div>
                            <div className="details-value">{state?.newsDetails?.author}</div>
                        </div>

                        <div className="details-data">
                            <div className="details-label">Content</div>
                            <div className="details-value">{state?.newsDetails?.content}</div>
                        </div>

                        <div className="details-data">
                            <div className="details-label">Published at</div>
                            <div className="details-value">{convertDate(state?.newsDetails?.published_at)}</div>
                        </div>

                        <div className="details-data">
                            <div className="details-label">URL</div>
                            <div className="details-value news-url"
                                onClick={() => window.open(state?.newsDetails?.url, '_blank', 'toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes')}

                            >{state?.newsDetails?.url}</div>
                        </div>
                    </div>

                </div>
            </DialogComponent>
        </div>
    );
};

export default InformationComponent;