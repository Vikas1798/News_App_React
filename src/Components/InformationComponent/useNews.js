import { useEffect, useState } from "react";
import { postAPI } from "../../Services/MasterApi";
import { NewsApp } from '../../Services/ApiEndPoints';

export default function useNews(filterQuery, pageNumber) {
    const [state, setState] = useState({
        allNews: [],
        loading: true,
        error: false,
        hasMoreNews: false,
    });
    useEffect(() => {
        setState((prev) => {
            return {
                ...prev,
                allNews: [],
            };
        });
    }, [filterQuery]);

    useEffect(() => {
        setState((prev) => {
            return {
                ...prev,
                loading: true,
                error: false,
            };
        });

        try {
            let filterData = filterQuery;
            const url = NewsApp.GET_NEWS(pageNumber);
            postAPI(url, filterData).then((response) => {
                setState((prev) => {
                    return {
                        ...prev,
                        allNews: [
                            ...prev?.allNews,
                            ...response?.data?.data?.articles,
                        ],
                        hasMoreNews:response?.data?.data?.articles?.length > 0,
                        loading: false,
                    };
                });
            });
        } catch (error) {
            console.log('Error', error);
            setState((prev) => {
                return {
                    ...prev,
                    loading: false,
                    error: true,
                };
            });
        }
    }, [filterQuery, pageNumber]);
    let { allNews, hasMoreNews, loading, error } = state;
    return { allNews,hasMoreNews,  loading, error };
}
