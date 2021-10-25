import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { Form, Container, Row } from "react-bootstrap";

function EditSelectedArtworks({
  artworks,
  deleteSelectedArtworkCard,
  changeUserDescription,
  changeGalleryBodyFunc,
  changeGalleryTitleFunc,
  userTitle,
  userBody
}) {
  return (
    <Container className="editGalleryContainer">
      {" "}
      <Row>
        <h1>Gallery Title</h1>
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Control
              type="text"
              size="lg"
              value={userTitle}
              placeholder="Please Input Your Gallery Title Here..."
              onChange={e => changeGalleryTitleFunc(e)}
            />
          </Form.Group>
        </Form>
        <h1 style={{ marginTop: "40px" }}>Gallery Rationale</h1>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              size="md"
              rows={12}
              placeholder="Please Input Your Gallery Rationale Here..."
              value={userBody}
              onChange={e => changeGalleryBodyFunc(e)}
            />
          </Form.Group>
        </Form>
        <h1 style={{ margin: "40px auto" }}>Current Artworks</h1>

        {artworks.map(art => (
          <div className="col-md-4">
            <div className="editPageCard">
              <Button
                icon
                color="red"
                onClick={() => deleteSelectedArtworkCard(art.title)}
              >
                <Icon name="delete" />
              </Button>
              <img src={art.image} alt={art.title} />
              <p style={{ marginTop: "10px" }}>{art.title}</p>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Please write a few sentences about the work..."
                    value={art.userDescription}
                    onChange={e => {
                      changeUserDescription(art.title, e);
                    }}
                  />
                </Form.Group>
              </Form>
            </div>
          </div>
        ))}
      </Row>
    </Container>
  );
}

export default EditSelectedArtworks;
