import React from "react";
import { Container } from "react-bootstrap";

export default function About() {
  return (
    <Container style={{ marginTop: "3rem" }}>
      <h1>About CuRate</h1>
      <p>
        CuRate is an online platform for the creation and sharing of
        user-created galleries using the API of the Rijksmuseum in Amsterdam.
        This web application was developed using React, Node, GraphQL and
        MongoDB. The application allows users to create galleries by selecting
        artworks from the Rijksmuseum archive, adding a title of the gallery,
        adding rationale for the curatorial decisions they made and optionally
        writing a brief description of why they chose each individual piece. The
        purpose of this platform is to promote discussions about art and reduce
        barriers to viewing, enjoying and understanding art. Though CuRate is a
        simple application, I intend for this application to make people think
        about how confident they are in understanding art for themselves with
        little external opinion, how connections are made between works of art,
        and the role of art and history in informing their view of the present.
        Hopefully, people will use this application in tandem with external
        research to fully develop their ideas of art and the role it should play
        in our understanding of the past, present and future. <br></br>
        <br></br>The landing page of the application is the Galleries page,
        where users can view all the galleries that have been created on CuRate.
        Users can visit the My Galleries and Create Gallery pages if they are
        logged in to the site. If users attempt to visit these pages without
        being logged in, they will be greeted with a prompt to either login or
        register. On the Create Gallery page, users must select a minimum of
        four artworks in order to create a gallery. They are able to query the
        Rijksmuseum API by century and by artist name. This was an intentional
        decision as I found the other query parameters that the API offered were
        not intuitive to most users (ex. Material, style). Users are able to
        explore with pagination of the results being supported by the site.
        Users check a box in the top left corner of each card in order to
        select/unselect an artwork and are also shown a tab fixed to the bottom
        of the screen that displays the currently selected artworks. In this
        tab, users can also remove artworks from their gallery. Once the user
        has selected at least two artworks, they can navigate to the next part
        of the creation sequence. This part of the sequence allows them to add a
        title, rationale and (optionally) descriptions for each of the artworks.
        Users can switch between this page and the previous page with the API
        results as many times as they want, with the currently selected artworks
        persisting.<br></br>
        <br></br> The application creates individual pages for each of the
        galleries. Here, users can like or comment on galleries. Users are
        allowed to delete galleries that they have previously created. Users are
        also able to delete comments that they have previously posted to a
        gallery.
      </p>
    </Container>
  );
}
