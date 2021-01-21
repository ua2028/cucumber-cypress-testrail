import React from "react";
import { MDBDataTable } from "mdbreact";

class AssetsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    fetch("/getAssets")
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          items: result,
        });
      });
  }
  render() {
    const { isLoaded, items } = this.state;

    let rows = [];
    console.log(items);
    items.map((item) => rows.push({ name: item }));
    const data = {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150,
        },
      ],
      rows: rows,
    };

    return (<div>{isLoaded ? <MDBDataTable striped bordered hover data={data} /> : <div class="d-flex justify-content-center spinner"><div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div> </div> }</div>);
  }
}

export default AssetsTable;
