import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import Header from "./../../components/Header";
import HandChoice from "./../../components/HandChoice";
import OpponentChoice from "./../../components/OpponentChoice";
import ActionHands from "./../../components/ActionHands";
import { nosPropTypes } from "@nosplatform/api-functions/es6";

import { injectNOS } from "../../nos";

const styles = {
  "@import": "https://fonts.googleapis.com/css?family=Source+Sans+Pro",
  "@global html, body": {
    fontFamily: "Source Sans Pro",
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff"
  },
  "@global button": {
    backgroundColor: "rgb(255, 202, 44)",
    border: "none",
    zIndex: 1,
    cursor: "pointer"
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerAddress: "",
      opponent: localStorage.getItem("opponent") || "",
      hand: localStorage.getItem("hand") || "",
      gameId: localStorage.getItem("gameId") || ""
    };
  }

  componentDidMount = async () => {
    await this.setState({ playerAddress: await this.props.nos.getAddress() });
  };

  setOpponent = async opponent => {
    localStorage.setItem("opponent", opponent);
    await this.setState({ opponent });
  };

  render = () => {
    const { classes } = this.props;

    return (
      <div className={classes.App}>
        <Header title="rock scissors paper" />
        <OpponentChoice
          playerAddress={this.state.playerAddress}
          opponent={this.state.opponent}
          chooseOpponent={this.setOpponent}
        />
        <HandChoice hand={this.state.hand} />
        <ActionHands gameId={this.state.gameId} />
      </div>
    );
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  nos: nosPropTypes.isRequired
};

export default injectNOS(injectSheet(styles)(App));
