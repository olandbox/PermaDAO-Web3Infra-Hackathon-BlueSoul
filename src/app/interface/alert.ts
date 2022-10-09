export interface Alert {
    title?: string;
    body: string;
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    time?: number;
    haveClose?: boolean;
}