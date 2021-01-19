/** An object with URL utils related to handling wild slashes. */
export const Url = {
    /** Joins N parts of a URL taking care of extra slashes.
     *
     * Example: `Url.join('a', 'b/', '/c', 'd/') === 'a/b/c/d'`. */
    join(...parts: string[]): string {
        return parts.map(Url.trimSlashes).join('/');
    },

    /** Removes the leading and/or trailing slash of a URL if present.
     *
     * Example: `Url.trimSlashes('/a/b/') === 'a/b'`. */
    trimSlashes(url: string): string {
        return url
            .replace(/^\//, '') // remove leading slash
            .replace(/\/$/, ''); // remove trailing slash
    },

    /** Adds a trailing slash to the URL if not present.
     *
     * Example: `Url.withTrailingSlash('a/b') === 'a/b/'`. */
    withTrailingSlash(url: string): string {
        return url.endsWith('/') ? url : url + '/';
    },

    withId(url: string, id: number | string): string {
        const urlWithId = Url.join(url, `${id}`); // [1]

        if (id == null) {
            throw new Error(
                `Attempted to make a request to an URL with non-existent id: "${urlWithId}"`
            );
        }

        return urlWithId;

        /* [1]: `id` may be `null` or `undefined` by accident so we
         *      do string interpolation instead of `.toString()`. */
    },
};
