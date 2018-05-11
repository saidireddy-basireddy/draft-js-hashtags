// tslint:disable
import * as React from 'react';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { ITagData } from '../../interfaces';
import { HashTagsDropdown } from './dropdown';
import {tags} from '../../common/mockData';

// tslint:disable-next-line:interface-name
export interface IHashTagSuggestion {
  searchString: string;
  onHashTagSelected: (hashTag: ITagData) => void;
}

@observer
export class HashTagSuggestion extends React.Component<IHashTagSuggestion, {}> {
  @observable hashTagSuggestions: ITagData[] = [];
  @observable dropDownActive = false;
  @observable currentSelectedUserIndex = 0;
  @observable mouseDownInComponent = false;
  selectHashKeyCommandHandeledHandeled = 'select_hashTag_handeld';
  selectHashKeyCommandHandeledNotHandeled = 'select_hashTag_not_handeld';

  constructor(props: any) {
    super(props);
    this.getTags = this.getTags.bind(this);
  }

  componentWillReceiveProps  (nextProps: IHashTagSuggestion)  {
    if (nextProps.searchString !== this.props.searchString) {
      if (nextProps.searchString.length >= 0) {
        this.getTags(nextProps.searchString);
      } else {
        this.clearHashTagSuggestions();
      }
    }
  }

  componentDidMount() {
    this.getTags(this.props.searchString);
    window.addEventListener('mousedown', this.pageClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.pageClick, false);
  }

  pageClick = () => {
    if (this.mouseDownInComponent) { return; }
    this.dropDownActive = false;
  }

  clearHashTagSuggestions = () => {
    this.hashTagSuggestions = [];
  }

  async getTags(searchString: string) {
    try {
      this.hashTagSuggestions = tags;
      const hasItem = this.hashTagSuggestions.findIndex(h => h.Name.toLowerCase() === searchString.toLowerCase()) > -1;
      if (!hasItem) {
        const hashTag: ITagData = {
          Name: searchString,
          Link: searchString
        };
        this.hashTagSuggestions = [hashTag, ...toJS(this.hashTagSuggestions)];
      }

      if (this.hashTagSuggestions.length === 0) {
        this.dropDownActive = false;
      } else {
        this.dropDownActive = true;
      }

    } catch (e) {
      console.log('error in fetching hashTags', e);
    }
  }

  keyCommand = (command: string) => {
    switch (command) {
      case this.selectHashKeyCommandHandeledHandeled:
        this.onHashTagSelected(this.hashTagSuggestions[this.currentSelectedUserIndex]);
        return 'handled';
      case this.selectHashKeyCommandHandeledNotHandeled:
        this.onHashTagSelected(this.hashTagSuggestions[this.currentSelectedUserIndex]);
        return 'not-handled';
      default: return 'not-handled';
    }
  }

  keyPressed = (e) => {
    if (this.dropDownActive) {
      if (e.key.search(/\s/g) > -1) { return this.selectHashKeyCommandHandeledHandeled; }
      if (e.keyCode === 13) { return this.selectHashKeyCommandHandeledNotHandeled; } // new line

    }
    return null;
  }

  keyUp = (e) => {
    if (this.dropDownActive) {
      e.preventDefault();
      if (this.currentSelectedUserIndex > 0) { this.currentSelectedUserIndex--; }
    }
  }

  keyDown = (e) => {
    if (this.dropDownActive) {
      e.preventDefault();
      if (this.currentSelectedUserIndex < this.hashTagSuggestions.length - 1) { this.currentSelectedUserIndex++; }
    }
  }

  onEscape = (e) => {
    if (this.dropDownActive) {
      e.preventDefault();
      this.dropDownActive = false;
    }
  }

  onHashTagSelected = (hashTag: ITagData) => {
    this.dropDownActive = false;
    this.props.onHashTagSelected(hashTag);
  }

  render() {
    return (
      <span onMouseDown={() => this.mouseDownInComponent = true} onMouseUp={() => this.mouseDownInComponent = false}>
        {this.props.children}
        {this.dropDownActive && (
          <HashTagsDropdown
            hashTags={this.hashTagSuggestions}
            onHashTagSelected={this.onHashTagSelected}
            selectIndex={this.currentSelectedUserIndex}
          />)
        }
      </span>
    );
  }
}
