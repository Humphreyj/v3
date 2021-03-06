import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { approveAsset } from "../../../../Redux/actions/WalletActions";
import { mintArray } from "../../../../Redux/actions/poolActions";
import { motion, AnimatePresence } from "framer-motion";

import scss from "./mint.module.scss";
const Mint = (props) => {
  const dispatch = useDispatch();
  const [isApproving, setApproving] = useState(false);
  const handleApprove = () => {
    setApproving(true);
    dispatch(
      approveAsset(
        props.asset,
        props.signer,
        props.address,
        props.poolAddress,
        props.assetAmount,
        props.assets,
        setApproving
      )
    );
  };

  const buttonVariants = {
    initial: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AnimatePresence>
      <div className={props.address ? "mint-array" : "mint-array inactive"}>
        <div className="mint-content">
          <div className="mint-stats">
            <h1>Amount of array</h1>
            <h1 className="number-amount">0.0</h1>
            <h1 className="asset-name">Array</h1>
          </div>

          {props.asset ? (
            parseFloat(props.asset.allowance) > 0 ? (
              <motion.button
                className={scss["mint-button"]}
                onClick={() =>
                  mintArray(
                    props.address,
                    props.assetAmount,
                    props.asset,
                    props.provider
                  )
                }
                initial={buttonVariants.initial}
                animate={buttonVariants.visible}
              >
                Mint
              </motion.button>
            ) : (
              <motion.button
                className={
                  isApproving ? scss["approving"] : scss["approve-asset"]
                }
                onClick={handleApprove}
                initial={buttonVariants.initial}
                animate={buttonVariants.visible}
              >
                Approve {props.asset.symbol}
              </motion.button>
            )
          ) : (
            <motion.button
              className={scss["mint-button"]}
              initial={buttonVariants.initial}
              animate={buttonVariants.visible}
            >
              Mint
            </motion.button>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

const mapStateToProps = (state) => {
  return {
    address: state.wallet.address,
    provider: state.wallet.provider,
    poolAddress: state.wallet.poolAddress,
    signer: state.wallet.signer,
    asset: state.wallet.selectedAsset,
    assetAmount: state.wallet.assetAmount,
    assets: state.pools.currentPool.tokens,
  };
};

export default connect(mapStateToProps)(Mint);
