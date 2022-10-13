/** 
 * 利用队列和栈实现一个小猫钓鱼游戏
 * 规则如下
 * 小哼手中6张牌 2 4 1 2 5 6
 * 小哈手中6张牌 3 1 3 5 6 4
 * 依次出牌，当牌桌上出现相同牌面时出牌人取走相同牌面和牌面之间的牌依次插入自己的牌面
*/
class Queue {
    constructor() {
        this.head = 0;
        this.tail = 0;
        this.size = 100;
        this.data = new Uint8Array(new ArrayBuffer(this.size));
    }
    toString() {
        let data = [];
        for (let i = this.head; i < this.tail; i++) {
            data.push(this.data[i]);
        }
        return data;
    }
    add(data) {
        data.forEach((value) => {
            this.data[this.tail] = value;
            this.tail++;
        });
    }
    out() {
        let data = null;
        if (this.head <= this.tail) {
            data = this.data[this.head];
            this.head++;
        }
        return data;
    }
    read() {
        const data = [];
        for (let i = this.head; i < this.tail; i++) {
            data.push(this.data[i]);
        }
        return data;
    }
}
/** 
 * 实现一个简单的栈
*/
class Stack {
    constructor() {
        this.top = 0;
        this.size = 10;
        this.data = new Uint8Array(new ArrayBuffer(10));
    }
    toString() {
        let data = [];
        for (let i = 0; i < this.top; i++) {
            data.push(this.data[i]);
        }
        return data;
    }
    add(sum) {
        if (this.top < this.size) {
            this.data[this.top] = sum;
            this.top++;
        }
    }
    out(start) {
        let data = [];
        if (start) {
            for (let i = this.top - 1; i >= start; i--) {
                data.push(this.data[i]);
                this.top--;
            }
        } else {
            if (this.top > 0) {
                this.top--;
                data.push(this.data[this.top]);
            }
        }
        return data
    }
    verification(key) {
        let index = -1;
        for (let i = this.top - 1; i >= 0; i--) {
            if (this.data[i] === key) {
                index = i;
                break
            }
        }
        return index;
    }
}
class NpcUser {
    constructor(name) {
        this.name = name;
        this._queue = new Queue();
    };
    out() {
        return this._queue.out();
    }
    add(data) {
        this._queue.add(data);
    }
    surplus() {
        return this._queue.toString();
    }
    victory() {
        if (this._queue.tail === this._queue.head) {
            return true;
        }
        return false;
    }
    get queue() {
        return this._queue.read();
    }
}
function main() {
    let chip, stop = true;
    let usera = new NpcUser('小哼');
    let userb = new NpcUser('小哈');
    let stacks = new Stack();
    let testCard = (user, chip) => {
        let data, index;
        if (chip) {
            console.log(user.name, '出牌:', chip);
            index = stacks.verification(chip);
            stacks.add(chip);
            console.log('桌面牌面:', stacks.toString());
            if (index !== -1) {//历史栈出现过相同牌面
                data = stacks.out(index);
                console.log(user.name, '联牌出现:', data);
                user.add(data);
            }
            console.log(user.name, '手上的牌:', user.surplus());
        }
    }
    usera.add([2, 4, 1, 2, 5, 6]);
    userb.add([3, 1, 3, 5, 6, 4]);
    while (stop) {
        testCard(usera, usera.out());
        console.log('-----------------------------------');
        testCard(userb, userb.out());
        console.log('-----------------------------------');
        if (usera.victory()) {
            console.log(usera.name, '胜利');
            stop = false;
        }
        if (userb.victory()) {
            console.log(userb.name, '胜利');
            stop = false;
        }
    }
}
main();