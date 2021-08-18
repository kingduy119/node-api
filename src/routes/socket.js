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
var scores = [];
var items = [];

let totalUser = -1;
var totalItem = 0;
const MAX_ITEM = 1;

function gainUserId() {
    let index = users.findIndex(u => isEmpty(u));
    if(index !== -1) return index;
    totalUser += 1;
    return totalUser;
}

function startTimer() {
    if(stop) updateTimer();
    stop = false;
}
function stopTimer() { stop = true; }
function updateTimer() {
    setTimeout(() => { 
        timer += 1;
        if(!stop) { updateTimer(); }
    }, 1000);
}

// 1: random position item
function createItem() {
    let maxX = gameW / 2;
    let maxY = gameH / 2;
    let x = (Math.random() - 0.5) * 2 * maxX;
    let y = (Math.random() - 0.5) * 2 * maxY;
    return { x, y};
}
function spawnItem() {
    if(totalItem < MAX_ITEM) {
        let item = createItem();
        items = [...items, {
            ...item,
            id: totalItem,
        }];
        totalItem += 1;
    }
}
spawnItem();

const getData = () => ({timer, users, scores, items});


const handleGame = (socket) => {
    // create connect id
    socket.emit("connected", gainUserId());

    socket.on("game-update", data => {
        socket.emit("game-update", getData());
    })
    socket.on("game-gainscore", data => {
        let {user, item:id} = pick(data, ['user', 'item']);
        Object.assign(users[user.id], pick(user, ['score']));
        Object.assign(items[id], createItem());
        socket.broadcast.emit(`onDestroy-item-${id}`);
        setTimeout(()=> {
            socket.broadcast.emit("game-spawn-item", items[id]);
            socket.emit("game-spawn-item", items[id]);
        }, 1000);
    })

    // player
    socket.on("user-join", (user) => {
        socket.emit("game-load", getData()); //getData for player
        users[user.id] = user;
        socket.broadcast.emit("user-join", users[user.id]); //update for all users

        pingUser(socket, user.id);
    });
    socket.on("user-update", (user) => {
        users[user.id] = Object.assign({}, users[user.id], user);
    })
    socket.on("user-ping", user => {
        let id = get(user, 'id');
        users[id] = Object.assign({}, users[id], { checkPing: true});

        console.log(JSON.stringify(users));
    })
}

const pingUser = (socket, id) => {
    users[id] = Object.assign({}, users[id], { checkPing: false});
    socket.emit("user-ping");
    setTimeout(() => {
        if(!get(users[id], 'checkPing')) {
            socket.broadcast.emit(`user-destroy-${id}`);
            users[id] = {};
            return;
        }
        pingUser(socket, id);
    }, 5000);    
}

export function connect(server) {
    io = createSocket(server, { origin: ["*"] });
    io.on("connection", (socket) => {
        handleGame(socket);
    });
}
