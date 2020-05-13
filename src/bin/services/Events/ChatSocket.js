import { GetUser, PushValueToUserList } from '../../controllers/Auth';
import ChatRooms from '../../../../config/chatrooms.json';
import socketEvents from '../../../../config/socketEvents.json';

export default class ChatSocket {
    constructor(io) {
        this.io = io;
        this.channels = [
            {
                name: 'lobby',
                users: [],
                owner: 'server',
            },
        ];
    }

    UnsubscribeFromChannel(player, channelName) {
        if (!this.channels[channelName]) return;
        player['subscribedChannels'] = player['subscribedChannels'].filter(
            channel => channel.toLowerCase() !== channelName.toLowerCase()
        );
    }

    SubscribeToChannel(player, channelNames) {
        console.log('subscribing to channel');
        channelNames.forEach(channelName => {
            this.io.sockets.sockets[
                player.chatSocket
            ].broadcast.emit(channelName, {
                username: player.username,
                state: 0,
            });
            this.io.sockets.sockets[player.chatSocket].on(
                channelName,
                this.HandleMessage
            );
        });
    }

    CreateChannel(player, channelName) {}

    DeleteChannel(player, channelName) {}

    UpdateListeners(player, channelNames) {
        let subscribedChannels = Object.keys(player.subscribedChannels);
        channelNames.forEach(channelName => {
            let index = subscribedChannels.findIndex(
                channel => channel.toLowerCase() === channelName.toLowerCase()
            );
            if (index !== -1) {
                player.socket.on(channelName, this.HandleMessage);
            } else {
                player.socket.removeListener(channelName, this.HandleMessage);
            }
        });
    }

    HandleMessage = data => {
        let whisper = data.message.match(/^@[_\w]+/);
        if (whisper !== null) {
            let userToWhisper = whisper[0].replace('@', '');
            let message = data.message.replace(whisper[0] + ' ', '');
            GetUser(data.socketId)
                .then(result => {
                    let sender = result.user;

                    GetUser(userToWhisper, 'username')
                        .then(result => {
                            let receiver = result.user;

                            if (receiver.chatSocketId === null) {
                                this.io.sockets.sockets[
                                    data.socketId
                                ].emit(socketEvents.chat.whisperStatus, {
                                    status: 0,
                                    username: receiver.username,
                                    message: 'User is not online',
                                });
                            } else {
                                this.io.sockets.sockets[
                                    data.socketId
                                ].broadcast.emit(
                                    `${userToWhisper.toLowerCase()}${socketEvents
                                        .chat.whisper}`,
                                    {
                                        username: sender.username,
                                        message,
                                    }
                                );
                                this.io.sockets.sockets[
                                    data.socketId
                                ].emit(socketEvents.chat.whisperStatus, {
                                    status: 1,
                                    username: userToWhisper,
                                    message,
                                });
                            }
                        })
                        .catch(error => {
                            this.io.sockets.sockets[id].emit(
                                socketEvents.chat.whisperStatus,
                                {
                                    status: 0,
                                    username: receiver.username,
                                    message: 'User does not exist.',
                                }
                            );
                        });
                })
                .catch(error => {
                    console.error('failed to find player');
                    this.io.sockets.sockets[
                        data.socketId
                    ].emit('playerNotFound-whisper', {
                        username: whisper,
                        message,
                    });
                });
        } else {
            GetUser(data.socketId)
                .then(result => {
                    this.io.sockets.sockets[data.socketId].emit('lobby', {
                        username: result.user.username,
                        message: data.message,
                        state: 2,
                    });
                    this.io.sockets.sockets[
                        data.socketId
                    ].broadcast.emit('lobby', {
                        username: result.user.username,
                        message: data.message,
                        state: 2,
                    });
                })
                .catch(error => {
                    this.io.sockets.sockets[
                        data.socketId
                    ].emit('playerNotFound', {
                        username: whisper,
                        message,
                    });
                });
        }
    };

    AddPlayer = Player => {
        let chatRooms = [
            ...Object.keys(ChatRooms),
            `${Player.username.toLowerCase()}-whisper`,
        ];
        PushValueToUserList(Player, 'subscribedChatChannels', chatRooms);
        this.SubscribeToChannel(Player, chatRooms);
    };

    RemovePlayer(Player) {}
}
