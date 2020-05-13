import EventEmitter from 'events';

export default class Player {
    constructor(username, password, id) {
        this.username = username;
        this.password = password;

        this.id = id;

        this.token = `mySecretTokenFor${this.username}`;

        this.gameSocket = null;
        this.chatSocket = null;

        this.chatChannels = [];
        this.friends = [];
        this.recentMessages = [];

        this.Event = new EventEmitter();
    }

    GetPrivatePlayer = () => {
        return {
            username: this.username,
            friends: this.GetFriends(),
        };
    };

    GetPublicPlayer = () => {
        return {
            username: this.username,
        };
    };

    GetFriends = () => {
        return this.friends.map(friend => friend.GetPublicPlayer());
    };

    AddChatChannel = chatChannel => {
        this.chatChannels.push(chatChannel);
        return this.chatChannels;
    };

    RemoveChatChannel = chatChannel => {
        let index = this.chatChannels.findIndex(
            channel => channel === chatChannel
        );

        if (index === -1) {
            return null;
        }

        return this.chatChannels.splice(index, 1);
    };

    AddFriend = player => {
        this.friends.push(player);
        return this.friends;
    };

    RemoveFriend = player => {
        let index = this.friends.findIndex(
            friend => friend.username === player.username
        );

        if (index === -1) {
            return null;
        }

        return this.friends.splice(index, 1);
    };
}
