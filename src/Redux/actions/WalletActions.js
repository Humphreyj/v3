import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ERC20_ABI } from "../../data/ABI";
import axios from "axios";
import rpcProvider from "../../helpers/provider";
import Web3 from "web3";

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_KEY, // required
      },
    },
  },
});

export const setProvider = () => (dispatch) => {
  dispatch({
    type: "SET_PROVIDER",
  });
};
export const getGasPrice = (provider) => async (dispatch) => {
  let currentGas = await provider.getGasPrice();
  dispatch({
    type: "SET_GAS_PRICE",
    gasPrice: parseFloat(ethers.utils.formatUnits(currentGas.toString(), 9)),
  });
};

const addProviderEvents = (provider, userData) => {
  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    console.log("web3 account changed: ", accounts);
    if (accounts[0].toLowerCase() !== userData.id.toLowerCase())
      connectUserWallet();
  });

  // Subscribe to chainId change
  // provider.on("chainChanged", (chainId) => {
  //   console.log("chain changed: ", chainId);
  // });

  // Subscribe to provider connection
  provider.on("connect", (info) => {
    console.log("web3 connection changed: ", info.chainId);
  });

  // Subscribe to provider disconnection
  provider.on("disconnect", (error) => {
    console.log("web3 connection interrupted: ", error);
    window.location.reload();
  });
};
let signer;
const getUserAccount = async (provider) => {
  let eth;
  let account;
  if (provider || window.ethereum) {
    eth = new ethers.providers.Web3Provider(provider || window.ethereum);
    const accounts = await eth.listAccounts().catch((err) => {
      console.log(err);
    });
    signer = eth.getSigner();
    account = accounts[0];
  }

  return account || undefined;
};
export const connectUserWallet = () => async (dispatch) => {
  const provider = await web3Modal.connect().catch((err) => {
    console.log(err);
  });
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
  } else {
    window.web3 = new Web3(rpcProvider);
  }

  const userData = await getUserAccount(provider).catch((err) => {
    console.log(err);
  });
  if (provider.isMetaMask) {
    addProviderEvents(provider, userData);
  }

  dispatch({
    type: "CONNECT_WALLET",
    address: userData,
    provider: signer.provider,
    signer: signer,
  });
};

export const getTokenPrice = (token) => {
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${token}&vs_currencies=usd`
    )
    .then((res) => {
      let price = res.data[`${token.toLowerCase()}`]["usd"];

      return price;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const approveAsset =
  (asset, signer, address, poolAddress, amount, assets, func) =>
  async (dispatch) => {
    if (!asset.address) {
      console.log("Nothing selected");
    } else {
      const contract = new ethers.Contract(asset.address, ERC20_ABI, signer);

      let amt = amount >= 0 ? amount : ethers.constants.MaxUint256;
      let approveTx;
      approveTx = await contract.approve(poolAddress, amt).catch((err) => {
        func(false);

        console.log(err);
        console.clear();
      });
      let copy = { ...assets };
      if (approveTx) {
        let confirm = await approveTx.wait().catch((err) => {
          console.log(err);
        });
        if (confirm) {
          copy[`${asset.symbol}`]["allowance"] = ethers.utils.formatUnits(
            await contract.allowance(address, poolAddress).catch((err) => {
              console.log(err);
            })
          );
          console.log(copy);

          return dispatch({
            type: "SET_ASSET_ARRAY",
            payload: Object.values(copy),
          });
        }
      }
    }
  };
export const selectAsset = (asset) => (dispatch) => {
  dispatch({
    type: "SET_SELECTED_ASSET",
    payload: asset,
  });
};
export const setAssetAmount = (amount) => (dispatch) => {
  dispatch({
    type: "SET_SELECTED_ASSET_AMOUNT",
    payload: amount,
  });
};

export const checkForApproval =
  //check for approval when assets are rendered
  (assets, address, poolAddress, signer) => (dispatch) => {
    const arr = Object.values(assets);
    if (address && poolAddress) {
      arr.map(async (asset) => {
        const contract = new ethers.Contract(asset.address, ERC20_ABI, signer);
        let allowance = await contract
          .allowance(address, poolAddress)
          .catch((err) => {
            console.log(err);
          });

        asset.allowance = ethers.utils.formatUnits(allowance);
      });

      dispatch({
        type: "SET_ASSET_ARRAY",
        payload: arr,
      });
    }
  };
