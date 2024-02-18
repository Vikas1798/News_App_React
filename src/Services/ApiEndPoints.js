export const NewsApp = {
    FILTER_PARAMS: "/api/news/categories-and-sources",
    GET_NEWS :(page) => `/api/news?page=${page}`,

    REGISTRATION:"/api/auth/register",
    LOGIN:"/api/auth/login",
    LOGOUT:'/api/auth/logout',
    PROFILE:"/api/user"
};