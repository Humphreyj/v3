import { useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import { getExchangeRates } from "./Redux/actions/currencyActions";
import { getTotalTvl } from "./Redux/actions/ArrayActions";
import "./styles/global.scss";

function App(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(getBigCoinsPrice());
    dispatch(getExchangeRates());
    dispatch(getTotalTvl(props.vaults, props.provider));
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (props.provider) {
    }
  }, [props.provider]);

  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    provider: state.wallet.provider,
    currentBlock: state.wallet.currentBlock,
    lastBlock: state.wallet.lastBlock,
    vaults: state.vaults,
  };
};

export default connect(mapStateToProps)(App);
