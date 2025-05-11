let data = [];

const maxHeight = h / algs.length;

let rectWidth = 10;

function setup() {
    createCanvas(w, h);
    let values = [];
    for (let i = 0; i < randomSetupLength; i++) {
        values[i] = i / randomSetupLength * (maxHeight-rectWidth) + rectWidth;
    }
    values = shuffle(values);

    console.log(sortListsAsyncly(values));
}

async function sortListsAsyncly(values) {
    rectWidth = (width - leftMargin) / values.length;

    data = [];

    algs.forEach(function (_, i) {
        data.push(values.map((n) => new Value(n, i)));
    });


    await Promise.all(algs.map((alg, i) => doAlg(alg, i)));
}

async function doAlg(alg, dataIndex) {
    const vals = data[dataIndex];

    await alg(vals, 0, vals.length);
    console.log(alg.name + ' finished!');

    // check if it's right
    vals.forEach((v) => v.color = 'grey');
    vals[0].color = 'green';
    let i;
    for (i = 1; i < vals.length; i++) {
        if (await vals[i].gt(vals[i - 1])) {
            vals[i].color = 'green';
        } else {
            vals[i].color = 'red';
        }
    }
}

function draw() {
    background(20);
    data.forEach(function (values, i) {
        values.forEach(function (val, j) {
            val.draw(j, i);
        });
    });
    // Draw sound toggle buttons and labels.
    for (let i = 0; i < algs.length; i++) {
        const x = 10;
        const y = i * maxHeight + (maxHeight - buttonHeight) / 2;
        noStroke();
        fill(soundManager.isEnabled(i) ? 'green' : 'red');
        rect(x, y, buttonWidth, buttonHeight);
        stroke(0);
        strokeWeight(2);
        fill('white');
        textSize(12);
        text(algs[i].name, x + buttonWidth + 5, y + buttonHeight - 5);
        strokeWeight(1);
        noStroke();
    }
}

function mousePressed() {
    for (let i = 0; i < algs.length; i++) {
        const x = 10;
        const y = i * maxHeight + (maxHeight - buttonHeight) / 2;
        if (mouseX >= x && mouseX <= x + buttonWidth && mouseY >= y && mouseY <= y + buttonHeight) {
            if (soundManager.isEnabled(i)) {
                soundManager.disable(i);
            } else {
                soundManager.enable(i);
            }
        }
    }
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
        values[i] = new Value(v, values[i].algIndex);
}

async function gt(values, i, j) {
    return (await values[i].gt(values[j]));
}
async function lt(values, i, j) {
    return (await values[j].gt(values[i]));
}
