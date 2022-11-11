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
            .then(response => response.json())
            .then(data => new GetNftResponse(data));
    };

    async getWalletNftsFromCollection(owner, collection) {
        return fetch(this.withPath(`/getNFTs?owner=${owner}&contractAddresses%5B%5D=${collection}`),
            { method: 'GET' }
        )
            .then(response => response.json())
            .then(data => new GetNftResponse(data));
    }

    async getCollectionNfts(collection, withMetadata = false) {
        return fetch(this.withPath(`/getNFTsForCollection?contractAddress=${collection}&withMetadata=${withMetadata}`),
            { method: 'GET' }
        )
            .then(response => response.json())
            .then(data => new GetNftForCollectionResponse(data));
    }
}

class GetNftResponse {
    constructor(data) {
        this.data = data;
    }

    getNfts() {
        return this.data.ownedNfts;
    }
}

class GetNftForCollectionResponse {
    constructor(data) {
        this.data = data;
    }

    getNfts() {
        return this.data.nfts;
    }
}