import React from "react";
import { Container, Row, Card } from "react-bootstrap";
import { Button, Icon } from "semantic-ui-react";

function BottomBand({ artworks, deleteSelectedArtworkCard }) {
  // const deleteSelectedArtworkCard = artworkId => {
  //   console.log(artworkId);
  //   addRemoveSelectedArt(
  //     currentSelectedArt.filter(post => post.id != artworkId)
  //   );
  // };
  return (
    <div id="bottomBand">
      {artworks.map(art => (
        <div className="thumbnailAndTitle">
          <Button icon onClick={() => deleteSelectedArtworkCard(art.id)}>
            <Icon name="delete" />
          </Button>
          <p>{art.id}</p>
          <img src={art.image} />
        </div>
      ))}
    </div>
  );
}

export default BottomBand;
