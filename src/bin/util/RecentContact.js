export default class RecentContact {
    constructor(username, message) {
        this.username = username;
        this.messages = [];
    }

    AddMessage({ message, timestamp }) {
        if (
            this.messages.findIndex(
                msgIndex =>
                    msgIndex.message === message &&
                    msgIndex.timestamp === timestamp
            ) === -1
        ) {
            this.messages.push({
                message,
                timestamp,
            });
        }
    }
}
