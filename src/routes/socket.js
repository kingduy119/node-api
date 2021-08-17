import * as logger from "~/core/logger";
import * as _ from "lodash";
var io = null;

const gameW = 940;
const gameH = 640;

var timer = 0;
var stop = true;

var users = [];
var scores = [];
var items = [];

var totalUser = 0;
var totalItem = 0;

const MAX_ITEM = 1;

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

function spawnItem() {
    if(totalItem < MAX_ITEM) {
        let xy = randomItem();
        items = [...items, {
            ...xy,
            id: totalItem,
        }];
        totalItem += 1;
    }
}
spawnItem();
function randomItem() {
    let maxX = gameW / 2;
    let maxY = gameH / 2;
    let x = (Math.random() - 0.5) * 2 * maxX;
    let y = (Math.random() - 0.5) * 2 * maxY;
    return { x, y};
}

const getData = () => ({timer, users, scores, items});

export function connect(server) {
    io = require("socket.io")(server, {
        origins: ["*"]
    });
    
    io.on("connection", (socket) => {

        socket.emit("connect-success", getData());
        startTimer();

        // User
        socket.on('join', user => {
            // set ID for new user
            user.id = totalUser;
            users[totalUser] = user;
            
            totalUser++;

            // send new user connect
            socket.emit('user-init', user);

            // send all user
            socket.broadcast.emit('user-join', user);
        })
        socket.on("user-update", user => { users[user.id] = user; })
       
        // Item
        socket.on("item-gainscore", data => {
            let { user, item } = _.pick(data, ['user', 'item']);
            let post = randomItem();
            console.log(`${post.x} - ${post.y}`);
            items[item.id] = {...item, ...post};
        })

        // Game
        socket.on("game-update", data => {
            socket.emit("game-update", getData());
            socket.broadcast.emit("game-update", getData());
            // console.log(JSON.stringify(getData()));
        })

    });
}
