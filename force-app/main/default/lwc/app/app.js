import { LightningElement } from "lwc";
import main from "../main/main.html";
import sign from "../multipleCompExample/multipleCompExample.html";
import error from "./error.html";

export default class App extends LightningElement {
  test = "f";
  render() {
    return this.test === "main" ? main : this.test === "signup" ? sign : error;
  }
}
