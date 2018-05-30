import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { nosPropTypes } from "@nosplatform/api-functions/es6";

import Header from "./../../components/Header";
import HandChoice from "./../../components/HandChoice";
import OpponentChoice from "./../../components/OpponentChoice";
import ActionHands from "./../../components/ActionHands";
import Footer from "./../../components/Footer";
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

const answersMap = {
  "\x01": "rock",
  "\x02": "scissors",
  "\x03": "paper"
};

const contractAddress = "18bac4e5c9ae191dd09bbe5f2262060524fcfff0";

class App extends React.Component {
  constructor(props) {
    super(props);
    const gameId = localStorage.getItem("gameId") || "";
    const opponent = localStorage.getItem("opponent") || ""

    this.state = {
      playerAddress: "",
      opponent,
      hand: localStorage.getItem("hand") || "",
      salt: localStorage.getItem("salt") || "",
      handConfirmed: localStorage.getItem("handConfirmed") || "",
      gameId,
      inProgress: !!gameId,
      opponentIndex: localStorage.getItem("opponentIndex") || 0,
      finished: false,
      opponentHand: "",
      winner: "",
      gameStatus: ""
    };

  }


  componentDidMount = async () => {
    await this.setState({ playerAddress: await this.props.nos.getAddress() });
    await this.setGameStatus()

    this.continueGame();
  };

  setGameStatus = () => {
    let gameStatus = "Enter opponent's NEO address"

    if (this.state.opponent.length) {
      gameStatus = "Choose your hand"
    }

    if (this.state.hand) {
      gameStatus = "Game in progress, please wait"
    }

    return this.setState(gameStatus)
  };


  setOpponent = async opponent => {
    localStorage.setItem("opponent", opponent);
    await this.setState({ opponent, gameStatus: "Choose your hand" });
  };

  setHand = async hand => {
    localStorage.setItem("hand", hand);
    await this.setState({ hand });
  };

  getGameId = async () => {
    const currentGameKey = `${utils.neoAddressDecode(
      this.state.playerAddress
    )}.${utils.neoAddressDecode(this.state.opponent)}`;
    return utils.unhex(await this.props.nos.getStorage(contractAddress, currentGameKey));
  };

  startGame = async () => {
    const salt = String(~~(Math.random() * 10000000) + 5000000);

    localStorage.setItem("salt", salt);

    try {
      await this.props.nos.invoke(contractAddress, "StartPlay", [
        utils.neoAddressDecode(this.state.playerAddress),
        utils.neoAddressDecode(this.state.opponent),
        utils.unhex(utils.sha256(this.state.hand + salt))
      ]);
    } catch (e) {
      return;
    }

    const interval = setInterval(async () => {
      const gameId = await this.getGameId();

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
      await this.props.nos.getStorage(contractAddress, player1AddressKey)
    );

    if (firstPlayerAddress === utils.neoAddressDecode(this.state.playerAddress)) {
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

    await new Promise(resolve => setTimeout(resolve, 45 * 1000));

    await this.props.nos.invoke(contractAddress, "Answer", [
      utils.neoAddressDecode(this.state.playerAddress),
      this.state.gameId,
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

        const opponentHash = await this.props.nos.getStorage(contractAddress, opponentHashKey);

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

      const winner = utils.unhex(await this.props.nos.getStorage(contractAddress, winnerKey));

      if (winner === "") {
        return;
      }
      const opponentAnswer = utils.unhex(
        await this.props.nos.getStorage(
          contractAddress,
          `${gameKey}.answer${this.state.opponentIndex}`
        )
      );

      if (opponentAnswer === "") {
        return;
      }

      clearInterval(interval);

      this.setState({
        opponentHand: answersMap[opponentAnswer] || "DQ",
        winner: this.getWinner(winner),
        finished: true
      });

      localStorage.removeItem("gameId");
    }, 2000);
  };

  getWinner = winner => {
    if (winner === utils.neoAddressDecode(this.state.playerAddress)) {
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
  clearAll = () => {
    localStorage.clear();
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
          changeOpponentEnabled={!this.state.inProgress}
        />
        <HandChoice
          disabled={this.state.opponent === "" || this.state.inProgress}
          hand={this.state.hand}
          chooseHand={this.setHand}
        />
        <div>{this.state.gameStatus}</div>
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
          onClick={this.clearAll}
        >
          Restart
        </button>
        <Footer />
      </div>
    );
  };
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  nos: nosPropTypes.isRequired
};

export default injectNOS(injectSheet(styles)(App));
