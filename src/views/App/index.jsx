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
    this.state = this.getInitialState();
    this.pingInterval = null;
  }

  getInitialState = () => {
    const gameId = localStorage.getItem("gameId") || "";
    const opponent = localStorage.getItem("opponent") || "";

    return {
      playerAddress: "",
      opponent,
      hand: localStorage.getItem("hand") || "",
      salt: localStorage.getItem("salt") || "",
      handConfirmed: localStorage.getItem("handConfirmed") || "",
      gameId,
      inProgress: !!gameId,
      opponentIndex: localStorage.getItem("opponentIndex") || 0,
      finished: false,
      playerHand: localStorage.getItem("playerHand") || "",
      opponentHand: "",
      winner: "",
      gameStatus: "",
      opponentOffline: true
    };
  };

  componentDidMount = async () => {
    try {
      const playerAddress = await this.props.nos.getAddress();

      await this.setState({
        playerAddress,
        opponentOffline: !await this.isOpponentOnline(this.state.opponent)
      });
    } catch (e) {
      return;
    }

    this.pingServer();
    this.continueGame();
  };

  pingServer = async () => {
    await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ command: "ping", data: { address: this.state.playerAddress } })
    });

    this.pingTimeout = setTimeout(this.pingServer.bind(this), 60 * 1000);
  };

  setGameStatus = () => {
    let gameStatus = "Enter opponent's NEO address";

    if (this.state.opponent.length) {
      gameStatus = "Choose your hand";

      if (this.state.opponentOffline) {
        gameStatus = "Opponent offline";
      }
    }

    if (this.state.hand) {
      gameStatus = "Starting the game";

      if (this.state.inProgress) {
        gameStatus = "Game in progress, please wait";
      }
    }

    if (this.state.winner) {
      gameStatus = this.state.winner;
    }

    return this.setState({ gameStatus });
  };

  isOpponentOnline = async opponent => {
    try {
      const response = await (await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ command: "checkAddress", data: { address: opponent } })
      })).json();
      return response.status === 0 && response.message === true;
    } catch (e) {
      return false;
    }
  };

  setOpponent = async opponent => {
    localStorage.setItem("opponent", opponent);
    await this.setState({ opponent, opponentOffline: !await this.isOpponentOnline(opponent) });

    this.setGameStatus();
  };

  setHand = async hand => {
    localStorage.setItem("hand", hand);
    localStorage.setItem("playerHand", hand);

    await this.setState({ hand, playerHand: hand });
    this.startGame();
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
      this.setState({ hand: "", gameStatus: "Can not start the game" });
      localStorage.setItem("hand", "");

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
  getGameKey = () => `game.${this.state.gameId}`;

  confirmHand = async () => {
    const winner = await this.getWinner();

    if (!winner) {
      await this.waitOpponentHash();
      await new Promise(resolve => setTimeout(resolve, 45 * 1000));

      try {
        await this.props.nos.invoke(contractAddress, "Answer", [
          utils.neoAddressDecode(this.state.playerAddress),
          this.state.gameId,
          this.state.hand,
          this.state.salt
        ]);
      } catch (e) {
        this.continueGame();
        return;
      }
    }

    await this.setState({ handConfirmed: true });

    localStorage.setItem("handConfirmed", true);

    this.waitWinner();
  };

  getOpponentIndex = async () => {
    let opponentIndex = localStorage.getItem("opponentIndex");

    if (!opponentIndex) {
      opponentIndex = await this.fetchOpponentIndex();
    }

    return opponentIndex;
  };

  fetchOpponentIndex = async () => {
    const player1AddressKey = `${this.getGameKey()}.player1`;
    const firstPlayerAddress = utils.unhex(
      await this.props.nos.getStorage(contractAddress, player1AddressKey)
    );

    const opponentIndex =
      firstPlayerAddress === utils.neoAddressDecode(this.state.playerAddress) ? 2 : 1;

    await this.setState({ opponentIndex });
    localStorage.setItem("opponentIndex", opponentIndex);

    return opponentIndex;
  };

  waitOpponentHash = async () => {
    const opponentIndex = await this.getOpponentIndex();

    return new Promise(async resolve => {
      const hashInterval = setInterval(async () => {
        const opponentHashKey = `game.${this.state.gameId}.answer_hash${opponentIndex}`;

        const opponentHash = await this.props.nos.getStorage(contractAddress, opponentHashKey);

        if (opponentHash !== null) {
          clearInterval(hashInterval);
          resolve(true);
        }
      }, 2000);
    });
  };
  waitWinner = () => {
    const interval = setInterval(async () => {
      const winner = await this.getWinner();

      if (winner === "") {
        return;
      }

      const opponentAnswer = utils.unhex(
        await this.props.nos.getStorage(
          contractAddress,
          `${this.getGameKey()}.answer${this.state.opponentIndex}`
        )
      );

      if (opponentAnswer === "") {
        return;
      }

      clearInterval(interval);

      await this.setState({
        opponentHand: answersMap[opponentAnswer] || "DQ",
        hand: "",
        winner: this.getEndgameStatus(winner),
        finished: true
      });

      this.setGameStatus();

      localStorage.removeItem("gameId");
    }, 2000);
  };

  getWinner = async () =>
    utils.unhex(await this.props.nos.getStorage(contractAddress, `${this.getGameKey()}.winner`));

  getEndgameStatus = winner => {
    if (winner === utils.neoAddressDecode(this.state.playerAddress)) {
      return "You win";
    }

    if (winner === "draw") {
      return "Draw";
    }

    return "You lose!!!";
  };

  continueGame = () => {
    this.setGameStatus();

    if (this.state.gameId) {
      if (this.handConfirmed) {
        this.waitWinner();
      } else {
        this.confirmHand();
      }
    }
  };

  clearAll = async () => {
    localStorage.clear();
    await this.setState(this.getInitialState());
    return this.componentDidMount();
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
          disabled={
            this.state.opponent === "" || this.state.inProgress || this.state.opponentOffline
          }
          hand={this.state.hand}
          chooseHand={this.setHand}
          finished={this.state.finished}
          clear={this.clearAll}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div>{this.state.gameStatus}</div>
        </div>
        <ActionHands
          canStart={this.state.hand !== "" && this.state.opponent !== ""}
          inProgress={this.state.inProgress}
          gameId={this.state.gameId}
          startGame={this.startGame}
          finished={this.state.finished}
          playerHand={this.state.playerHand}
          opponentHand={this.state.opponentHand}
          winner={this.state.winner}
        />
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
