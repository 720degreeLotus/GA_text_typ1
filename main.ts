import { Config } from './classes/Config';
import { Creature } from './classes/Creature';
import { Population } from './classes/Population';

let chalk = require('chalk'); // Needed for colored output
let term = require( 'terminal-kit' ).terminal ; 
chalk.reset();

let config: Config = new Config();

config.target = "project works just great";
config.mutationRate = 1;
config.charSet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "_", "?", ".", ",", " "];
config.populationLimit = 5000;
config.allowImpossibleToFinish = false;

if(config.validate() == false) {
    process.exit();
}

let headerData: string[] = [];
headerData[0] = chalk.green.bold("-- ") + "Configuration is valid :)"
headerData[1] = chalk.yellow.bold("::: ") + "Author: 720degreeLotus" + chalk.yellow.bold(" ::: ");
headerData[2] = chalk.yellow.bold("::: ") + "Project: Genetic algorithm to evolve to specific texthprase" + chalk.yellow.bold(" ::: ");
headerData[3] = "";

for(let c of headerData) {
    term(c);
    term.nextLine(1);
}
term("Duration (seconds): ");
term.nextLine(1);
term("Generation: ");
term.nextLine(1);
term("Best score: ");
term.nextLine(1);
term("Best creature: ");

let timer: Date = new Date(Date.now());
let myPopulation = new Population(config.target, config.charSet, config.mutationRate, config.populationLimit, true);
let oldTimer = Math.floor((Date.now() - timer.valueOf())/1000).toString();
let validation = false;
while(validation == false) {
    let oldTargetValue: string = myPopulation.bestTarget;
    let oldTargetScore: number = myPopulation.bestScore;
    
    myPopulation.calculateFitness();
        
    if(oldTimer != Math.floor((Date.now() - timer.valueOf())/1000).toString()) {
        term.moveTo(21,headerData.length + 1);
        term(Math.floor((Date.now() - timer.valueOf())/1000).toString());
        oldTimer = Math.floor((Date.now() - timer.valueOf())/1000).toString();
    }
    term.moveTo(13,headerData.length + 2);
    term(myPopulation.generation);
    if(myPopulation.bestScore != oldTargetScore) {
        term.moveTo(13,headerData.length + 3);
        let out: string = "";
        let percentage: number = Math.round(myPopulation.bestScore * 100);

        out += percentage + " % ";
        for(let i = 0; i < Math.round(percentage/2); i++) {
            out += chalk.green.bold("#");
        }
        if(percentage != 100) {
            for(let i = 0; i < 50-(Math.round(percentage/2)); i++) {
                out += chalk.yellow.bold("-");
            }
        }
        term(out);
    }
    if(myPopulation.bestTarget != oldTargetValue) {
        term.moveTo(16,headerData.length + 4);
        term(myPopulation.outputColoredBestTarget());
    }

    if(myPopulation.validate()) {
        validation = true;
    } else {
        myPopulation.fillMatePool();
        myPopulation.breedNewGeneration(config.charSet, config.mutationRate);
    }
   myPopulation.generation++;
}












