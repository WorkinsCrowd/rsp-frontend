import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { nosPropTypes } from "@nosplatform/api-functions/es6";

import Header from "./../../components/Header";
import HandChoice from "./../../components/HandChoice";
import OpponentChoice from "./../../components/OpponentChoice";
import ActionHands from "./../../components/ActionHands";
import utils from "../../utils";

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
  },
  invisible: {
    display: "none"
  }
};

const contractAddress = "";

class App extends React.Component {
  constructor(props) {
    super(props);
    const gameId = localStorage.getItem("gameId") || "";

    this.state = {
      playerAddress: "",
      opponent: localStorage.getItem("opponent") || "",
      hand: localStorage.getItem("hand") || "",
      salt: localStorage.getItem("salt") || "",
      handConfirmed: localStorage.getItem("handConfirmed") || "",
      gameId,
      inProgress: !!gameId,
      opponentIndex: localStorage.getItem("opponentIndex") || 0,
      finished: false,
      opponentHand: "",
      winner: ""
    };

    if (gameId) {
      this.continueGame();
    }
  }

  componentDidMount = async () => {
    await this.setState({ playerAddress: await this.props.nos.getAddress() });

    this.continueGame();
  };

  setOpponent = async opponent => {
    localStorage.setItem("opponent", opponent);
    await this.setState({ opponent });
  };

  setHand = async hand => {
    localStorage.setItem("hand", hand);
    await this.setState({ hand });
  };

  startGame = async () => {
    const salt = String(~~(Math.random() * 10000000) + 5000000);
    localStorage.setItem("salt", salt);

    const result = await this.props.nos.invoke(contractAddress, "StartPlay", [
      utils.unhex(this.state.playerAddress),
      utils.unhex(this.state.opponent),
      utils.unhex(utils.sha256(this.state.hand + salt))
    ]);
    // todo gameid
    const interval = setInterval(async () => {
      const gameId = "zzzzz";

      if (gameId) {
        clearInterval(interval);
        localStorage.setItem("inProgress", true);
        localStorage.setItem("gameId", gameId);

        this.setState({
          salt,
          inProgress: true,
          gameId
        });

        this.confirmHand();
      }
    }, 2000);
  };

  confirmHand = async () => {
    const gameKey = `game.${this.state.gameId}`;
    const player1AddressKey = `${gameKey}.player1`;

    const firstPlayerAddress = utils.unhex(
      await this.props.nos.GetStorage(contractAddress, player1AddressKey)
    );

    if (firstPlayerAddress === this.state.playerAddress) {
      await this.setState({
        opponentIndex: 2
      });
    } else {
      await this.setState({
        opponentIndex: 1
      });
    }

    localStorage.setItem("opponentIndex", this.state.opponentIndex);

    await this.waitOpponentHash();

    const answerResult = await this.props.nos.invoke(contractAddress, "Answer", [
      utils.unhex(this.state.playerAddress),
      utils.unhex(this.state.gameId),
      this.state.hand,
      this.state.salt
    ]);

    await this.setState({ handConfirmed: true });
    localStorage.setItem("handConfirmed", true);

    this.waitWinner();
  };

  waitOpponentHash = () =>
    new Promise(resolve => {
      const hashInterval = setInterval(async () => {
        const opponentHashKey = `game.${this.state.gameId}.answer_hash${this.state.opponentIndex}`;

        const opponentHash = await this.props.nos.GetStorage(contractAddress, opponentHashKey);

        if (opponentHash !== null) {
          clearInterval(hashInterval);
          resolve(true);
        }
      }, 2000);
    });

  waitWinner = () => {
    const gameKey = `game.${this.state.gameId}`;

    const interval = setInterval(async () => {
      const winnerKey = `${gameKey}.winner`;

      const winner = await this.props.nos.GetStorage(contractAddress, winnerKey);

      if (winner === null) {
        return;
      }
      clearInterval(interval);
      const opponentAnswer = await this.props.nos.GetStorage(
        contractAddress,
        `${gameKey}.answer${this.state.opponentIndex}`
      );

      this.setState({
        opponentHand: opponentAnswer,
        winner: this.getWinner(winner),
        finished: true
      });
    }, 2000);
  };

  getWinner = winner => {
    if (winner === this.state.playerAddress) {
      return "You win";
    }

    if (winner === "draw") {
      return "Draw";
    }

    return "You lose!!!";
  };

  continueGame = () => {
    if (this.state.gameId) {
      if (this.handConfirmed) {
        this.waitWinner();
      } else {
        this.confirmHand();
      }
    }
  };
  clearAll = () => {};
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
        <HandChoice
          disabled={this.state.opponent === "" || this.state.inProgress}
          hand={this.state.hand}
          chooseHand={this.setHand}
        />
        <ActionHands
          canStart={this.state.hand !== "" && this.state.opponent !== ""}
          inProgress={this.state.inProgress}
          gameId={this.state.gameId}
          startGame={this.startGame}
          finished={this.state.finished}
          playerHand={this.state.hand}
          opponentHand={this.state.opponentHand}
          winner={this.state.winner}
        />
        <button
          className={!this.state.finished ? classes.invisible : ""}
          disabled={!this.state.finished}
          onClick={this.clearAll()}
        >
          Restart
        </button>
      </div>
    );
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  nos: nosPropTypes.isRequired
};

export default injectNOS(injectSheet(styles)(App));
