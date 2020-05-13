import EventEmitter from 'events';
import Player from '../util/Player';

const users = [
    new Player('Pertinate', 'password', 0),
    new Player('MyOtherUser', 'password', 1),
];

export const onUserUpdate = new EventEmitter();

export const GetUser = (searchTerm, verifyType) => {
    return new Promise((resolve, reject) => {
        let user = users.find(
            userInList => userInList[verifyType] === searchTerm
        );

        if (user === undefined) {
            return reject({ message: 'User was not found, please register.' });
        } else {
            //generate token

            return resolve({
                user,
                message: 'USER_FOUND',
            });
        }
    });
};

export const IsUserLoggedIn = username => {
    let user = users.find(value => value.username === username);

    return { loggedIn: user.socketId !== null || false };
};

export const SetSocketId = ({ id }, socketType, socketId) => {
    users[id][socketType] = socketId;
};

export const OnlinePlayers = () => {
    return users
        .filter(user => user.gameSocket !== null)
        .map(user => ({ username: user.username }));
};

export const UpdateUser = ({ id }, key, value, emit = true) => {
    users[id][key] = value;

    if (emit) {
        onUserUpdate.emit(`${id}`, users[id]);
    }
};

export const PushValueToUserList = ({ id }, key, value, emit = true) => {
    if (Array.isArray(users[id][key])) {
        Array.isArray(value)
            ? users[id][key].push(...value)
            : users[id][key].push(value);
        console.log('emitting', users[id]);
        let player = users[id];
        if (emit) {
            onUserUpdate.emit(`${users[id].id}`, {
                user: users[id],
            });
        }
    }
};

export const RemoveValueFromUserList = ({ id }, key, value, emit = true) => {
    if (Array.isArray(users[id][key])) {
        let valuesToRemove = Array.isArray(value) ? value : [value];

        valuesToRemove.forEach(v => {
            let index = users[id][key].findIndex(val => val === v);

            if (index !== -1) {
                users[id][key].splice(index, 1);

                if (emit) {
                    onUserUpdate.emit(`${id}`, users[id]);
                }
            }
        });
    }
};
