import React, { useContext, useState, useEffect } from "react";
import { Form, Button, Card, Col, Container, Row } from "react-bootstrap";
import gql from "graphql-tag";
import { UserContext } from "../contextComponents/auth";
import { useMutation } from "@apollo/react-hooks";
import ReactPaginate from "react-paginate";

function PostToApp() {
  const { user } = useContext(UserContext);
  const [postContent, setPostContent] = useState({
    username: user.username,
    body: "",
    id: null,
    createdAt: null
  });

  const [currentSelectedArt, addRemoveSelectedArt] = useState([]);

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

  const URL = `https://www.rijksmuseum.nl/api/en/collection?key=NgATnvIb&ps=16&imgonly=true&p=${currentPage}&technique=${queryParams.technique}&material=${queryParams.material}&culture=${queryParams.place}`;

  const handleFetch = () => {
    fetch(URL)
      .then(response => response.json())

      .then(body => {
        setHits([...body.artObjects]);
        console.log(hits);

        setPageCount(Math.ceil(body.count / 20));
        setisLoaded(true);
        console.log(URL);
      })

      .catch(error => console.error("Error", error));
  };

  const handlePageChange = selectedObject => {
    setcurrentPage(selectedObject.selected);
    console.log(selectedObject);
    handleFetch();
  };

  const inputChange = event => {
    setPostContent({ ...postContent, [event.target.name]: event.target.value });
  };
  const changeQueryParams = event => {
    setQueryParams({ ...queryParams, [event.target.name]: event.target.value });
  };
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: postContent,
    update(proxy, result) {
      console.log(postContent);
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

      postContent.body = "";
    },
    onError(err) {
      return err;
    }
  });

  const createPostFunc = event => {
    event.preventDefault();
    createPost();
  };

  const queryRijksMuseum = event => {
    event.preventDefault();
    handleFetch();
  };

  const modifySelectedArt = event => {
    if (event.currentTarget.checked) {
      addRemoveSelectedArt([...currentSelectedArt, { id: event.target.value }]);
    } else {
      addRemoveSelectedArt(
        currentSelectedArt.filter(post => post.id != event.target.value)
      );
    }
  };

  return (
    <div>
      {/* <label>Search</label>

      <input type="text" onChange={event => setQuery(event.target.value)} /> */}

      {/* <Form.Select
        size="lg"
        onChange={event => setDepartment(event.target.value)}
      >
        {departments.map(department => (
          <option value={department.departmentId}>
            {department.displayName}
          </option>
        ))}
      </Form.Select> */}

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
          Login
        </Button>
      </Form>

      {/* <button onClick={handleFetch}>Get Data</button> */}
      <Container>
        <Row>
          {isLoaded ? (
            hits.map(item => {
              return (
                <div className="col-md-4">
                  <Card>
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
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                      </Card.Text>
                      <Button variant="primary">Go somewhere</Button>
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
        <ReactPaginate
          pageCount={pageCount}
          pageRange={2}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          previousLinkClassName={"page"}
          breakClassName={"break-me"}
          nextLinkClassName={"page"}
          pageClassName={"page"}
          disabledClassNae={"disabled"}
          activeClassName={"active"}
        />
      ) : (
        <div>Nothing to display</div>
      )}
    </div>
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
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
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
