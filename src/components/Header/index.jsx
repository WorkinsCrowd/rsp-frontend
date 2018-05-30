import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import Modal from "react-modal";

import SpinningLogo from "./../SpinningLogo";

const styles = {
  title: {
    "text-transform": "capitalize",
    "font-size": "3em"
  },
  header: {
    padding: "24px",
    marginBottom: "32px"
  },
  headerBox: {
    "text-align": "center"
  }
};

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal () {}

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render = () => {
    const classes = this.props.classes;

    return (
      <header className={classes.header}>
        <div>
          <button onClick={this.openModal}>Rules and conception</button>
        </div>
        <div>
          <SpinningLogo />
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
        >
          <h2>Rules</h2>
          <p>Classic rock-scissors-paper game</p>
        </Modal>
      </header>
    );
  };
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default injectSheet(styles)(Header);
