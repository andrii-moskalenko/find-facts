export interface INews {
    title: string;
    text: string;
    id: string;
    events: Array<string>;
}

export interface IEvent {
    body: string;
    newsId: string;
}
