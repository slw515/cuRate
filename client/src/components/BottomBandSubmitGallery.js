import React from "react";
import { Button, Icon } from "semantic-ui-react";

function BottomBandSubmitGallery({
  changeStateToEditing,
  onSearchPage,
  createPost,
  currentSelectedArt,
  titleText,
  bodyText
}) {
  return (
    <div id="bottomBand" className="editSubmit">
      {" "}
      <Button color="green" icon onClick={() => changeStateToEditing()}>
        {/* <Icon name="caret square right" /> */}
        {onSearchPage ? <p>Edit And Create Post</p> : <p>Back To Search</p>}
      </Button>
      <Button
        color="green"
        icon
        onClick={e => createPost(e)}
        disabled={
          currentSelectedArt.length <= 3 || bodyText == "" || titleText == ""
            ? true
            : false
        }
      >
        {/* <Icon name="caret square right" /> */}
        {currentSelectedArt.length > 3 ? (
          <p>Submit</p>
        ) : (
          <p>
            Add {4 - currentSelectedArt.length} artwork(s) to the collection!
          </p>
        )}
      </Button>
    </div>
  );
}

export default BottomBandSubmitGallery;
