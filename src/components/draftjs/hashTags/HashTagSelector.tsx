// tslint:disable
import * as React from 'react';
import { ITagData } from '../../interfaces';
import * as styles from './styles.less';
import config from '../../../config';

// tslint:disable-next-line:interface-name
interface IHashTagSelector {
  hashTag: ITagData;
  isLegaacy?: boolean;
}

export class HashTagSelector extends React.Component<IHashTagSelector, {}> {
  render() {
    const pluginConfig = config.hashTagPluginDefaults;
    return (
      <span className={styles.highlight}>
        <a
          href='#'
          title={this.props.hashTag.Name}
          target={pluginConfig.hashTagLinkTarget}
          spellCheck={false}
        >
          {this.props.children}
        </a>
      </span>
    );
  }
}
