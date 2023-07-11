import { LightningElement } from "lwc";
import signinTemplate from "./signInTemplate.html";
import signupTemplate from "./signUpTemplate.html";
import defaultTemplate from "./multipleCompExample.html";
export default class multipleCompExample extends LightningElement {
  selected = null;
  render() {
    return this.selected === "Sign Up"
      ? signupTemplate
      : this.selected === "Sign In"
      ? signinTemplate
      : defaultTemplate;
  }
  handleClick(event) {
    this.selected = event.target.label;
  }
  submitHandler(event) {
    if (event.target.label === "Sign In") {
      console.log("Sign In Successfully");
    } else if (event.target.label === "Sign Up") {
      console.log("Sign Up Successfully");
    } else {
      console.log("Nesto drugo alternativno");
    }
  }
}
