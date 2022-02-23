// The algorithms shown in the view
const algs = [
    quickSortHybrid,
    quickSort,
    mergeSortBinaryHybrid,
    mergeSortHybrid,
    mergeSort,
    binaryInsertionSort,
    insertionSort,
    selectionSort,
    bubbleSort,
    slowSort,
    randomMergeSort,
];

// Size of canvas
const w = 1000, h = 800;

// Length of randomly generated array to show
const randomSetupLength = 200;

// ms of extra wait between every swap
let swapDur = 7;
// ms of extra wait between every comparison
let compDur = 1;