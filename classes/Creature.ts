let chalk = require('chalk'); // Needed for colored output

export class Creature {
    public fitness: number;
    public value = [];

    constructor(charPool: string[], length: number, dna = []) {
        if(dna.length == 0) {
            for(let i = 0; i < length; i++) {
                this.value[i] = charPool[this.getRandom(0, charPool.length-1)];
            }
        } else {
            this.value = dna;
        }
    }

    calculateFitness(target) {
        this.fitness = 0;
        for(let i = 0; i < target.length; i++) {
            if(target.substr(i, 1) == this.value[i]) {
                this.fitness++;
            }
        }
        this.fitness = Number((this.fitness/target.length).toFixed(2));
    }

    getRandom(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    mate(charPool, mutationRate, sexyPartner: Creature) {
        let childDNA = [];
        let breedType: number = this.getRandom(0, 2);
        if(breedType == 0) {
            for(let i = 0; i < this.value.length; i++) {
                if(this.getRandom(0,100) > mutationRate) {
                    if(i < Math.floor(this.value.length / 2)) {
                        childDNA[i] = this.value[i];
                    } else {
                        childDNA[i] = sexyPartner.value[i];
                    }
                } else {
                    childDNA[i] = charPool[this.getRandom(0, charPool.length-1)];
                }
            }
        }
        if(breedType == 1) {
            let currentParent: number = this.getRandom(0, 1);
            for(let i = 0; i < this.value.length; i++) {
                if(this.getRandom(0,100) > mutationRate) {
                    if(currentParent == 0) {
                        childDNA[i] = this.value[i];
                    } else {
                        childDNA[i] = sexyPartner.value[i];
                    }
                } else {
                    childDNA[i] = charPool[this.getRandom(0, charPool.length-1)];
                }
                currentParent++;
                if(currentParent == 2) {
                    currentParent = 0;
                }
            }
        }
        if(breedType == 2) {
            let singleParent: number = this.getRandom(0, 1);
            for(let i = 0; i < this.value.length; i++) {
                if(this.getRandom(0,100) > mutationRate) {
                    if(singleParent == 0) {
                        childDNA[i] = this.value[i];
                    } else {
                        childDNA[i] = sexyPartner.value[i];
                    }
                } else {
                    childDNA[i] = charPool[this.getRandom(0, charPool.length-1)];
                }
            }
        }
        return childDNA;
    }
}