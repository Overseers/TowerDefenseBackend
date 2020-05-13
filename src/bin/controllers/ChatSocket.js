import socketEvents from '../../../config/socketEvents.json';
import emitterEvents from '../../../config/emitterEvents.json';
import { GetUser, SetSocketId } from './Auth';
import ChatChannel from '../util/ChatChannel';

export default class ChatSocket {
    constructor(io) {
        this.io = io;

        this.serverChatChannels = {
            lobby: new ChatChannel('lobby', 'server', this.io),
        };

        this.chatChannels = [new ChatChannel('lobby', 'server', this.io)];
    }

    IncomingPlayerConnection = socketId => {
        this.GetSocketConnection(socketId).emit(
            socketEvents.global.socketConnectAck
        );
        this.GetSocketConnection(socketId).on('authentication', data =>
            this.HandleAuth(data, socketId)
        );
    };

    HandleAuth = (data, socketId) => {
        if (!data.token) {
            this.GetSocketConnection(socketId).emit(
                socketEvents.global.onAuthFail,
                {
                    message: 'Token was not submitted',
                }
            );
            return;
        }

        GetUser(data.token, 'token')
            .then(result => {
                if (result.user.chatSocket === null) {
                    SetSocketId(result.user, 'chatSocket', socketId);

                    this.GetSocketConnection(socketId).emit(
                        socketEvents.global.onAuthSuccess
                    );

                    this.serverChatChannels.lobby.AddPlayer(result.user);

                    this.serverChatChannels.lobby.EmitMessage(
                        { username: 'test' },
                        'testing'
                    );
                } else {
                    this.GetSocketConnection(socketId).emit(
                        socketEvents.global.onAuthFail,
                        {
                            message: 'Account is already connected.',
                        }
                    );

                    this.GetSocketConnection(socketId).disconnect();
                }
                // onUserUpdate.on(`${result.user.id}`, data => {
                //     console.log(player, data);
                //     let newChatChannels = player.subscribedChatChannels.filter(
                //         channel =>
                //             data.user.subscribedChatChannels.findIndex(
                //                 value => value === channel
                //             ) != -1
                //     );

                //     player = data.user;

                //     socket.emit('updatedChatChannelList', {
                //         list: player.subscribedChatChannels,
                //     });

                //     newChatChannels.forEach(channel => {
                //         socket.broadcast.emit(`${channel}-joined`, {
                //             username: player.username,
                //         });
                //     });
                // });
                // if (result.user.chatSocketId === null) {
                //     socket.emit('onAuthSuccess');
                // SetSocketId(result.user, 'chatSocketId', socket.id);
                //     player = result.user;

                //     chatSocket.AddPlayer(player);
                // } else {
                //     socket.emit('onAuthFail', {
                //         message: 'Account is already connected.',
                //     });
                //     socket.disconnect();
                // }
            })
            .catch(error => {
                this.GetSocketConnection(socketId).emit(
                    socketEvents.global.onAuthFail,
                    {
                        message: error.message,
                    }
                );
            });
    };

    GetSocketConnection = socketId => {
        return this.io.sockets.sockets[socketId];
    };
}
