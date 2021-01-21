import React from "react";

import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdbreact";

class AddAssetForm extends React.Component {
  state = {
    name: "",
    modalFailed: false,
    modalSuccess: false,
  };

  submitHandler = (event) => {
    event.preventDefault();
    event.target.className += " was-validated";

    fetch("/addAsset/" + this.state.name, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      method: "POST",
    }).then((res) => {
      if (res.status === 201) {
        this.toggleSuccess();
      }

      if (res.status === 409) {
        this.toggleFailed();
      }

      if (res.status === 400) {
        console.error("Unexpected error " + res);
      }
    });
  };

  changeHandler = (event) => {
    this.setState({ name: event.target.value });
  };

  toggleFailed = () => {
    this.setState({ modalFailed: !this.state.modalFailed });
  };

  toggleSuccess = () => {
    this.setState({ modalSuccess: !this.state.modalSuccess });
  };

  render() {
    return (
      <MDBContainer>
        <form className="needs-validation" onSubmit={this.submitHandler}>
          <MDBRow>
            <MDBCol md="4" className="mb-3">
              <label htmlFor="defaultFormAddAsset" className="grey-text">
                New Asset
              </label>
              <input
                value={this.state.name}
                required
                placeholder="ISIN0000000045"
                type="text"
                id="defaultFormAddAsset"
                className="form-control"
                onChange={this.changeHandler}
                testid="asset-name"
                pattern="[A-Z]{4}[0-9]{10}"
              />
              <div className="invalid-feedback">Incorrect format</div>
              <div className="valid-feedback">Correct format</div>
            </MDBCol>
            <MDBCol md="4" className="mb-3">
              <br />
              <MDBBtn color="warning" outline type="submit">
                Send
                <MDBIcon far icon="paper-plane" className="ml-2" />
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
        <MDBModal
          isOpen={this.state.modalFailed}
          toggle={this.toggleFailed}
          centered
        >
          <MDBModalHeader toggle={this.toggleFailed}>
            Asset alredy exist
          </MDBModalHeader>
          <MDBModalBody>
            Asset name should be unique. Assert with this name already exists
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="warning" onClick={this.toggleFailed}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
        <MDBModal
          isOpen={this.state.modalSuccess}
          toggle={this.toggleSuccess}
          centered
        >
          <MDBModalHeader toggle={this.toggleSuccess}>Sucssess</MDBModalHeader>
          <MDBModalBody>
            Asset {this.state.name} was added to the list
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="warning" onClick={this.toggleSuccess}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>
    );
  }
}

export default AddAssetForm;
