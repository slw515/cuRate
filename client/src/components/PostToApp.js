import React, { useContext, useState, useEffect } from "react";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import gql from "graphql-tag";
import { UserContext } from "../contextComponents/auth";
import { useMutation } from "@apollo/react-hooks";
import ReactPaginate from "react-paginate";
import BottomBand from "./BottomBand";
import BottomBandSubmitGallery from "./BottomBandSubmitGallery";

import EditSelectedArtworks from "./EditSelectedArtworks";

function PostToApp() {
  const { user } = useContext(UserContext);
  const [postContent, setPostContent] = useState({
    username: user.username,
    body: "",
    id: null,
    createdAt: null
  });

  const [currentSelectedArt, addRemoveSelectedArt] = useState([]);
  const [onSearchPage, changeSearchingWorksOrEditing] = useState(true);
  const [galleryTitle, changeGalleryTitle] = useState("");
  const [galleryBody, changeGalleryBody] = useState("");

  const [queryParams, setQueryParams] = useState({
    technique: "",
    material: "",
    place: "",
    catalogueTitle: ""
  });

  const [hits, setHits] = useState([]);

  const [pageCount, setPageCount] = useState(1);

  const [isLoaded, setisLoaded] = useState(false);

  const [currentPage, setcurrentPage] = useState(0);

  const [department, setDepartment] = useState(0);
  const [query, setQuery] = useState(0);

  const URL = `https://www.rijksmuseum.nl/api/en/collection?key=NgATnvIb&ps=9&imgonly=true&p=${currentPage}&technique=${queryParams.technique}&material=${queryParams.material}&culture=${queryParams.place}`;

  const handleFetch = () => {
    console.log(URL);
    fetch(URL)
      .then(response => response.json())

      .then(body => {
        setHits([...body.artObjects]);
        setPageCount(Math.ceil(body.count / 20));
        setisLoaded(true);

        var checkboxes = document.getElementsByClassName("form-check-input");
        for (var i = 0; i < checkboxes.length; i++) {
          var isTrue = false;
          for (var x = 0; x < currentSelectedArt.length; x++) {
            if (currentSelectedArt[x].title == checkboxes[i].value) {
              isTrue = true;
              break;
            }
          }
          if (isTrue) {
            checkboxes[i].checked = true;
          } else {
            checkboxes[i].checked = false;
          }
        }
      })

      .catch(error => console.error("Error", error));
  };
  useEffect(() => {
    handleFetch();
  }, [currentPage]);

  const changeGalleryTitleFunc = e => {
    changeGalleryTitle(e.target.value);
  };

  const changeGalleryBodyFunc = e => {
    changeGalleryBody(e.target.value);
  };

  const changeUserDescription = (title, e) => {
    var objIndex = currentSelectedArt.findIndex(
      artwork => artwork.title == title
    );
    console.log(objIndex);
    console.log(e.target.value);
    var newEntry = currentSelectedArt[objIndex];
    newEntry.userDescription = e.target.value;
    addRemoveSelectedArt([
      ...currentSelectedArt.slice(0, objIndex),
      newEntry,
      ...currentSelectedArt.slice(objIndex + 1)
    ]);
  };

  const handlePageChange = selectedObject => {
    setcurrentPage(selectedObject.selected);
  };

  const inputChange = event => {
    setPostContent({ ...postContent, [event.target.name]: event.target.value });
  };
  const changeQueryParams = event => {
    setQueryParams({ ...queryParams, [event.target.name]: event.target.value });
  };
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: {
      body: galleryBody,
      title: galleryTitle,
      gallery: currentSelectedArt
    },
    // update(proxy, result) {
    //   const data = proxy.readQuery({
    //     query: RETRIEVE_POSTS_QUERY
    //   });
    //   console.log(result.data);
    //   proxy.writeQuery({
    //     query: RETRIEVE_POSTS_QUERY,
    //     data: {
    //       getPosts: [result.data.createPost, ...data.getPosts]
    //     }
    //   });

    //   postContent.body = "";
    // },
    onError(err) {
      return err;
    }
  });

  const createPostFunc = event => {
    event.preventDefault();
    createPost();
    console.log("hellooo");
  };

  const queryRijksMuseum = event => {
    event.preventDefault();
    handleFetch();
  };

  const modifySelectedArt = event => {
    if (event.currentTarget.checked) {
      const artworkObject = hits.find(
        artwork => artwork.title == event.target.value
      );
      console.log(event.target.value);
      addRemoveSelectedArt([
        ...currentSelectedArt,
        {
          title: event.target.value,
          image: artworkObject.webImage.url,
          id: artworkObject.id,
          userDescription: "",
          artist: artworkObject.principalOrFirstMaker
        }
      ]);
    } else {
      addRemoveSelectedArt(
        currentSelectedArt.filter(post => post.title != event.target.value)
      );
    }
  };

  const deleteSelectedArtworkCard = artworkId => {
    if (onSearchPage) {
      for (var i = 0; i < hits.length; i++) {
        if (hits[i].title == artworkId) {
          document.getElementById(hits[i].id).checked = false;
          break;
        }
      }
    }

    addRemoveSelectedArt(
      currentSelectedArt.filter(post => post.title != artworkId)
    );
    if (onSearchPage == false && hits.length == 0) {
      changeSearchingWorksOrEditing(true);
    }
  };

  const changeStateToEditing = () => {
    changeSearchingWorksOrEditing(!onSearchPage);
    handleFetch();
  };

  return (
    <>
      {onSearchPage ? (
        <>
          <Form style={{ marginBottom: "20px" }} onSubmit={queryRijksMuseum}>
            <Row style={{ marginBottom: "6px" }}>
              <Col>
                <Form.Control
                  placeholder="Technique"
                  name="technique"
                  value={queryParams.technique}
                  onChange={changeQueryParams}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Material"
                  name="material"
                  value={queryParams.material}
                  onChange={changeQueryParams}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control
                  placeholder="Place"
                  name="place"
                  value={queryParams.place}
                  onChange={changeQueryParams}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Catalogue Title"
                  name="catalogueTitle"
                  value={queryParams.catalogueTitle}
                  onChange={changeQueryParams}
                />
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Search Collection
            </Button>
          </Form>
          <Container className="createGalleryContainer">
            <Row>
              {isLoaded ? (
                hits.map(item => {
                  return (
                    <div className="col-md-4">
                      <Card className="artworkCard">
                        <>
                          <Form.Check
                            id={item.id}
                            value={item.title}
                            onChange={modifySelectedArt}
                          />
                        </>
                        <Card.Img variant="top" src={item.webImage.url} />
                        <Card.Body>
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text>
                            Some quick example text to build on the card title
                            and make up the bulk of the card's content.
                          </Card.Text>
                          <a href={item.links.web} target="_blank">
                            <Button variant="primary">Learn More</Button>
                          </a>
                        </Card.Body>
                      </Card>
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
            </Row>
          </Container>
          {isLoaded ? (
            <div className="paginationBottomWrapper">
              <ReactPaginate
                pageCount={pageCount}
                pageRange={2}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                previousLinkClassName={"page"}
                containerClassName={"paginationCreateGallery"}
                breakClassName={"break-me"}
                nextLinkClassName={"page"}
                pageClassName={"page"}
                disabledClassNae={"disabled"}
                activeClassName={"active"}
              />
            </div>
          ) : (
            <div>Nothing to display</div>
          )}
          <BottomBand
            artworks={currentSelectedArt}
            deleteSelectedArtworkCard={deleteSelectedArtworkCard}
            changeStateToEditing={changeStateToEditing}
            onSearchPage={onSearchPage}
          ></BottomBand>{" "}
        </>
      ) : (
        <>
          <EditSelectedArtworks
            artworks={currentSelectedArt}
            deleteSelectedArtworkCard={deleteSelectedArtworkCard}
            changeUserDescription={changeUserDescription}
            changeGalleryBodyFunc={changeGalleryBodyFunc}
            changeGalleryTitleFunc={changeGalleryTitleFunc}
            userTitle={galleryTitle}
            userBody={galleryBody}
          ></EditSelectedArtworks>
          <BottomBandSubmitGallery
            changeStateToEditing={changeStateToEditing}
            onSearchPage={onSearchPage}
            createPost={createPostFunc}
          ></BottomBandSubmitGallery>
        </>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!, $title: String!, $gallery: [ArtWork!]!) {
    createPost(body: $body, title: $title, gallery: $gallery) {
      body
      id
      username
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
      gallery {
        id
        title
        userDescription
      }
    }
  }
`;

const RETRIEVE_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      username
      createdAt
      comments {
        body
        username
        createdAt
      }
      likes {
        username
        createdAt
      }
    }
  }
`;
export default PostToApp;

//  <Form noValidate onSubmit={createPostFunc}>
//   <h1>Create A Gallery</h1>
//   <button onClick={handleFetch}>Get Data</button>
//    <h5>{postContent.username}</h5>

//   <Form.Group className="mb-3" controlId="formBasicPassword">
//     <Form.Label>Post:</Form.Label>
//     <Form.Control
//       type="input"
//       placeholder="Your Post Here!"
//       name="body"
//       value={postContent.body}
//       onChange={inputChange}
//     />
//   </Form.Group>
//   <Button variant="primary" type="submit">
//     Post
//   </Button>
// </Form>
//  {error && (
//   <div className="ui error message">
//     <ul className="list">
//       <li>{error.graphQLErrors[0].message}</li>
//     </ul>
//   </div>
// )}
