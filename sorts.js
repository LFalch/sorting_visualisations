async function bubbleSort(values, start, end) {
    for (let e = end-1; e >= start; e--) {
        for (let i = 0; i < e; i++) {
            values[i].color = 'blue';
            if (await values[i].gt(values[i+1])) {
                await swap(values, i, i+1);
            }
            values[i].color = 'white';
        }
        values[e].color = 'green';
    }
}

async function selectionSort(values, start, end) {
    for (let i = start; i < end - 1; i++) {
        let jMin = i;
        values[jMin].color = 'blue';
        
        for (let j = i + 1; j < end; j++) {
            values[j].color = 'teal';
            if (await lt(values, j, jMin)) {
                values[jMin].color = 'white';
                jMin = j;
                values[jMin].color = 'blue';
            } else {
                values[j].color = 'white';
            }
        }
        
        if (jMin != i) {
            await swap(values, i, jMin);
        }
        values[i].color = 'green';
    }
    values[end-1].color = 'green';
}

async function insertionSort(values, start, end) {
    values[start].color = 'green';
    for (let i = start + 1; i < end; i++) {
        values[i].color = 'blue';
        let j;
        for (j = i; j > start; j--) {
            if (await values[j].gt(values[j - 1])) 
                break;
            await swap(values, j, j-1);
        }
        values[j].color = 'green';
    }
}

async function binaryInsertionSort(values, start, end) {
    values[start].color = 'green';
    for (let i = start + 1; i < end; i++) {
        values[i].color = 'yellow';
        const index = await binarySearch(values, start, i, values[i]);
        for (let j = i; j > index; j--) {
            await swap(values, j, j-1);
        }
        values[index].color = 'green';
    }
}

async function binarySearch(values, start, end, val) {
    while (start < end) {
        const mid = floor((start + end) / 2);
        values[mid].tempColor('blue');

        switch (await values[mid].cmp(val)) {
            case 0: return mid;
            case 1:
                end = mid;
                break;
            case -1:
                start = mid+1;
                break;
        }

        values[mid].resetColor();
    }
    return start;
}

async function mergeSort(values, start, end) {
    const len = end - start;
    
    if (len > 1) {
        const p = start + floor(len/2);
        
        for (let i = start; i < end; i++) {
            values[i].tempColor('yellow');
        }

        await mergeSort(values, start, p);
        await mergeSort(values, p, end);
        for (let i = start; i < p; i++) {
            values[i].color = 'blue';
        }
        for (let i = p; i < end; i++) {
            values[i].color = 'red';
        }

        await merge(values, start, p, end);

        for (let i = start; i < end; i++) {
            values[i].resetColor();
        }
    }
}

async function merge(values, start, p, end) {
    const startArr = values.slice(start, p);

    while (startArr.length > 0 || p < end) {
        if (startArr.length <= 0 || (p < end && (await startArr[0].gt(values[p])))) {
            await swap(values, start, p);
            p++;
        } else {
            await insert(values, start, startArr.shift());
        }
        values[start].color = 'grey';
        start++;
    }
}

async function mergeSortHybrid(values, start, end) {
    const len = end - start;

    if (len > 10) {
        const p = start + floor(len / 2);

        for (let i = start; i < end; i++) {
            values[i].tempColor('yellow');
        }

        await mergeSortHybrid(values, start, p);
        await mergeSortHybrid(values, p, end);
        for (let i = start; i < p; i++) {
            values[i].color = 'blue';
        }
        for (let i = p; i < end; i++) {
            values[i].color = 'red';
        }

        await merge(values, start, p, end);

        for (let i = start; i < end; i++) {
            values[i].resetColor();
        }
    } else {
        await insertionSort(values, start, end);
    }
}

async function mergeSortBinaryHybrid(values, start, end) {
    const len = end - start;

    if (len > 10) {
        const p = start + floor(len / 2);

        for (let i = start; i < end; i++) {
            values[i].tempColor('yellow');
        }

        await mergeSortBinaryHybrid(values, start, p);
        await mergeSortBinaryHybrid(values, p, end);
        for (let i = start; i < p; i++) {
            values[i].color = 'blue';
        }
        for (let i = p; i < end; i++) {
            values[i].color = 'red';
        }

        await merge(values, start, p, end);

        for (let i = start; i < end; i++) {
            values[i].resetColor();
        }
    } else {
        await binaryInsertionSort(values, start, end);
    }
}


async function quickSort(values, start, end) {
    const len = end - start;

    if (len > 1) {
        const p = await partition(values, start, end);
        values[p].tempColor('red');
        await quickSort(values, start, p);
        await quickSort(values, p+1, end);
        values[p].resetColor();
    }
}

async function quickSortHybrid(values, start, end) {
    const len = end - start;

    if (len > 10) {
        const p = await partition(values, start, end);
        values[p].tempColor('red');
        await quickSortHybrid(values, start, p);
        await quickSortHybrid(values, p + 1, end);
        values[p].resetColor();
    } else {
        await insertionSort(values, start, end);
    }
}

async function partition(values, start, end) {
    const pivot = values[end-1];
    pivot.tempColor('blue');

    let i = start;
    let j = end-1;

    // slightly bad
    while(j > i) {
        if (await values[i].cmp(pivot) < 1) {
            i++;
            continue;
        }

        if (await values[j-1].cmp(pivot) > -1) {
            j--;
            continue;
        }

        j--;

        values[i].color = 'yellow';
        values[j].color = 'yellow';
        
        await swap(values, i, j);
        i++;

        values[i-1].color = 'white';
        values[j].color = 'white';
    }

    await swap(values, j, end-1);

    pivot.resetColor();
    return j;
}


// Slow Sort with Insertion Sort hybrid
async function slowSort(values, start, end) {
    const len = end - start;

    if (len > 10) {
        const m = floor((start+end)/2);

        for (let i = start; i < m; i++) {
            values[i].color = 'blue';
        }
        for (let i = m; i < end; i++) {
            values[i].color = 'red';
        }

        await slowSort(values, start, m);
        for (let i = start; i < m; i++) {
            values[i].color = 'white';
        }
        await slowSort(values, m, end);
        for (let i = m; i < end; i++) {
            values[i].color = 'white';
        }
        if (await lt(values, end-1, m-1))
            await swap(values, end-1, m-1);
        values[end-1].color = 'lime';
        await slowSort(values, start, end-1);
    } else {
        await insertionSort(values, start, end);
    }
}

async function randomMergeSort(values, start, end) {
    if (end - start >= 1) {
        const split = start + floor(random(end-start));

        const randAlg1 = floor(random(algs.length));
        await (algs[randAlg1])(values, start, split);

        const randAlg2 = floor(random(algs.length));
        await (algs[randAlg2])(values, split, end);

        await merge(values, start, split, end);
    }
}