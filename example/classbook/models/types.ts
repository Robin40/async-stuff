export interface EmailPass {
    email: string;
    password: string;
}

export interface TokenPair {
    refresh: string;
    access: string;
}

export interface UserInfo {
    first_name: string;
    last_name: string;
    email: string;
    profile: string[];
    visualizations: string[];
}
