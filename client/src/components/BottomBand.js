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
    <div
      id="bottomBand"
      className="withArt"
      className={`${artworks.length > 0 ? "withArt" : "empty"}`}
    >
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
        <Button
          color="green"
          icon
          onClick={() => changeStateToEditing()}
          disabled={artworks.length > 1 && onSearchPage ? false : true}
        >
          {/* <Icon name="caret square right" /> */}
          {onSearchPage ? (
            <p>
              {artworks.length > 1 && onSearchPage
                ? "Edit And Create Gallery"
                : `Please Have At Least Two Artworks In The Gallery`}
            </p>
          ) : (
            <p>Back To Search</p>
          )}
        </Button>
      </div>
    </div>
  );
}

export default BottomBand;
