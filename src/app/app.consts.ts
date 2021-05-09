export interface INews {
    title: string;
    text: string;
    id: string;
    img: string;
    events: Array<string>;
    date: Date;
    innerHtml?: string;
}

export interface IEvent {
    body: string;
    newsId: string;
}
