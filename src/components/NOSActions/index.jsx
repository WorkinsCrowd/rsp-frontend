import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { nosPropTypes } from "@nosplatform/api-functions/es6";

import { injectNOS } from "../../nos";

const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

class NOSActions extends React.Component {
  handleGetAddress = async () => alert(await this.props.nos.getAddress());

  handleClaimGas = () =>
    this.props.nos
      .claimGas()
      .then(alert)
      .catch(alert);

  handleGetBalance = async scriptHash => alert(await this.props.nos.getBalance(scriptHash));

  handleTestInvoke = async (scriptHash, operation, args) => {
    const result = await this.props.nos.testInvoke(scriptHash, operation, args);

    console.log(JSON.stringify(result));

    // alert();
  };

  handleInvoke = async (scriptHash, operation, args) =>
    alert(await this.props.nos.testInvoke(scriptHash, operation, args));

  handleGetStorage = async (scriptHash, key) =>
    alert(await this.props.nos.getStorage(scriptHash, key));

  render() {
    const { classes } = this.props;

    // Get Balance

    const neo = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
    // const gas = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
    // const rpx = "ecc6b20d3ccac1ee9ef109af5a7cdb85706b1df9";

    // (test) Invoke
    const scriptHashNeoAuth = "569c501f7521a6f51aaef5d7c23370d0e0819f70";
    const operation = "getGet";
    const args = "ef68bcda-2892-491a-a7e6-9c4cb1a11732";

    // Get Storage
    const scriptHashNeoBlog = "0xc52a4b348109941b591b86185f94e1f53a137f3a";
    const key = "post.latest";

    return (
      <React.Fragment>
        <button className={classes.button} onClick={this.handleGetAddress}>
          Get Address
        </button>
        <button className={classes.button} onClick={() => this.handleGetBalance(neo)}>
          Get NEO Balance
        </button>
        {/*
          <button
            className={classes.button}
            onClick={() => this.handleGetBalance(gas)}
          >
            Get GAS Balance
          </button>
          <button
            className={classes.button}
            onClick={() => this.handleGetBalance(rpx)}
          >
            Get RPX Balance
          </button>
        */}
        <button className={classes.button} onClick={this.handleClaimGas}>
          Claim Gas
        </button>
        <button
          className={classes.button}
          onClick={() => this.handleTestInvoke(scriptHashNeoAuth, operation, args)}
        >
          TestInvoke (NeoAuth)
        </button>
        {/*
          <button
            className={classes.button}
            onClick={() => this.handleInvoke(scriptHashNeoAuth, operation, args)}
          >
            Invoke (NeoAuth)
          </button>
        */}
        <button
          className={classes.button}
          onClick={() => this.handleGetStorage(scriptHashNeoBlog, key)}
        >
          GetStorage (NeoBlog)
        </button>
      </React.Fragment>
    );
  }
}

NOSActions.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosPropTypes.isRequired
};

export default injectNOS(injectSheet(styles)(NOSActions));
