import { get, isEmpty, pick } from "lodash";
import createSocket from "socket.io";
var io = null;

const GAME_W = 940;
const GAME_H = 640;

// 1: random position item
function randomXY() {
    let maxX = GAME_W / 2;
    let maxY = GAME_H / 2;
    let x = (Math.random() - 0.5) * 2 * maxX;
    let y = (Math.random() - 0.5) * 2 * maxY;
    return { x, y};
}

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

    setData(data) { Object.assign(this, data); }

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

class Item {
    constructor(data) {
        this.id = get(data, 'id', -1);
        this.x = get(data, 'x', 0);
        this.y = get(data, 'y', 0);
        this.w = get(data, 'w', 60);
        this.h = get(data, 'h', 60);
    }

    setData(data) { Object.assign(this, data); }

    update(dt) { 

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

    init() {
        this.initItem(randomXY());
    }

    start () {
        let now = Date.now();
        let dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        this.update(dt);

        this.timeToBroadcast += dt;
        if(this.timeToBroadcast > 0.2) {
            this.timeToBroadcast = 0;
            let data = this.getData();

            // random 2 - 3
            let latency  = (Math.floor(Math.random() * 2) + 2) * 100;
            setTimeout(() => {

                io.emit("game-update", data);
                // console.log(`latency: ${latency}`);
            }, latency);
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

    getData() { return pick(this, ['users', 'items']); }

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
    initItem(data) {
        let index = this.items.findIndex(u => isEmpty(u));
        if(index === -1) { index = this.items.length; }

        this.items[index] = new Item({...data, id: index});
        return this.items[index];
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
    upScore(data) {
        let id = parseInt(get(data, "id", -1));
        this.users[id].score += 1;
    }
    removeUser(data) {
        let id = parseInt(get(data, "id", -1));
        this.users[id] = {};
    }
}
// =========================
const handleGame = (socket) => {

    // player
    socket.on("player-request-init", data => {
        socket.emit("game-init", eggGame.getData());

        let player = eggGame.initPlayer(data);
        socket.emit("player-init", player);
        socket.broadcast.emit("game-spawn-user", player);

    });
   
    socket.on("player-update", data => {
        eggGame.setUser(pick(data, ['id', 'accLeft', 'accRight', 'accUp', 'accDown']));
    })

    socket.on("player-ping", data => {
        let id = get(data, 'id');
        eggGame.setUser({ id, checkPing: true});
        console.log(JSON.stringify(eggGame.getUser({id})));
    })

    // item
    socket.on("item-collect", data => {
        let {user, item} = pick(data, ['user', 'item']);

        eggGame.getUser(user).score += 1;
        eggGame.items[item.id] = {};
        socket.broadcast.emit(`destroy-item-${item.id}`);
        setTimeout(() => {
            let item = eggGame.initItem(randomXY());
            io.emit("game-spawn-item", item);
        }, 400);
    })
}

var eggGame = new Game();
export function connect(server) {
    io = createSocket(server, { origin: ["*"] });

    eggGame.init();
    eggGame.start();

    io.on("connection", (socket) => {
        handleGame(socket);
    });
}
