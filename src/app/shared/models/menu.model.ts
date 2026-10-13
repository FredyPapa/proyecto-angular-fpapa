export interface MenuItem{
    label: string;
    route?: string;
    children?: MenuItem[];
    action?: () => void;
}