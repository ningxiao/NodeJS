const crypto = require('crypto');
const hashmd5 = crypto.createHash('md5');
class ConsistentHashing {
    /**
     * 构造
     * @param array $nodes 初始化的节点列表
     */
    construct(nodes = []) {
        this._ring = [];
        this.nodes = [];
        this.virtual = 64;
    };
    time33(name) {
        let hash = 0;
        let seed = 5;
        let len = 32;
        let smd = hashmd5.update(name).digest('hex');
        for (let i = 0; i < len; i++) {
            hash = (hash << seed) + hash + smd[i].charCodeAt();
        };
        return hash & 0x7FFFFFFF;
    };
    /**
     * 增加节点
     * @param string $node 节点名称
     * @return object $this
     */
    addNode(node) {};
    /**
     * 获取字符串的HASH在圆环上面映射到的节点
     * @param  string $key
     * @return string $node
     */
    getNode(key) {};
    /**
     * 获取映射到特定节点的KEY
     * 此方法需手动调用，非特殊情况不建议程序中使用此方法
     * @param  string $node
     * @param  string $keyPre
     * @return mixed
     */
    getKey(node, keyPre = "") {};
    /**
     * 获取圆环内容
     * @return array $this->_ring
     */
    get Ring() {
        return this._ring;
    };
}
var hash_db = new ConsistentHashing();
console.log(hash_db.time33("45454"), "宁肖");