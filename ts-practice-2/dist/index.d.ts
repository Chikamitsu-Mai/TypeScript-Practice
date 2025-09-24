type ProductsType = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: {
        id: number;
        name: string;
        image: string;
    };
    images: string[];
};
type CategoriesType = {
    id: number;
    name: string;
    image: string;
};
declare const BASE_URL = "https://api.escuelajs.co/api/v1";
declare const getDataUtilFunc: <T>(path?: string, query?: string) => Promise<T>;
