async function bubbleSort(values, start, end) {
    for (let e = end-1; e >= start; e--) {
        for (let i = 0; i < e; i++) {
            values[i].color = 'blue';
            values[i + 1].playTone();
            if (await values[i].gt(values[i+1])) {
                await swap(values, i, i+1);
            }
            values[i].color = 'white';
        }
        values[e].playTone();
        values[e].color = 'green';
    }
}

async function selectionSort(values, start, end) {
    for (let i = start; i < end - 1; i++) {
        let jMin = i;
        values[jMin].color = 'blue';
        values[jMin].playTone();
        
        for (let j = i + 1; j < end; j++) {
            values[j].color = 'teal';
            values[j].playTone();
            if (await lt(values, j, jMin)) {
                values[jMin].color = 'white';
                jMin = j;
                values[jMin].color = 'blue';
                values[jMin].playTone();
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
    if (start >= end) return;
    values[start].color = 'green';
    for (let i = start + 1; i < end; i++) {
        values[i].color = 'blue';
        values[i].playTone();
        let j;
        for (j = i; j > start; j--) {
            values[j - 1].playTone();
            if (await values[j].gt(values[j - 1])) 
                break;
            await swap(values, j, j-1);
        }
        values[j].color = 'green';
    }
}

async function binaryInsertionSort(values, start, end) {
    if (start >= end) return;
    values[start].color = 'green';
    for (let i = start + 1; i < end; i++) {
        values[i].color = 'yellow';
        values[i].playTone();
        const index = await binarySearch(values, start, i, values[i]);
        const target = values[index];
        target.color = 'teal';
        target.playTone();
        for (let j = i; j > index; j--) {
            values[j - 1].playTone();
            await swap(values, j, j-1);
        }
        target.color = 'green';
        values[index].color = 'green';
    }
}

async function binarySearch(values, start, end, val) {
    while (start < end) {
        const mid = floor((start + end) / 2);
        values[mid].tempColor('blue');
        values[mid].playTone();

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
        values[start].playTone();
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
        values[p].playTone();
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
        values[p].playTone();
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
    pivot.playTone();

    let i = start;
    let j = end-1;

    // slightly bad
    while(j > i) {
        if (await values[i].cmp(pivot) < 1) {
            values[i].playTone();
            i++;
            continue;
        }

        if (await values[j-1].cmp(pivot) > -1) {
            values[j-1].playTone();
            j--;
            continue;
        }

        j--;

        values[i].color = 'yellow';
        values[j].color = 'yellow';
        values[j].playTone();
        
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
        if (await lt(values, end-1, m-1)) {
            values[m-1].playTone();
            await swap(values, end-1, m-1);
        }
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

async function reverseValues(values, start, end) {
    while (start < end) {
        values[start].playTone();
        await swap(values, start, end-1);
        start++;
        end--;
    }
}

async function goodSort(values, start, end) {
    while (end - start > 1) {
        const m = floor((start + end) / 2);
        await goodSort(values, start, m);
        await goodSort(values, m, end);
        values[start].color = 'blue';
        values[m-1].color = 'blue';
        values[m].color = 'blue';
        values[end-1].color = 'blue';
        await reverseValues(values, start, m);
        values[start].color = 'white';
        values[m-1].color = 'white';
        values[m].color = 'white';
        values[end-1].color = 'white';

        // Find greatest value
        values[start].playTone();
        if (await values[start].gt(values[end-1])) {
            values[end-1].playTone();
            await swap(values, start, end-1);
        }

        values[m-1].playTone();
        if (await lt(values, m-1, m)) {
            await swap(values, m-1, start);
        } else {
            await swap(values, m, start);
        }

        values[start].color = 'green';
        start++;
        end--;
        values[end].color = 'green';
    }
}

async function betterSort(values, start, end) {
    if (end - start <= 1) return;

    const m = floor((start + end) / 2);

    await betterSort(values, start, m);
    for (let i = start; i < m; i++) {
        values[i].color = 'blue';
    }
    await reverseValues(values, start, m);

    await betterSort(values, m, end);
    for (let i = m; i < end; i++) {
        values[i].color = 'teal';
    }

    while (end - start > 1) {
        // Find greatest value
        values[start].playTone();
        if (await values[start].gt(values[end - 1])) {
            values[end - 1].playTone();
            await swap(values, start, end - 1);
        }

        const greenSet = () => {
            values[start].color = 'green';
            start++;
            end--;
            values[end].color = 'green';
        }

        values[m - 1].playTone();
        if (await lt(values, m - 1, m)) {
            await swap(values, m - 1, start);

            greenSet();

            await betterSort(values, start+1, m);
            for (let i = start+1; i < m; i++) {
                values[i].color = 'blue';
            }
            await reverseValues(values, start+1, m);
        } else {
            values[m].playTone();
            await swap(values, m, start);

            greenSet();

            await betterSort(values, m, end-1);
            for (let i = m; i < end-1; i++) {
                values[i].color = 'teal';
            }
        }
    }
}

async function bestSort(values, start, end) {
    if (end - start <= 1) return;

    const m = floor((start + end) / 2);

    await bestSort(values, start, m);
    for (let i = start; i < m; i++) {
        values[i].color = 'blue';
    }

    await bestSort(values, m, end);
    for (let i = m; i < end; i++) {
        values[i].color = 'teal';
    }

    while (end - start > 1) {
        let resortLeft = false, resortRight = false;
        // Find greatest value
        values[start].playTone();
        if (await values[m-1].gt(values[end - 1])) {
            values[m-1].color = 'yellow';
            values[end-1].color = 'yellow';
            values[m - 1].playTone();
            await swap(values, m-1, end - 1);
            resortLeft = true;
        }
        // Find smallest value
        values[m].playTone();
        if (await values[start].gt(values[m])) {
            values[start].color = 'yellow';
            values[m].color = 'yellow';
            await swap(values, start, m);
            resortRight = true;
        }

        values[start].color = 'green';
        start++;
        end--;
        values[end].color = 'green';

        if (resortLeft && m-2 >= start && values[m-2].gt(values[m-1])) {
            await bestSort(values, start, m);
            for (let i = start; i < m; i++) {
                values[i].color = 'blue';
            }
        }
        if (resortRight && m+1 < end && values[m].gt(values[m+1])) {
            await bestSort(values, m, end);
            for (let i = m; i < end; i++) {
                values[i].color = 'teal';
            }
        }
    }
}

async function randomSort(values, start, end) {
    const lim = 2 * (end - start);
    
    for (let n = 0; n < lim; n++) {
        const i = start+floor(random(end-start-1));
        const j = i+1+floor(random(end-i-1));

        values[i].color = 'blue';
        values[j].color = 'blue';

        values[j].playTone();
        if (await gt(values, i, j)) {
            values[i].playTone();
            await swap(values, i, j);
            n = 0;
        }

        values[i].color = 'white';
        values[j].color = 'white';
    }

    // Check if it's sorted and quickly fix any minor mistakes
    await insertionSort(values, start, end);
}

async function randomSortLazy(values, start, end) {
    const lim = 1.5 * (end - start) * (Math.log2((end - start)) + 1);

    for (let n = 0; n < lim; n++) {
        const i = start + floor(random(end - start - 1));
        const j = i + 1 + floor(random(end - i - 1));

        values[i].color = 'blue';
        values[j].color = 'blue';

        values[j].playTone();
        if (await gt(values, i, j)) {
            values[i].playTone();
            await swap(values, i, j);
        }

        values[i].color = 'white';
        values[j].color = 'white';
    }

    // Check if it's sorted and quickly fix any minor mistakes
    await insertionSort(values, start, end);
}
