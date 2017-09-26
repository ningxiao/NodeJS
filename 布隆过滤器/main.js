/**
 * 网络爬虫：URL去重策略之布隆过滤器算法
 * 默认数据
 * 00000000000000000000
 * 当我们对每个地址的每个字符哈希之后可以对应打入到每个点上
 * 对象A哈希值为 0，5，7     10000101000000000000
 * 对象B哈希值为 2，8，13    10100101100001000000
 * 对象C哈希值为 0，4，7     10101101100001000000
 * 其实就是将要对比的值哈希之后去比特数组里面对比是否每一位都是1如果是确定被使用过
 * 但是会存在部分误差数据 因为不同的元素经过哈希之后哈希值可能发生碰撞
 */
/**
 * java.util.BitSet;
 * 没有办法js弱啊只能够自己模拟一个
 */
class BitSet {
    constructor(bit) {
        //比特数组 并且全部赋值位0
        this.bits = new Uint8Array(bit);
    };
    set(index, v) {
        if (this.bits[index] != undefined) {
            this.bits[index] = Number(v);
        };
    };
    get(index) {
        return Boolean(this.bits[index]);
    };
    get size() {
        return this.bits.length;
    };
}
class SimpleHash {
    constructor(cap, seed) {
        //bitset容器
        this.cap = cap;
        //哈希种子
        this.seed = seed;
    };
    // hash函数，采用简单的加权和hash
    hash(value) {
        let result = 0;
        let len = value.length;
        for (let i = 0; i < len; i++) {
            result = this.seed * result + value.codePointAt(i);
        };
        return (this.cap - 1) & result;
    };

}
class BloomFilter {
    constructor() {
        let DEFAULT_SIZE = 1 << 24; //按位左移操作符后30位置补全为了其实就是生产一个大数
        /* 不同哈希函数的种子，一般应取质数 */
        let seeds = [5, 7, 11, 13, 31, 37, 61];
        this.bits = new BitSet(DEFAULT_SIZE);
        this.func = [];
        for (let i = 0; i < seeds.length; i++) {
            this.func[i] = new SimpleHash(DEFAULT_SIZE, seeds[i]);
        };
    };
    /**
     * 将字符串标记到bits中
     * @param {*} value 
     */
    add(value) {
        for (let f of this.func) {
            this.bits.set(f.hash(value), true);
        };
    };
    /**
     * 判断字符串是否已经被bits标记
     * @param {*} value 
     */
    contains(value) {;
        if (value == null) {
            return false;
        };
        let ret = true;
        for (let f of this.func) {
            ret = ret && this.bits.get(f.hash(value));
        };
        return ret;
    };
}
let bf = new BloomFilter();
bf.add("abcdefg");
bf.add("abcdefg1");
bf.add("abcdefg2");
bf.add("abcdefg3");
bf.add("abcdefg4");
bf.add("宁肖");
console.log(bf.contains("abcdefg4"));