export const NFTCard = ({ nft }) => {
    return (
        <div className="flex flex-col w-1/4">
            <div className="rounded-md">
                <img className="object-cover w-full h-128 rounded-t-md" src={nft.media[0].gateway} />
            </div>
            <div className="flex flex-col px-2 py-3 y-gap-2 bg-slate-100 rounded-b-md h-110">
                <div>
                    <h2 className="text-xl text-gray-800">{nft.title}</h2>
                    <p className="text-gray-600">{nft.id.tokenId.substring(nft.id.tokenId.length - 4)}</p>
                    <p className="text-gray-600">{`${nft.contract.address.substring(0, 4)}...${nft.contract.address.substring(nft.contract.address.length - 4)}`}</p>
                </div>
                <div className="flex-grow mt-2">
                    <p className="text-gray-600">{`${nft.description?.substring(0, 150)}${nft.description?.length > 150 ? '...' : ''}`}</p>
                </div>
                <div className="flex justify-center mb-1">
                    <a className="w-1/2 px-4 py-2 text-center text-white bg-blue-500 cursor-pointer rounded-m" href={`https://etherscan.io/token/${nft.contract.address}`} target="_blank">View on etherscan</a>
                </div>
            </div>
        </div>
    )
}
