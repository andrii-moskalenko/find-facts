export interface INews {
    title: string;
    text: string;
    id: string;
    img: string;
    events: Array<string>;
}

export interface IEvent {
    body: string;
    newsId: string;
}
