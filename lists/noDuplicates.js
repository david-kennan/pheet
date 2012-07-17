function(head, req) {
    var row, prevs = [];
    while (row = getRow()) {
        prevs.push(row.value);
    }
    prevs.sort();
    var last = '';
    for (var index = 0; index < prevs.length; index++) {
        if (prevs[index] != last) {
            last = prevs[index];
            send(prevs[index] + ',');
        }
    }
    send('\n');
}