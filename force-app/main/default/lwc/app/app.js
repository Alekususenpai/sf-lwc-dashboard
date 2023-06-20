import { LightningElement, track } from "lwc";

// const URL = ""

export default class App extends LightningElement {
  obj = {
    total1: 343,
    total2: 454,
    total3: 765,
    total4: 234,
    total5: 634,
    total6: 534
  };
  connectedCallback() {
    this.fetchData();
  }

  async fetchData() {
    // let response = await fetch(URL)
    //let data = await response.json()
  }

  @track data = false;

  // Getters

  get isListSelected() {
    return this.isListShown ? "active" : "";
  }

  get isChartSelected() {
    return !this.isListShown ? "active" : "";
  }

  // Variable to keep track of the default view
  isListShown = true;

  showList(event) {
    if (event.target.dataset.name !== "LIST") {
      this.isListShown = false;
    } else {
      this.isListShown = true;
    }
  }
}
