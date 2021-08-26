import * as logger from "~/core/logger";
import { get, isEmpty, pick } from "lodash";
import { v4 as uuidV4 } from "uuid";
import createSocket from "socket.io";
var io = null;

const gameW = 940;
const gameH = 640;

var timer = 0;
var stop = true;

var users = [];
var items = [];

let totalUser = -1;
var totalItem = 0;
const MAX_ITEM = 1;

// 1: random position item
function randomXY() {
    let maxX = gameW / 2;
    let maxY = gameH / 2;
    let x = (Math.random() - 0.5) * 2 * maxX;
    let y = (Math.random() - 0.5) * 2 * maxY;
    return { x, y};
}
// function spawnItem() {
//     if(totalItem < MAX_ITEM) {
//         let item = randomXY();
//         items = [...items, {
//             ...item,
//             id: totalItem,
//         }];
//         totalItem += 1;
//     }
// }
// spawnItem();

const getData = () => ({timer, users, items});

// function startTimer() {
//     if(stop) updateTimer();
//     stop = false;
// }
// function stopTimer() { stop = true; }
// function updateTimer() {
//     setTimeout(() => { 
//         timer += 1;
//         if(!stop) { updateTimer(); }
//     }, 1000);
// }

class User {
    constructor(data) {
        this.id = get(data, 'id', -1);
        this.score = get(data, 'score', 0);
        this.username = get(data, 'username', '');
        this.accLeft = get(data, 'accLeft', false);
        this.accRight = get(data, 'accRight', false);
        this.accUp = get(data, 'accUp', false);
        this.accDown = get(data, 'accDown', false);
        this.accel = get(data, 'accel', 350);
        this.maxMoveSpeed = get(data, 'maxMoveSpeed', 400);
        this.x = get(data, 'x', 0);
        this.y = get(data, 'y', 0);
        this.xSpeed = get(data, 'xSpeed', 0);
        this.ySpeed = get(data, 'ySpeed', 0);
    }

    setData(data) { 
        Object.assign(this, this, data);
    }

    update(dt) {
        // console.log(dt);
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } 
        else if(!this.accLeft && this.xSpeed < 0) {
            this.xSpeed += this.accel * dt;
        }
        else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        else if(!this.accRight && this.xSpeed > 0) {
            this.xSpeed -= this.accel * dt;
        }

        if(this.accUp) {
            this.ySpeed += this.accel * dt;
        }
        else if(!this.accUp && this.ySpeed > 0) {
            this.ySpeed -= this.accel * dt;
        }
        else if(this.accDown) {
            this.ySpeed -= this.accel * dt;
        }
        else if(!this.accDown && this.ySpeed < 0) {
            this.ySpeed += this.accel * dt;
        }

        // Restrict the movement speed of the main character to the maximum movement speed
        // If speed reach limit, use max speed with current direction
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        if ( Math.abs(this.ySpeed) > this.maxMoveSpeed ) {
            this.ySpeed = this.maxMoveSpeed * this.ySpeed / Math.abs(this.ySpeed);
        }

        // Update the position of the main character according to the current speed
        this.x += this.xSpeed * dt;
        this.y += this.ySpeed * dt;
    }
}

// Game:
class Game {
    constructor() {
        this.lastUpdate = Date.now();
        this.users = [];
        this.items = [];
        this.timeToBroadcast = 0;
    }

    start () {
        let now = Date.now();
        let dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        this.update(dt);

        this.timeToBroadcast += dt;
        if(this.timeToBroadcast > 0.2) {
            let data = pick(this, ['users', 'items']);
            io.emit("game-update", data);
            this.timeToBroadcast = 0;
        }

        setTimeout(() => {
            this.start();
        });
        
    }
    update(dt) {
        // console.log(dt);
        this.users.map(u => {
            if(!isEmpty(u)) u.update(dt);
        })
    }

    // Add user into users list:
    // if there is empty object use old id
    // else add new id
    initPlayer(data) {
        let index = this.users.findIndex(u => isEmpty(u));
        if(index === -1) { index = this.users.length; }

        let xy = randomXY();
        this.users[index] = new User({...data, id: index, ...xy});
        return this.users[index];
    }
    getUser(data) {
        let id = parseInt(get(data, "id", -1));
        if(id >= 0 && !isEmpty(this.users[id]))
            return this.users[id];

        return null;
    }
    setUser(data) {
        let id = parseInt(get(data, "id", -1));
        if(id >= 0 && !isEmpty(this.users[id]))
            this.users[id].setData(data);
    }
}
// ========================= START THE GAME

const handleGame = (socket) => {

    // create connect id
    // socket.emit("connected", gainUserId());

    // socket.on("game-update", data => {
    //     socket.emit("game-update", getData());
    // })
    // socket.on("game-gainscore", data => {
    //     let {user, item:id} = pick(data, ['user', 'item']);
    //     Object.assign(users[user.id], pick(user, ['score']));
    //     Object.assign(items[id], randomXY());
    //     socket.broadcast.emit(`onDestroy-item-${id}`);
    //     setTimeout(()=> {
    //         socket.broadcast.emit("game-spawn-item", items[id]);
    //         socket.emit("game-spawn-item", items[id]);
    //     }, 1000);
    // })

    // player
    socket.on("player-request-init", data => {
        let player = eggGame.initPlayer(data);
        socket.emit("player-init", player);
    });
   
    socket.on("player-update", data => {
        eggGame.setUser(data);

        // let user = eggGame.getUser(data);
        // if(!isEmpty(user)) socket.emit("player-update", user);
    })


    // socket.on("user-join", (user) => {
    //     socket.emit("game-load", getData()); //getData for player
    //     users[user.id] = user;
    //     socket.broadcast.emit("user-join", users[user.id]); //update for all users

    //     pingUser(socket, user.id);
    // });
    // socket.on("user-update", (user) => {
    //     users[user.id] = Object.assign({}, users[user.id], user);
    // })
    // socket.on("user-ping", user => {
    //     let id = get(user, 'id');
    //     users[id] = Object.assign({}, users[id], { checkPing: true});

    //     console.log(JSON.stringify(users));
    // })
}

// const pingUser = (socket, id) => {
//     users[id] = Object.assign({}, users[id], { checkPing: false});
//     socket.emit("user-ping");
//     setTimeout(() => {
//         if(!get(users[id], 'checkPing')) {
//             socket.broadcast.emit(`user-destroy-${id}`);
//             users[id] = {};
//             return;
//         }
//         pingUser(socket, id);
//     }, 5000);    
// }

var eggGame = new Game();
export function connect(server) {
    io = createSocket(server, { origin: ["*"] });

    eggGame.start();

    io.on("connection", (socket) => {
        handleGame(socket);
    });
}
