import socketEvents from '../../../config/socketEvents.json';
import { GetUser, SetSocketId, OnlinePlayers } from './Auth';

export default class GameSocket {
    constructor(io) {
        this.io = io;
    }

    IncomingPlayerConnection = socketId => {
        this.GetSocketConnection(socketId).emit(
            socketEvents.global.socketConnectAck
        );

        this.GetSocketConnection(socketId).on(
            socketEvents.global.authentication,
            data => this.HandleAuth(data, socketId)
        );
    };

    HandleAuth = (data, socketId) => {
        if (!data.username || !data.password) {
            this.GetSocketConnection(socketId).emit(
                socketEvents.global.onAuthFail,
                {
                    message: 'Username and/or password were not submitted',
                }
            );
            return;
        }

        GetUser(data.username, 'username')
            .then(result => {
                if (result.user.gameSocket === null) {
                    if (result.user.password === data.password) {
                        let token = result.user.token;

                        this.GetSocketConnection(socketId).emit(
                            socketEvents.global.onAuthSuccess,
                            {
                                token,
                            }
                        );

                        SetSocketId(result.user, 'gameSocket', data.socketId);

                        this.PostAuthentication();
                    } else {
                        this.GetSocketConnection(socketId).emit(
                            socketEvents.global.onAuthFail,
                            {
                                message: 'Password was incorrect, try again.',
                            }
                        );
                        socket.disconnect(true);
                    }
                } else {
                    this.GetSocketConnection(socketId).emit(
                        socketEvents.global.onAuthFail,
                        {
                            message: 'Username is already logged in.',
                        }
                    );
                    this.GetSocketConnection(socketId).disconnect(true);
                }
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

    PostAuthentication = socketId => {
        this.GetSocketConnection(socketId).emit(
            socketEvents.global.playerList,
            {
                players: OnlinePlayers(),
            }
        );

        this.GetSocketConnection(socketId).broadcast.emit(
            socketEvents.global.playerList,
            {
                players: OnlinePlayers(),
            }
        );

        this.GetSocketConnection(socketId).on(
            socketEvents.global.disconnect,
            () => {}
        );
    };

    GetSocketConnection = socketId => {
        return this.io.sockets.sockets[socketId];
    };
}
