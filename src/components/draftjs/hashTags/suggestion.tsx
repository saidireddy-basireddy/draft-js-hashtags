import * as React from 'react';
import * as styles from './styles.less';
import { ITagData } from '../../interfaces';

const Suggestion = (props: ITagData) => (
    <div className={styles.hashTagSuggestion}>
      {props.Name}
    </div>
  );
export default Suggestion;