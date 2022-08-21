import { useContext, useEffect, useState } from "react";
import { IdentityProviderContext } from "./hardhat/SymfoniContext";
// @ts-ignore
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";

export const useIdentityProvider = () => useContext(IdentityProviderContext)?.instance

export const useNftStorage = () => {
  const [storage, setStorage] = useState<NFTStorage>()

  useEffect(() => {
    const _storage = new NFTStorage({
      token: process.env.REACT_APP_NFT_STORATE_API_KEY || '',
    })
    setStorage(_storage)
  }, [])

  return storage
}
