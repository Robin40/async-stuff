export function Bearer(token: string | null | undefined): HeadersInit {
    const headers = new Headers();
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
}
