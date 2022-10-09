export interface LinkProperties {
    alias: string;
    name?: string;
    logo: string;
    url: string;
    startDate?: string;
    endDate?: string;

    category: string;
    type: string;
    status: number;
    sort: number;
    language: string;
}
export interface LinkActions {
    aliasEditing: boolean;
    urlEditing: boolean;
    urlValid: boolean;
    swiped: boolean;
    isChanging: boolean;
}
export interface LinkNode {
    id: number;
    properties: LinkProperties;
}
export interface Link {
    id: number;
    properties: LinkProperties;
    actions: LinkActions;
}