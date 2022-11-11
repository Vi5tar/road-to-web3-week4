import { useState } from "react";
import { AlchemyNftApi } from "../services/alchemy-nft-api";
import { NFTCard } from './components/nftCard';

const api = new AlchemyNftApi();

const Home = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [nfts, setNfts] = useState([]);

  const fetchNfts = async () => {
    let response;
    if (!collectionAddress && walletAddress) {
      response = await api.getWalletNfts(walletAddress);
    } else if (collectionAddress && walletAddress) {
      response = await api.getWalletNftsFromCollection(walletAddress, collectionAddress);
    } else if (collectionAddress && !walletAddress) {
      response = await api.getCollectionNfts(collectionAddress, true);
    }

    console.log(response);

    if (response) {
      setNfts(response.getNfts());
    } else {
      setNfts([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col items-center justify-center w-full gap-y-2">
        <input className="w-2/5 px-2 py-2 text-gray-800 rounded-lg bg-slate-100 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={event => setWalletAddress(event.target.value)} value={walletAddress} type="text" placeholder='wallet' />
        <input className="w-2/5 px-2 py-2 text-gray-800 rounded-lg bg-slate-100 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={event => setCollectionAddress(event.target.value)} value={collectionAddress} type="text" placeholder='collection address' />
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            fetchNfts();
          }
        }>Submit</button>
      </div>
      <div className="flex flex-wrap justify-center mt-4 w-6/7 gap-y-12 gap-x-2">
        {nfts.length ? nfts.map((nft, index) => {
          return <NFTCard key={index} nft={nft} />
        }) : ''}
      </div>
    </div>
  )
}

export default Home
