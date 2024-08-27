// Code goes here!
// function merge(a: object, b: object){
//     return Object.assign(a, b);
// }

// console.log(merge({name: "Jim"}, {age: 50}));

// const mergedObj = merge({name: "Jim"}, {age: 50});
// console.log(mergedObj.name);  // error: Property 'name' does not exist on type 'object'.

// Generic types without constraints - not specific enough
function merge2<T, U>(a: T, b: U): T & U {
    return Object.assign({}, a, b);
}

console.log(merge2({name: "Jim"}, {age: 50}));

const mergedObj2 = merge2({name: "Jim", hobbies: ['Sports']}, 50);  // ok!
console.log(mergedObj2);
console.log(mergedObj2.name);

// Setting constraints on our generic types: Any objects - specific enough
function merge3<T extends {}, U extends object>(a: T, b: U): T & U {
    return Object.assign(a, b);
}

const mergedObj3 = merge3({name: "Jim", hobbies: ['Sports']}, {name: 'Max', age: 50}); // ok!
console.log(mergedObj3);
console.log(mergedObj3.name);

// const mergedObj3b = merge3({name: "Jim", hobbies: ['Sports']}, 50); // error TS2345: Argument of type 'number' is not assignable to parameter of type 'object'.





interface Lengthy {
    length: number;
}

function countAndDescribe(arg: Lengthy) {
    let descr = "Got no value.";
    if (arg.length === 1) {
        descr = "Got "+arg.length+" element.";
    }
    if (arg.length > 1) {
        descr = "Got "+arg.length+" elements.";
    }
    return [arg, descr];
} 

console.log(countAndDescribe(''));
console.log(countAndDescribe('Hello Typescript!'));
console.log(countAndDescribe([]));
console.log(countAndDescribe(['Hello Typescript!', 'Hi JavaScript!!']));




function countAndDescribe2<T extends Lengthy>(arg: T): [T, string] {
    let descr = "Got no value.";
    if (arg.length === 1) {
        descr = "Got "+arg.length+" element.";
    }
    if (arg.length > 1) {
        descr = "Got "+arg.length+" elements.";
    }
    if (arg.length < 0) {
        descr = "Got invalid number of elements.";
    }
    return [arg, descr];
} 

console.log(countAndDescribe2(''));
console.log(countAndDescribe2('Hello Typescript!'));
console.log(countAndDescribe2({message: 'Hello Typescript!', length: -3}));
console.log(countAndDescribe2([]));
console.log(countAndDescribe2([0]));
const cd = countAndDescribe2(['Hello Typescript!', 'Hi JavaScript!!'])
console.log(cd[1].split(' '));
// console.log(countAndDescribe2(0)); // error TS2345: Argument of type 'number' is not assignable to parameter of type 'Lengthy'.




function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U){
    return 'Value: ' + obj[key];
}

console.log(extractAndConvert({name:'JM', sex:'M'}, 'sex'));
// console.log(extractAndConvert({name:'JM', sex:'M'}, 'ex')); // error TS2345: Argument of type '"ex"' is not assignable to parameter of type '"name" | "sex"'.

