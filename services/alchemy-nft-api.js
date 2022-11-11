export class AlchemyNftApi {
    constructor(url) {
        if (url === undefined || url === '') {
            url = `https://${process.env.NEXT_PUBLIC_ALCHEMY_NETWORK}.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
        }
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        this.url = url;
    }

    withPath(path) {
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        return `${this.url}${path}`;
    }

    async getWalletNfts(owner) {
        return fetch(this.withPath(`/getNFTs?owner=${owner}`),
            { method: 'GET' }
        )
            .then(async response => new GetNftResponse(await response.json(), response.url))
    };

    async getWalletNftsFromCollection(owner, collection) {
        return fetch(this.withPath(`/getNFTs?owner=${owner}&contractAddresses%5B%5D=${collection}`),
            { method: 'GET' }
        )
            .then(async response => new GetNftResponse(await response.json(), response.url))
    }

    async getCollectionNfts(collection, withMetadata = false) {
        return fetch(this.withPath(`/getNFTsForCollection?contractAddress=${collection}&withMetadata=${withMetadata}`),
            { method: 'GET' }
        )
            .then(async response => new GetNftForCollectionResponse(await response.json(), response.url))
    }

    async getNextPage(url) {
        if (!url.startsWith(this.url)) {
            throw new Error(`Invalid url: ${url}`);
        }

        return fetch(url,
            { method: 'GET' }
        )
            .then(async response => {
                const url = response.url;
                if (url.includes('/getNFTs?')) {
                    return new GetNftResponse(await response.json(), url);
                } else if (url.includes('/getNFTsForCollection?')) {
                    return new GetNftForCollectionResponse(await response.json(), url);
                } else {
                    throw new Error(`Invalid url: ${url}`);
                }
            });
    }
}

class GetNftResponse {
    constructor(data, url) {
        this.data = data;
        this.url = url;
    }

    getNfts() {
        return this.data.ownedNfts;
    }

    hasMoreNfts() {
        return (this._getPageKey() !== undefined)
    }

    getNextPageUrl() {
        if (!this.hasMoreNfts()) {
            return '';
        }

        const nextUrl = new URL(this.url);
        nextUrl.searchParams.set('pageKey', this._getPageKey());
        return nextUrl.toString();
    }

    _getPageKey() {
        return this.data.pageKey;
    }
}

class GetNftForCollectionResponse {
    constructor(data, url) {
        this.data = data;
        this.url = url;
    }

    getNfts() {
        return this.data.nfts;
    }

    hasMoreNfts() {
        return (this._getNextToken() !== undefined);
    }

    getNextPageUrl() {
        if (!this.hasMoreNfts()) {
            return '';
        }

        const nextUrl = new URL(this.url);
        nextUrl.searchParams.set('startToken', this._getNextToken());
        return nextUrl.toString();
    }

    _getNextToken() {
        return this.data.nextToken;
    }
}