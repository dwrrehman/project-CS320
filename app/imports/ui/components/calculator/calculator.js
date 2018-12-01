import './calculator.html';
import '../../stylesheets/calculator.css';

var display_string = "";

function receive(string) {


  if (string == "store") {
    let bin_type = prompt("Specify the bin type: (variable/constant)", "variable");
    let given_name = prompt("Specify the name of the bin: ");

    let raw_data = document.getElementById("calculator_display").innerText;
    let num_data = Number(raw_data);
    if (isNaN(num_data)) {
      alert("cannot store: " + raw_data);
      return;
    }

    if (bin_type == "variable") {
      add_variable(given_name, num_data);
      alert("Stored Successfully");
    } else if (bin_type == "constant"){
      add_constant(given_name, num_data);
      alert("Stored Successfully");
    } else {
      alert("cannot use bin type: " + bin_type);
    }
    return;
  }

  else if (string == "load") {
    console.log("found load");

  }

  if (string.length == 1) {
    display_string += string;
  } else if (string == "clear"){
    display_string = "";
  } else {
    display_string = "";
  }
  document.getElementById("calculator_display").innerText = display_string;
}
