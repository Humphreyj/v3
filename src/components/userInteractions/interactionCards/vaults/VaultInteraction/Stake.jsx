import React, { useState } from "react";
import { connect } from "react-redux";
import { formatInput } from "../../../../../helpers/utils";

const Stake = (props) => {
  const { vault, setCard } = props;
  const [stake, setStake] = useState(0);
  const changeHandler = (e) => {
    setStake(e.target.value);
  };
  const blurHandler = (e) => {
    console.log(formatInput(stake));
  };
  const [isMax, setIsMax] = useState(false);

  const setMax = () => {
    setIsMax(true);
    if (
      props.vaults[vault.name].user_balance > 0 &&
      props.vaults[vault.name].user_balance < 1
    ) {
      setStake(props.vaults[vault.name].user_balance);
    } else if (props.vaults[vault.name].user_balance > 1) {
      setStake(props.vaults[vault.name].user_balance.toFixed(6));
    }
  };
  const clear = () => {
    setIsMax(false);

    setStake(0);
  };

  return (
    <div className="vault-interaction-container">
      <p className="section-heading">Choose an amount to stake:</p>
      <div className="vault-interaction-input-container">
        {stake > 0 || isMax ? (
          <button className="max-button" onClick={clear}>
            clear
          </button>
        ) : (
          <button className="max-button" onClick={setMax}>
            max
          </button>
        )}
        <input
          type="number"
          onChange={changeHandler}
          onBlur={blurHandler}
          className="amount-input"
          value={stake}
        />
      </div>
      <div className="vault-interaction-container-buttons">
        <button
          onClick={(e) => {
            setCard(e);
          }}
          className="cancel"
        >
          cancel
        </button>
        <button className="vault-interaction-button">Stake</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    vaults: state.vaults.state,
  };
};

export default connect(mapStateToProps)(Stake);
