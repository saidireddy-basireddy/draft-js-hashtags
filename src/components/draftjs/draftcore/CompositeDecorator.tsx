import * as Draft from 'draft-js';
import { HashTagDecorator } from './../hashTags/hashTagDecorator';

export class CompositDecorator {

  constructor(public UpdateEditorStoreCallBack: (editorState: Draft.EditorState) => void) { }

  private hashTag = new HashTagDecorator(this.UpdateEditorStoreCallBack);

  onUpDateEditorState(editorState: Draft.EditorState) {
    this.hashTag.onEditorStateUpdated(editorState);
  }

  onKeyPressed = (e) => {
    let keyHandeled = this.hashTag.onKeyPressed(e);
    if (keyHandeled) { return keyHandeled; }
    return null;
  }

  onKeyCommand = (command: string) => {
    let keyHandled = this.hashTag.onKeyCommand(command);
    if (keyHandled !== 'not-handled') { return keyHandled; }
    return 'not-handled';
  }    

  onKeyUp = (e) => {
    let keyHandled = this.hashTag.onKeyUp(e);
    if (keyHandled) { return keyHandled; }
    return null;
  }

  onKeyDown = (e) => {
    let keyHandled = this.hashTag.onKeyDown(e);
    if (keyHandled) { return keyHandled; }
    return null;
  }

  onEscape = (e) => {
    let keyHandled = this.hashTag.onEscape(e);
    if (keyHandled) { return keyHandled; }
    return null;
  }

  getCompositDecorators() {
    const compositDecorators = new Draft.CompositeDecorator([
      {
        strategy: this.hashTag.strategy,
        component: this.hashTag.component
      }
    ]);
    return compositDecorators;
  }
}
