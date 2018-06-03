import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import rockImg from "../../assets/rock.png";
import paperImg from "../../assets/paper.png";
import scissorsImg from "../../assets/scissors.png";

const styles = {
  actionBox: {
    paddingTop: "20px",
    display: "flex",
    "justify-content": "center",
    alignItems: "center"
  },
  button: {
    width: "130px",
    height: "35px"
  },
  playerHand: {
    transform: "scaleX(-1)"
  },
  "hand-placeholder": {
    display: "none"
  },
  "hand-placeholder-shake": {
    visibility: "hidden"
  },
  "hand-left-shake": {
    animation: "shake-left-a 2s linear both infinite"
    // transformOrigin: "100%"
  },
  "hand-right-shake": {
    animation: "shake-right-a 2s linear both infinite"
    // transformOrigin: "100%"
  }
};
class ActionHands extends React.Component {
  getHandImage = hand => {
    if (hand === "rock") {
      return rockImg;
    }

    if (hand === "scissors") {
      return scissorsImg;
    }

    if (hand === "paper") {
      return paperImg;
    }

    return rockImg;
  };

  handleGoClick = async e => {
    if (this.props.canStart && !this.props.inProgress && !this.props.finished) {
      this.props.startGame();
    } else {
      e.preventDefault();
    }
  };

  handsClasses = (shake, hand) => {
    const { classes } = this.props;
    const applied = [];

    if (shake && !this.props.finished) {
      applied.push(classes[`hand-${hand}-shake`]);
    }

    return applied.join(" ");
  };

  placeholderClass = shake => {
    const { classes } = this.props;
    const applied = [];

    if (shake) {
      applied.push(classes[`hand-placeholder-shake`]);
    } else {
      applied.push(classes[`hand-placeholder`]);
    }

    return applied.join(" ");
  };

  makeHandClass = hand => {
    if (this.props.inProgress && !this.props.finished) {
      return this.handsClasses(true, hand);
    }
    return this.handsClasses(false, hand);
  };

  makeHandImg = answer => {
    if (!this.props.finished) {
      return this.getHandImage("rock");
    }
    return this.getHandImage(answer);
  };

  render = () => {
    const { classes } = this.props;

    const leftHandClass = this.makeHandClass("left");
    const rightHandClass = this.makeHandClass("right");

    const leftHandImg = this.makeHandImg(this.props.playerHand);
    const rightHandImg = this.makeHandImg(this.props.opponentHand);

    return (
      <React.Fragment>
        <div>
          <div className={classes.actionBox}>
            <img
              className={`${leftHandClass} ${classes.playerHand}`}
              alt="Your hand"
              src={leftHandImg}
            />
            <img className={rightHandClass} alt="Opponents hand" src={rightHandImg} />
          </div>
        </div>
      </React.Fragment>
    );
  };
}

ActionHands.propTypes = {
  classes: PropTypes.object.isRequired,
  canStart: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired,
  startGame: PropTypes.func.isRequired,
  finished: PropTypes.bool.isRequired,
  playerHand: PropTypes.string.isRequired,
  opponentHand: PropTypes.string.isRequired
};

export default injectSheet(styles)(ActionHands);
