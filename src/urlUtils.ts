/** An object with URL utils related to handling wild slashes. */
export const Url = {
    /** Joins N parts of a URL without duplicated slashes.
     * The joined URL will respect the presence of a trailing slash from the last part.
     *
     * Example: `Url.join('a', 'b/', '/c', 'd/') === 'a/b/c/d/'`. */
    join(...parts: string[]): string {
        // prettier-ignore
        return parts.reduce((url, part) =>
            Url.withoutTrailingSlash(url) + '/' + Url.withoutLeadingSlash(part)
        );
    },

    /** Removes the leading slash from the given URL part if present.
     *
     * Example: `Url.withoutLeadingSlash('/foo/bar/') === 'foo/bar/'`. */
    withoutLeadingSlash(part: string): string {
        return part.replace(/^\//, '');
    },

    /** Removes the trailing slash from the given URL if present.
     *
     * Example: `Url.withoutTrailingSlash('http://foo/') === 'http://foo'`. */
    withoutTrailingSlash(url: string): string {
        return url.replace(/\/$/, '');
    },

    /** Adds a trailing slash to the given URL if not present.
     *
     * Example: `Url.withTrailingSlash('http://foo') === 'http://foo/'`. */
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
