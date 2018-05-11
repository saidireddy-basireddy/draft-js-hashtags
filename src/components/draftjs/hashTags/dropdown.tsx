import * as React from 'react';
import { ITagData } from '../../interfaces';
import Suggestion from './suggestion';
import * as styles from './styles.less';

// tslint:disable-next-line:interface-name
export interface IHashTagsDropdown {
    hashTags: Array<ITagData>;
    onHashTagSelected: (hashTag: ITagData) => void;
    selectIndex: number;
}

export class HashTagsDropdown extends React.Component<IHashTagsDropdown, {}> {
    render() {
        return (
            <div className={styles.hashTagsWrapper}>
                <ul contentEditable={false}>
                    {this.props.hashTags.map((hashTag: ITagData, index) => {
                        return (
                            <li
                                key={index}
                                tabIndex={index}
                                onClick={(e) => { e.stopPropagation(); this.props.onHashTagSelected(hashTag); }}
                                className={this.props.selectIndex === index ? styles.hashTagSuggestionSelected : ''}
                            >
                                <Suggestion {...hashTag} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}