import { HubConnection } from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";

export default class CommentStore {
    comments: Comment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if()
    }
}