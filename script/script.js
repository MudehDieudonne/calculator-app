const display = document.querySelector('.display') // Use correct selector
const buttons = document.querySelectorAll(`button`) // Select all buttons
const spacialChars = ["%", "*", "/", "-", "+", "="]; // Define special characters
let output = ""; // Use `let` for a mutable variable

// Define functions to calculate based on button clicks
const calculate = (btnValue) => {
  if (btnValue === "=" && output !== "") {
    // If "%" is involved, handle percentage calculation
    output = output.includes("%")
      ? eval(output.replace("%", "/100")) // Safely handle percentages
      : eval(output); // Evaluate expression
  } else if (btnValue === "AC") {
    output = ""; // Clear output
  } else if (btnValue === "Del") {
    output = output.toString().slice(0, -1); // Delete last character
  } else {
    // Prevent starting with a special character
    if (output === "" && spacialChars.includes(btnValue)) return;
    output += btnValue; // Append the button value
  }
  display.value = output; // Update the display
};

// Add event listener to buttons
buttons.forEach((button) => {
  button.addEventListener("click", (e) => calculate(e.target.value));
});
