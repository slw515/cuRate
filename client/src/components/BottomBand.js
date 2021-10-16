import React from "react";
import { Container, Row, Card } from "react-bootstrap";
import { Button, Icon } from "semantic-ui-react";

function BottomBand({
  artworks,
  deleteSelectedArtworkCard,
  changeStateToEditing,
  onSearchPage
}) {
  // const deleteSelectedArtworkCard = artworkId => {
  //   console.log(artworkId);
  //   addRemoveSelectedArt(
  //     currentSelectedArt.filter(post => post.id != artworkId)
  //   );
  // };
  return (
    <div id="bottomBand" className="withArt">
      {artworks.map(art => (
        <div className="thumbnailAndTitle">
          <Button icon onClick={() => deleteSelectedArtworkCard(art.title)}>
            <Icon name="delete" />
          </Button>
          <p>{art.title}</p>
          <img src={art.image} />
        </div>
      ))}
      <div className="editAndCreatePost">
        <Button color="green" icon onClick={() => changeStateToEditing()}>
          {/* <Icon name="caret square right" /> */}
          {onSearchPage ? <p>Edit And Create Post</p> : <p>Back To Search</p>}
        </Button>
      </div>
    </div>
  );
}

export default BottomBand;
