/** 
 * 冒泡排序 由高到低
 * 每一次排序只能将一个数据确定为最小并且归类到数组尾部
 * 所以第二次排序的时候不用循环到最后一个
*/
const Bubble = () => {
    const book = new Uint16Array([8, 100, 50, 22, 15, 6, 1, 1000, 999, 0]);
    const size = book.length;
    for (let i = 0; i < size; i++) {
        // 循环一次一个数归位最小而下一次就会减少一次比对
        for (let k = 0; k < size - i; k++) {
            if (book[k] < book[k + 1]) {
                [book[k + 1], book[k]] = [book[k], book[k + 1]];
            }
        };
    };
    console.log(book);
};
/** 
 * 快速排序
 * 以每一次查找基数为起点进行二次迭代
*/
const MaxSort = () => {
    const book = new Uint16Array([8, 100, 50, 22, 15, 6, 8, 7, 6, 99, 100, 999, 7, 4, 78, 90, 100, 1, 1000, 999, 0]);
    const size = book.length - 1;
    const quicksort = (left, right) => {
        let i, j, t, temp;
        if (left > right) {
            return;
        }
        temp = book[left];
        i = left;
        j = right;
        while (i != j) {
            while (book[j] >= temp && i < j) {
                j--;
            }
            while (book[i] <= temp && i < j) {
                i++;
            }
            if (i < j) {
                console.log(i, j, book[i], book[j]);
                [book[j], book[i]] = [book[i], book[j]];
            }
        }
        [book[left], book[i]] = [book[i], temp];
        quicksort(left, i - 1);
        quicksort(i + 1, right);
        return;
    }
    quicksort(0, size);
    console.log('排序结果', book);
    i = size;
    j = book[size];
    let list = [];
    while (i > 0) {
        i--;
        if (book[i] !== j) {
            list.unshift(book[i]);
            j = book[i];
        }
    };
    console.log('去重结果', list);
}
Bubble();
MaxSort();