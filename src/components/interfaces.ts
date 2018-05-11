// tslint:disable:interface-name
// tslint:disable:max-line-length
// tslint:disable:class-name
export interface ITagData {
  Name: string;
  Link?: string;
}

/*************************************************** Data Structure for HashTags ***************************************************************/

export interface IHashTagSuggestionsConfig {
  suggestionFilteDefaultSize: number;
  suggestionPropToSearchBy: string;
  suggestionFieldId: string;
  suggestionFieldLink: string;
}
