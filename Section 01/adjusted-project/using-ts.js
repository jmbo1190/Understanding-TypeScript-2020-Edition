var button = document.querySelector("button");
var input1 = document.getElementById("num1"); // TS Type casting 
var input2 = document.getElementById("num2");
function add(num1 // type: number
, num2) {
    return num1 + num2;
}
button.addEventListener("click", function () {
    console.log(add(+input1.value, +input2.value));
});
