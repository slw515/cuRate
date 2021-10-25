/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import ReactPaginate from "react-paginate";
import BottomBand from "./BottomBand";
import BottomBandSubmitGallery from "./BottomBandSubmitGallery";
import EditSelectedArtworks from "./EditSelectedArtworks";
import loadingImage from "../images/loading.gif";
const { API_KEY } = require("../config.js");

function PostToApp(props) {
  const periods = [
    { id: "21st Century", value: "21" },
    { id: "20th Century", value: "20" },
    { id: "19th Century", value: "19" },
    { id: "18th Century", value: "18" },
    { id: "17th Century", value: "17" },
    { id: "16th Century", value: "16" },
    { id: "15th Century", value: "15" },
    { id: "14th Century", value: "14" },
    { id: "13th Century", value: "13" },
    { id: "12th Century", value: "12" },
    { id: "11th Century", value: "11" },
    { id: "10th Century", value: "10" },
    { id: "9th Century", value: "9" },
    { id: "8th Century", value: "8" },
    { id: "7th Century", value: "7" },
    { id: "6th Century", value: "6" },
    { id: "5th Century", value: "5" },
    { id: "4th Century", value: "4" },
    { id: "3rd Century", value: "3" },
    { id: "2nd Century", value: "2" },
    { id: "1st Century", value: "1" }
  ];

  const [currentSelectedArt, addRemoveSelectedArt] = useState([]);
  const [onSearchPage, changeSearchingWorksOrEditing] = useState(true);
  const [galleryTitle, changeGalleryTitle] = useState("");
  const [galleryBody, changeGalleryBody] = useState("");

  const [queryParams, setQueryParams] = useState({
    artist: "",

    period: ""
  });
  const [hits, setHits] = useState([]);

  const [pageCount, setPageCount] = useState(1);

  const [isLoaded, setisLoaded] = useState(false);

  const [currentPage, setcurrentPage] = useState(1);

  const URL = `https://www.rijksmuseum.nl/api/en/collection?key=${API_KEY}&ps=9&imgonly=True&p=${currentPage +
    1}&involvedMaker=${queryParams.artist}&f.dating.period=${
    queryParams.period
  }`;

  const handleFetch = () => {
    console.log(URL);
    setisLoaded(false);
    fetch(URL)
      .then(response => response.json())

      .then(body => {
        console.log("first");
        setHits([...body.artObjects]);
        // console.log(hits);
        setPageCount(() => {
          if (body.count > 10000) {
            //upper limit on page placed by Rijksmusum API
            return 1111;
          } else {
            return Math.ceil(body.count / 9);
          }
        });
        return true;
      })
      .then(() => {
        setisLoaded(true);

        console.log("seconds");
        var checkboxes = document.getElementsByClassName("form-check-input");
        for (var i = 0; i < checkboxes.length; i++) {
          var isTrue = false;
          for (var x = 0; x < currentSelectedArt.length; x++) {
            if (currentSelectedArt[x].title === checkboxes[i].value) {
              console.log(currentSelectedArt[x].title + " is true");
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

      // .then(() => {
      // })

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
      artwork => artwork.title === title
    );
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
  const changeQueryParams = event => {
    console.log(event.target);
    setQueryParams({ ...queryParams, [event.target.name]: event.target.value });
  };
  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: {
      body: galleryBody,
      title: galleryTitle,
      gallery: currentSelectedArt
    },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: RETRIEVE_POSTS_QUERY
      });
      console.log(result.data);
      proxy.writeQuery({
        query: RETRIEVE_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts]
        }
      });
      //   postContent.body = "";
    },
    onError(err) {
      return err;
    },
    onCompleted() {
      window.location.reload();
    }
  });

  const createPostFunc = event => {
    event.preventDefault();
    if (currentSelectedArt.length > 3) {
      createPost();
    }
  };

  const queryRijksMuseum = event => {
    event.preventDefault();
    handleFetch();
  };

  const modifySelectedArt = event => {
    if (event.currentTarget.checked) {
      const artworkObject = hits.find(
        artwork => artwork.title === event.target.value
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
        currentSelectedArt.filter(post => post.title !== event.target.value)
      );
    }
  };

  const deleteSelectedArtworkCard = artworkId => {
    if (onSearchPage) {
      for (var i = 0; i < hits.length; i++) {
        if (hits[i].title === artworkId) {
          document.getElementById(hits[i].id).checked = false;
          break;
        }
      }
    }

    addRemoveSelectedArt(
      currentSelectedArt.filter(post => post.title !== artworkId)
    );
    if (onSearchPage === false && hits.length === 0) {
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
                  placeholder="Artist"
                  name="artist"
                  value={queryParams.artist}
                  onChange={changeQueryParams}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: "6px" }}>
              <Col>
                <Form.Select
                  aria-label="Default select example"
                  onChange={changeQueryParams}
                  name="period"
                >
                  <option value="" disabled selected hidden>
                    Select A Period...
                  </option>
                  <option value="">All</option>
                  {periods.map(period => (
                    <option value={period.value}>{period.id}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row style={{ marginBottom: "6px" }}>
              <Col>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Search Collection
                </Button>
              </Col>
            </Row>
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
                        <Card.Img
                          variant="top"
                          src={item.webImage.url}
                          alt={item.title}
                        />
                        <Card.Body>
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text>{item.principalOrFirstMaker}</Card.Text>
                          <Card.Text>
                            <small className="text-muted">
                              {item.productionPlaces !== null ? (
                                item.productionPlaces[0]
                              ) : (
                                <></>
                              )}
                            </small>
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
                <div className="centerLoading">
                  <img src={loadingImage} alt="Loading..." />
                </div>
              )}
            </Row>
          </Container>
          {/* {isLoaded ? ( */}
          <div className="paginationBottomWrapper">
            <ReactPaginate
              pageCount={pageCount}
              pageRange={2}
              initialPage={0}
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
          {/* ) : (
            <div>Nothing to display</div>
          )} */}
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
            currentSelectedArt={currentSelectedArt}
            titleText={galleryTitle}
            bodyText={galleryBody}
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
      title
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
      gallery {
        artist
        id
        image
        title
        userDescription
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
