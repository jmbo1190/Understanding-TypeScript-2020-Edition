const button = document.querySelector("button");
const input1 = document.getElementById("num1")! as HTMLInputElement;  // TS Type casting ensures
const input2 = document.getElementById("num2")! as HTMLInputElement;  // the type of returned element

function add( num1: number  // type: number
            , num2: number
            ) {
  return num1 + num2;
}

button.addEventListener("click", function() {
  console.log(add(  +input1.value  // prepend '+' to convert strings to numbers
                  , +input2.value
                  ));
});

// To compile this .ts file to .js, use the TS Compiler in terminal:
//     tsc using.ts
