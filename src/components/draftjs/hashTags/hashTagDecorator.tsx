import * as React from 'react';
import * as Draft from 'draft-js';
import { MyDraftDecorator } from '../draftcore/MyDraft';
import { observer } from 'mobx-react';
import { HashTagSuggestion } from './HashTagSuggestion';
import { HashTagSelector } from './HashTagSelector';
import { ITagData } from '../../interfaces';
import { toJS } from 'mobx';
import {
  getTextBetweenTriggerAndCurser,
  isCursorAtEndOFBlock,
  ReplaceCurrentWithEntity,
  getEntityData
} from '../draftcore/draftUtils';

export class HashTagDecorator implements MyDraftDecorator {
  entityType: string = 'hashTag';
  hashTagTrigger: string = '#';
  editorState: Draft.EditorState;
  HashTagRef: HashTagSuggestion;

  constructor(public UpdateEditorStareCallBack: (editorState: Draft.EditorState) => void) { }

  onEditorStateUpdated = (editorState: Draft.EditorState) => {
    this.editorState = editorState;
  }

  strategy = (block: Draft.ContentBlock, callback: (start: number, end: number) => void) => {

    block.findEntityRanges(val => {
      const entityKey = val.getEntity();
      if (!entityKey) { return false; }
      const contentState = this.editorState.getCurrentContent() as any;
      return contentState.getEntity(entityKey)
        .getType() === this.entityType;
    }, (start, end) => callback(start, end));
    const text = block.getText();
    const regex = /(^|\s)#\w+/g;
    let matches: RegExpExecArray | null;
    while ((matches = regex.exec(text)) !== null) {
      let start = matches.index;
      let end = matches[0].length + start;
      callback(start, end);
    }
  }

  component = observer<any>((props: { decoratedText: string, entityKey: string, children: any }) => {
    if (props.entityKey) {
      var hashTag: ITagData;
        hashTag = this.getUserfromEntity(props.entityKey);
      
      return <HashTagSelector hashTag={hashTag} >{props.children}</HashTagSelector>;
    }

    let cleanCurrentHashTag = '';
    let currentHashTagText = '';
    if (isCursorAtEndOFBlock(this.editorState, this.hashTagTrigger)) {
      currentHashTagText = props.decoratedText as string;
    } else {
      const hashTagAtCursor = this.textBetweenAtAndCursor();
      if (hashTagAtCursor) { currentHashTagText = hashTagAtCursor.suggestionText; }
    }
    cleanCurrentHashTag = currentHashTagText.replace(this.hashTagTrigger, '').trim();
    if (!cleanCurrentHashTag) {
      return <HashTagSelector hashTag={{ Name: props.decoratedText }} >{props.children}</HashTagSelector>;
    }

    return (
      <HashTagSuggestion
        ref={(HashTagRef) => this.HashTagRef = HashTagRef}
        searchString={cleanCurrentHashTag}
        onHashTagSelected={this.onHashTagSelected}
      >
        {props.children}
      </HashTagSuggestion>
    );
  });

  textBetweenAtAndCursor = () => {
    return getTextBetweenTriggerAndCurser(this.hashTagTrigger, this.editorState);
  }

  onHashTagSelected = (tag: ITagData) => {
    const newEditorState = ReplaceCurrentWithEntity(
      toJS(tag), `#${tag.Name}`, this.hashTagTrigger, this.entityType, this.editorState);
    this.UpdateEditorStareCallBack(newEditorState);
  }

  getUserfromEntity(entityKey: string) {
    return getEntityData<ITagData>(entityKey, this.editorState);
  }

  onKeyPressed = (e) => {
    if (this.HashTagRef) { return this.HashTagRef.keyPressed(e); };
    return null;
  }

  onKeyCommand = (command: string) => {
    if (this.HashTagRef) { return this.HashTagRef.keyCommand(command); }
    return 'not-handled';
  }

  onKeyUp = (e) => {
    if (this.HashTagRef) { this.HashTagRef.keyUp(e); }
  }

  onKeyDown = (e) => {
    if (this.HashTagRef) { this.HashTagRef.keyDown(e); }
  }

  onEscape = (e) => {
    if (this.HashTagRef) { this.HashTagRef.onEscape(e); }
  }
}
