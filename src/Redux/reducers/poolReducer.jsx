const initialState = {
  currentPool: null,
  assetArray: [],
  loaded: false,
  pools: {
    "Array Collateral Pool": {
      address: "0x02e1300A7E6c3211c65317176Cf1795f9bb1DaAb",
      name: "Array Collateral Pool",
      tokens: {},
    },
  },
};

const vaultReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_POOL":
      return {
        ...state,
        currentPool: action.payload,
      };

    case "SET_ASSET_ARRAY":
      return {
        ...state,
        assetArray: action.payload,
      };
    case "GET_VAULT_INFO":
      return {
        ...state,
        vaults: action.payload,
      };

    case "GET_ALL_POOLS":
      return {
        ...state,
        pools: action.payload,
      };
    case "ALL_LOADED":
      return {
        ...state,
        loaded: action.payload,
      };
    default:
      return state;
  }
};

export default vaultReducer;
