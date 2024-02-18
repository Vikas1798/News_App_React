import axios from "axios";
import { Toastify } from '../Components/ReusableComponent/Toastify';


let NEWS_APP_BASE_API_PATH = "https://api-news.bhartiyaelectric.press";


export const getAPI = async (endPoint, config) => {
    let base_path = `${NEWS_APP_BASE_API_PATH}${endPoint}`;
    config = {
        headers: null,
        ...config,
    };

    let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (config.headers) {
        headers = { ...headers, ...config.headers };
    }

    let result = await new Promise((resolve, reject) => {
        axios
            .get(base_path, { headers: headers })
            .then((response) => {
                if (response.status >= 400 && response.status < 600) {
                    reject(Error("get api error"));
                    throw new Error("Bad response from server");
                }
                resolve(response);
            })
            .catch((error) => {
                console.log(`Error response with status code ${error?.response?.status}...`,error?.response?.data?.message);
                resolve(error);
            });
    });
    return result;
};

export const postAPI = async (endPoint, data, config) => {
    let base_path = `${NEWS_APP_BASE_API_PATH}${endPoint}`;
    config = {
        headers: null,
        ...config,
    };

    let headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (config.headers) {
        headers = { ...headers, ...config.headers };
    }

    let result = await new Promise((resolve, reject) => {
        axios
            .post(base_path, data, { headers: headers })
            .then((response) => {
                if (response.status >= 400 && response.status < 600) {
                    reject(Error("post api error"));
                    throw new Error("Bad response from server");
                }
                resolve(response);
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    localStorage.clear();
                }
                Toastify("error", `Status: ${error?.response?.status}.. ${error?.response?.data?.message}`)
                console.log(`Error response with status code ${error?.response?.status}...`,error?.response?.data?.message);
                resolve(error);
                
            });
    });
    return result;
};


//convert date 2022-11-26T00:00:00+05:30 to 2022-11-26
export const convertDate = (str) => {
    var date = new Date(str),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join("-").split("-").reverse().join("-");
};

export const ValidateName = (data) => {
    const re = /^[a-zA-Z]*[']?[ ]?[a-zA-Z]*$/;
    return re.test(data);
};

export const EmailValidate = (data) => {
    const re = /^[A-Za-z0-9._-]+@[A-Za-z0-9][^\s@]+[A-Za-z0-9].[A-Za-z]{2,}$/;
    return re.test(data);
};
