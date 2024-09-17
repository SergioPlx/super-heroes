export interface IModelCharacter {
    comics: any;
    description: string;
    events: any;
    id: number;
    modified: Date;
    name: string;
    resourceURI: string;
    series: any;
    stories: any;
    thumbnail: IModelCharacterThumbnail;
    urls: any[];
}

export interface IModelCharacterThumbnail {
    extension: string;
    path: string;
}