import EventEmitter from 'events';
import emitterEvents from '../../../config/emitterEvents.json';
export default class ChatChannel {
    constructor(name, creator, io) {
        this.io = io;
        this.name = name;
        this.creator = creator;
        this.players = [];
        this.Event = new EventEmitter();
    }

    AddPlayer = ({ username, chatSocket }) => {
        this.GetSocketConnection(chatSocket).join(this.name);
        this.players.push(username);
        this.Event.emit(emitterEvents.chatChannel.onChannelJoin);
    };

    RemovePlayer = ({ username, chatSocket }) => {
        let index = this.players.findIndex(
            playerUsername => playerUsername === username
        );

        if (index === -1) {
            return null;
        }

        if (this.players.length - 1 === 0) {
            this.Event.emit(emitterEvents.chatChannel.onChannelEmpty);
        }

        this.GetSocketConnection(chatSocketId).leave(this.name);

        return this.players.splice(index, 1);
    };

    EmitMessage = ({ username }, message) => {
        this.io.sockets.in(this.name).emit('chatMessage', {
            username,
            message,
        });
    };

    GetSocketConnection = socketId => {
        return this.io.sockets.sockets[socketId];
    };
}
