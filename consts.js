// The algorithms shown in the view
const algs = [
    // goodSort,
    // betterSort,
    bestSort,
    quickSortHybrid,
    quickSort,
    mergeSortBinaryHybrid,
    mergeSortHybrid,
    mergeSort,
    binaryInsertionSort,
    insertionSort,
    selectionSort,
    bubbleSort,
    // slowSort,
    randomMergeSort,
    randomSort,
    randomSortLazy,
];

// Size of canvas
const w = 1000, h = 800;

// Length of randomly generated array to show
const randomSetupLength = 80;

// ms of extra wait between every swap
let swapDur = 10;
// ms of extra wait between every comparison
let compDur = 10;
