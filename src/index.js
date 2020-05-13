import { name, version } from '../package.json';
import setApp from './bin/util/www';
import moment from 'moment';
import socketio from 'socket.io';
import http from 'http';
import {
    SetSocketId,
    GetUser,
    OnlinePlayers,
    onUserUpdate,
    RemoveValueFromUserList,
    UpdateUser,
} from './bin/controllers/Auth';
import ChatRooms from '../config/chatrooms.json';
import GameSocket from './bin/controllers/GameSocket';
import ChatSocket from './bin/controllers/ChatSocket';

const app = setApp();
const PORT = process.env.PORT || 8090;

['log', 'warn', 'error'].forEach(function(method) {
    var oldMethod = console[method].bind(console);
    console[method] = function() {
        oldMethod.apply(console, [
            `<${name}|${PORT}|${version}|${moment()
                .utc()
                .utcOffset('-06:00')
                .format('MM-DD-YYYY hh:mm:ss A')} <${method.toUpperCase()}>>:`,
            ...arguments,
        ]);
    };
});

const server = http.createServer(app);

const gameSocketServer = socketio(server, {
    path: '/game/server',
});

export const gameSocket = new GameSocket(gameSocketServer);

const chatSocketServer = socketio(server, {
    path: '/game/chat',
});
export const chatSocket = new ChatSocket(chatSocketServer);

gameSocketServer.on('connection', socket => {
    console.log(`Player with id ${socket.id} has joined the server.`);
    gameSocket.IncomingPlayerConnection(socket.id);
    // let player;

    // socket.emit('socketConnectAck');

    // socket.on('authentication', data => {
    //     GetUser(data.username, 'username')
    //         .then(result => {
    // if (result.user.gameSocketId === null) {
    //     if (result.user.password === data.password) {
    //         let token = result.user.token;
    //         socket.emit('onAuthSuccess', {
    //             token,
    //         });
    //         SetSocketId(result.user, 'gameSocketId', socket.id);
    //         player = result.user;

    //         socket.emit('playerList', { players: OnlinePlayers() });
    //         socket.broadcast.emit('playerList', {
    //             players: OnlinePlayers(),
    //         });
    //         socket.broadcast.emit('newPlayer', {
    //             username: result.user.username,
    //         });
    //     } else {
    //         socket.emit('onAuthFail', {
    //             message: 'Password was incorrect, try again.',
    //         });
    //     }
    // } else {
    //     socket.emit('onAuthFail', {
    //         message: 'Username is already logged in.',
    //     });
    //     socket.disconnect(true);
    // }
    //         })
    //         .catch(error => {
    //             console.log(error);
    // socket.emit('onAuthFail', { message: error.message });
    // });
    // });

    // socket.on('disconnect', () => {
    //     console.log(
    //         `${player
    //             ? player.username
    //             : socket.id} has disconnected from the server.`
    //     );

    //     if (player) {
    //         socket.broadcast.emit('playerDisconnect', player.name);

    //         SetSocketId(player, 'gameSocketId', null);

    //         console.log(
    //             `There are ${OnlinePlayers().length} connected to chat.`
    //         );
    //     }
    // });
});
// io.sockets.sockets
chatSocketServer.on('connection', socket => {
    console.log('player attempting to connect to chat');
    chatSocket.IncomingPlayerConnection(socket.id);
    // let player;
    // socket.emit('socketConnectAck');

    // socket.on('authentication', data => {
    // GetUser(data.token, 'token')
    //     .then(result => {
    //         onUserUpdate.on(`${result.user.id}`, data => {
    //             console.log(player, data);
    //             let newChatChannels = player.subscribedChatChannels.filter(
    //                 channel =>
    //                     data.user.subscribedChatChannels.findIndex(
    //                         value => value === channel
    //                     ) != -1
    //             );

    //             player = data.user;

    //             socket.emit('updatedChatChannelList', {
    //                 list: player.subscribedChatChannels,
    //             });

    //             newChatChannels.forEach(channel => {
    //                 socket.broadcast.emit(`${channel}-joined`, {
    //                     username: player.username,
    //                 });
    //             });
    //         });
    //         if (result.user.chatSocketId === null) {
    //             socket.emit('onAuthSuccess');
    //             SetSocketId(result.user, 'chatSocketId', socket.id);
    //             player = result.user;

    //             chatSocket.AddPlayer(player);
    //         } else {
    //             socket.emit('onAuthFail', {
    //                 message: 'Account is already connected.',
    //             });
    //             socket.disconnect();
    //         }
    //     })
    //     .catch(error => {});
    // });

    // socket.on('disconnect', data => {
    //     if (player) {
    //         console.log(player);
    //         player.subscribedChatChannels.forEach(channel => {
    //             if (ChatRooms[channel]) {
    //                 socket.broadcast.emit(channel, {
    //                     username: player.username,
    //                     state: 1,
    //                 });
    //             }
    //         });

    //         socket.emit(`${socket.id}-disconnect`);

    //         UpdateUser(player, 'subscribedChatChannels', [], false);
    //         SetSocketId(player, 'chatSocketId', null);
    //     }
    // });
});

server.listen(PORT, () => {
    console.log('Server Online');
});
