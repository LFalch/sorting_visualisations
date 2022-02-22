// The algorithms shown in the view
const algs = [
    quickSortHybrid,
    quickSort,
    mergeSortBinaryHybrid,
    mergeSortHybrid,
    mergeSort,
    // binaryInsertionSort,
    insertionSort,
    selectionSort,
    // bubbleSort,
    randomMergeSort,
    // slowSort,
];

// Size of canvas
const w = 800, h = 600;

// Length of randomly generated array to show
const randomSetupLength = 150;

// ms of extra wait between every swap
let swapDur = 10;
// ms of extra wait between every comparison
let compDur = 0;