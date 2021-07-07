import React, { Component } from "react";
import { Table, Container, Button, Navbar, Form, Col } from "react-bootstrap";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      dataPost: {
        id: 0,
        nama_karyawan: " ",
        jabatan: " ",
        jenis_kelamin: " ",
        tanggal_lahir: ""
      },
      valueOption: "select",
      edit: false
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.InputChange = this.InputChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
    this.getDataId = this.getDataId.bind(this);
  }

  reloadData() {
    axios.get("http://localhost:3000/data-karyawan").then(
      res => {
        this.setState({
          dataApi: res.data
        });
      }
    );
  }

  InputChange(e) {
    // console.log(e.target.value)
    let newDataPost = { ...this.state.dataPost }

    if (this.state.edit === false) {
      newDataPost['id'] = new Date().getTime();
    }
    newDataPost[e.target.name] = e.target.value;

    this.setState({
      dataPost: newDataPost
    },
      () => console.log(this.state.dataPost)
    );
  }

  OnSubmit() {
    if (this.state.edit === false) {
      axios
        .post("http://localhost:3000/data-karyawan", this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        });
    } else {
      axios
        .put(`http://localhost:3000/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        });
    }
  }

  clearData() {
    let newDataPost = { ...this.state.dataPost };
    newDataPost['id'] = "";
    newDataPost['nama_karyawan'] = "";
    newDataPost['jabatan'] = "";
    newDataPost['jenis_kelamin'] = "";
    newDataPost['tanggal_lahir'] = "";

    this.setState({
      dataPost: newDataPost
    });
  }

  getDataId(e) {
    axios
      .get(`http://localhost:3000/data-karyawan/${e.target.value}`)
      .then(
        res => {
          this.setState({
            dataPost: res.data,
            edit: true
          })
        });
  }

  handleRemove(e) {
    // console.log(e.target.value)
    fetch(`http://localhost:3000/data-karyawan/${e.target.value}`, { method: "DELETE" }).then(res => this.reloadData())
  }

  componentDidMount() {
    this.reloadData();
  }


  render() {
    return (
      <div>
        <Container>
          <Navbar bg="light" className="mb-3">
            <Navbar.Brand href="#home">TryAPI</Navbar.Brand>
          </Navbar>

          <Form className="mb-3">
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nama</Form.Label>
                <Form.Control name="nama_karyawan" type="text" placeholder="Masukan nama lengkap" value={this.state.dataPost.nama_karyawan} onChange={this.InputChange} />
              </Form.Group>

              <Form.Group controlId="ControlSelect1">
                <Form.Label>Jenis Kelamin</Form.Label>
                <Form.Control name="jenis_kelamin" as="select" onChange={this.InputChange} value={this.state.valueOption}>
                  <option>pilih jenis kelamin</option>
                  <option value="laki-laki" >Laki-laki</option>
                  <option value="perempuan ">Perempuan</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridTitle">
              <Form.Label>Jabatan</Form.Label>
              <Form.Control name="jabatan" placeholder="masukan jabatan" onChange={this.InputChange} value={this.state.dataPost.jabatan} />
            </Form.Group>

            <Form.Group controlId="formGridDate">
              <Form.Label>Tanggal lahir</Form.Label>
              <Form.Control type="date" name="tanggal_lahir" placeholder="masukan tanggal lahir" onChange={this.InputChange} value={this.state.dataPost.tanggal_lahir} />
            </Form.Group>

            <Button onClick={this.OnSubmit} variant="primary" type="submit">
              Submit
            </Button>
          </Form>

          <Table striped bordered hover size="sm">
            <thead className="text-center">
              <tr>
                <th>#</th>
                <th>Nama Karyawan</th>
                <th>Jabatan</th>
                <th>Jenis Kelamin</th>
                <th>Tanggal Lahir</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {this.state.dataApi.map((dt, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{dt.nama_karyawan}</td>
                    <td>{dt.jabatan}</td>
                    <td>{dt.jenis_kelamin}</td>
                    <td>{dt.tanggal_lahir}</td>
                    <td>
                      <Button variant="primary" value={dt.id} onClick={this.getDataId}>Ubah</Button>{' '}
                      <Button variant="danger" value={dt.id} onClick={this.handleRemove}>Hapus</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default App;
