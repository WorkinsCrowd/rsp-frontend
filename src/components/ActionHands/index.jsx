import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import rockImg from "../../assets/rock.png";
import paperImg from "../../assets/paper.jpg";
import scissorsImg from "../../assets/scissors.jpg";

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
  constructor(props) {
    super(props);

    this.state = {
      leftHandClass: this.handsClasses(false, "left"),
      placeholderClass: this.placeholderClass(false),
      rightHandClass: this.handsClasses(false, "right"),
      leftHand: rockImg,
      rightHand: rockImg
    };
  }

  componentDidMount = async () => {};

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

  handleGoClick = async e => {
    if (this.props.canStart && !this.props.inProgress && !this.props.finished) {
      await this.setState({
        leftHandClass: this.handsClasses(true, "left"),
        rightHandClass: this.handsClasses(true, "right")
      });

      this.props.startGame();
    } else {
      e.preventDefault();
    }
  };

  componentWillReceiveProps = newProps => {
    if (newProps.opponentHand) {
      this.setState({
        leftHand: this.getHandImage(newProps.playerHand),
        rightHand: this.getHandImage(newProps.opponentHand)
      });
    }
  };

  getHandImage = hand => {
    if (hand === "rock") {
      return rockImg;
    }

    if (hand === "scissors") {
      return scissorsImg;
    }

    if (hand !== "paper") {
    } else {
      return paperImg;
    }

    return rockImg;
  };

  render = () => {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div>
          <div className={classes.actionBox}>
            <img
              className={`${this.state.leftHandClass} ${classes.playerHand}`}
              alt="Your hand"
              src={this.state.leftHand}
            />
            <button className={classes.button} onClick={this.handleGoClick}>
              {this.props.canStart && !this.props.inProgress
                ? "GO"
                : this.props.inProgress
                  ? "Waiting opponent"
                  : "Choose opponent and hand!"}
            </button>
            <img
              className={this.state.rightHandClass}
              alt="Opponents hand"
              src={this.state.rightHand}
            />
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
