class Value {
    #n;
    #oldC = [];
    color = 'white';

    constructor(n, algIndex) {
        this.algIndex = algIndex;
        this.#n = n;
    }

    #getFreq() {
        return minFreq + ((this.#n - rectWidth) / (maxHeight - rectWidth)) * (maxFreq - minFreq);
    }
    playTone() {
        soundManager.playTone(this.algIndex, this.#getFreq());
    }
    draw(i, y) {
        fill(this.color);
        stroke(0);
        rect(rectWidth*i + leftMargin, (y+1)*maxHeight-this.#n, rectWidth, this.#n);
    }
    tempColor(c) {
        this.#oldC.push(this.color);
        this.color = c;
    }
    resetColor() {
        if (this.#oldC.length == 0) {
            console.log('wtf!');
            return;
        }
        this.color = this.#oldC.pop();
    }
    async cmp(other) {
        await sleep(compDur);
        if (this.#n > other.#n) {
            return 1;
        } else if (this.#n == other.#n) {
            return 0;
        } else {
            return -1;
        }
    }
    async gt(other) {
        await sleep(compDur);
        return this.#n > other.#n;
    }
    getN() {
        return this.#n;
    }
}
