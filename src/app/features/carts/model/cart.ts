import { Product } from "./product"

export interface Cart {
    id?: number;
    userId: number | string;
    date?: string;
    products?: Product[];
}