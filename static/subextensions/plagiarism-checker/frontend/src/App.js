import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Badge, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";

function App() {
  const [checked, setChecked] = useState(false);
  const [uniquePercent, setUniquePercent] = useState(0);
  return (
    <>
      <script>{window.addEventListener("message", e => {
          if(e.data.percent) {
            setUniquePercent(e.data.percent);
            setChecked(true);
            document.getElementById("textError").hidden = true;
            document.getElementById("textError").innerText = "";
          }
          else if(e.data.error) {
            setChecked(false);
            document.getElementById("textError").hidden = false;
            document.getElementById("textError").innerText = "An error occurred!";
          }
          document.getElementById("submitBtn").disabled = false;
          document.getElementById("submitBtnLoading").hidden = true;
        })}
      </script>
      <Container fluid="md">
        <Row>
          <Col style={{margin: "20px"}}><h1>Plagiarism Checker</h1></Col>
        </Row>
        <Row>
          <Form method="POST" id="form">
            <Col style={{margin: "20px"}}>
              <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" name="text" placeholder="Enter your text here" style={{height: "100px", backgroundColor: "#222", color: "#eee"}} />
                <Form.Text style={{color: "red"}} id="textError" hidden>abc</Form.Text>
              </Form.Group>
            </Col>
            <Col style={{margin: "20px"}}>
              <Form.Group>
                <Button type="submit" variant="outline-primary" id="submitBtn">Check plagiarism<Spinner id="submitBtnLoading" animation="border" variant="primary" size="sm" hidden /></Button>
              </Form.Group>
            </Col>
          </Form>
        </Row>
        {checked
        ? <Row className="text-center">
            <Col style={{margin: "20px"}} xs lg="3.5"></Col>
            <Col style={{margin: "20px"}} xs lg="3.5">
              <Row>
                <Col>Plagiarised</Col>
                <Col>Unique</Col>
              </Row>
              <Row>
                <Col><Badge bg="danger">{100 - uniquePercent}%</Badge></Col>
                <Col><Badge bg="success">{uniquePercent}%</Badge></Col>
              </Row>
            </Col>
            <Col style={{margin: "20px"}} xs lg="3.5"></Col>
          </Row>
          : <>
            </>
        }
      </Container>
    </>
  );
}

export default App;
