let data = [];

const maxHeight = h / algs.length;

let rectWidth = 10;

function setup() {
    createCanvas(w, h);
    let values = [];
    for (let i = 0; i < randomSetupLength; i++) {
        values[i] = random(rectWidth, maxHeight);
    }

    console.log(sortListsAsyncly(values));
}

function sorted(length) {
    const vals = [];
    for (let i = 0; i < length; i++) {
        vals[i] = i;
    }
    return normalise(vals);
}

function normalise(values) {
    const min = values.reduce((a, b) => Math.min(a, b));
    const max = values.reduce((a, b) => Math.max(a, b));

    return values.map(function (x) {
        return (x - min) / (max - min) * (maxHeight-rectWidth) + rectWidth;
    });
}

async function sortListsAsyncly(values) {
    rectWidth = width / values.length;

    data = [];

    algs.forEach(function (_) {
        data.push(values.map((n) => new Value(n)));
    });


    await Promise.all(algs.map((alg, i) => doAlg(alg, i).then(() => checkList(data[i]))));
}

async function checkList(values) {
    values.forEach((v) => v.color = 'grey');
    values[0].color = 'green';
    let i;
    for (i = 1; i < values.length; i++) {
        if (await values[i].gt(values[i-1])) {
            values[i].color = 'green';
        } else {
            values[i].color = 'red';
        }
    }
}

async function doAlg(alg, dataIndex) {
    await alg(data[dataIndex], 0, data[dataIndex].length);
    console.log(alg.name + ' finished!');
}

function draw() {
    background(20);
    data.forEach(function (values, i) {
        values.forEach(function (val, j) {
            val.draw(j, i);
        });
    });
}

function sleep(ms) {
    if (ms >= 0) {
        return new Promise(resolve => setTimeout(resolve, ms));
    } else {
        return (async () => {}) ()
    }
}

async function swap(values, i, j) {
    await sleep(swapDur);
    const temp = values[i];
    values[i] = values[j];
    values[j] = temp;
}

async function insert(values, i, v) {
    await sleep(swapDur);

    if (typeof v == 'object') {
        values[i] = v;
    } else
        values[i] = new Value(v);
}

async function gt(values, i, j) {
    return (await values[i].gt(values[j]));
}
async function lt(values, i, j) {
    return (await values[j].gt(values[i]));
}
