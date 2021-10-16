import React from "react";
import { Button, Icon } from "semantic-ui-react";

function BottomBandSubmitGallery({
  changeStateToEditing,
  onSearchPage,
  createPost
}) {
  return (
    <div id="bottomBand" className="editSubmit">
      {" "}
      <Button color="green" icon onClick={() => changeStateToEditing()}>
        {/* <Icon name="caret square right" /> */}
        {onSearchPage ? <p>Edit And Create Post</p> : <p>Back To Search</p>}
      </Button>
      <Button color="green" icon onClick={e => createPost(e)}>
        {/* <Icon name="caret square right" /> */}
        {onSearchPage ? <p>Edit And Create Post</p> : <p>Submit</p>}
      </Button>
    </div>
  );
}

export default BottomBandSubmitGallery;
