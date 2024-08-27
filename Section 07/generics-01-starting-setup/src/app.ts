// Using decorators
// Requires setting "target": "es6" and "experimentalDecorators": true in tsconfig.json

// Decorators are functions, often named with a Captial first letter, e.g.: Logger
// Class Decorators take 1 argument, named 'target' or 'constructor' which is the class constructor function
function Logger(target: Function) {
    console.log("Logging...");
    console.log('target/constructor:', target);
}

@Logger
class Person {
    name = 'Jim';

    constructor(){
        console.log("Creating new Person Object...");
    }

}

// Decorators execute when a class is defined, NOT when it is instantiated.
console.log('About to instantiate the class Person...');
const pers = new Person();

console.log(pers);




// Decorator Factory that can take parameters
function LoggerFactory(logString: string) {
    console.log('Logger Factory executing...');
    return function(target: Function){
        console.log(logString);
        console.log('target/constructor:', target);
    }
}

@LoggerFactory("LOGGING - PERSON2:")
class Person2 {
    name = 'Joe';

    constructor(){
        console.log("Creating new Person2 Object...");
    }

}

// Decorators execute when a class is defined, NOT when it is instantiated.
console.log('About to instantiate the class Person2...');
const pers2 = new Person2();

console.log(pers2);

@LoggerFactory("-- LOGGING // PERSON3 // --")
class Person3 {
    name = 'Jack';

    constructor(){
        console.log("Creating new Person3 Object...");
    }

}

// Decorators execute when a class is defined, NOT when it is instantiated.
console.log('About to instantiate the class Person3...');
const pers3 = new Person3();

console.log(pers3);



function WithTemplate(template:string, hookId: string){
    console.log('WithTemplate Factory executing...');
    return function(constructor: any){   // Using _ as argument name tells typescript we are aware there is an argument
                                    // but we are not going to use it
        console.log('RENDERING With Template...');
        const elem = document.getElementById(hookId);
        if (elem) {
            elem.innerHTML = template;
            const para = document.createElement('p');
            const p = new constructor();
            console.log('p:', p);
            para.textContent = JSON.stringify(p);
            elem.appendChild(para);
        }
    }
}

@LoggerFactory("LOGGING - P4:")
@WithTemplate("<h1>My Person4 Object!</h1>", "app")
class Person4 {
    name = "Averell";
    constructor(){
        console.log('Creating a New Person4 instance...');
    }
}

console.log('About to instantiate the class Person4...');
const pers4 = new Person4();

console.log('pers4:', pers4);
