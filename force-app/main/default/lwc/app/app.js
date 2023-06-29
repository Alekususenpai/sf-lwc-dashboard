import { LightningElement, track } from "lwc";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";

//const previousMonthsURL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/2022-11-24/currencies/eur.json"

export default class App extends LightningElement {
  @track currencies;
  selectedOption = "eur";
  currencyStyle = " slds-col slds-p-around_small slds-m-around_small";
  dropdownOptions = [
    {
      label: "Euro",
      value: "eur",
      bg: "bg-primary" + this.currencyStyle
    },
    {
      label: "Macedonian denar",
      value: "mkd",
      bg: "bg-success" + this.currencyStyle
    },
    {
      label: "Colombian peso",
      value: "cop",
      bg: "bg-secondary" + this.currencyStyle
    },
    {
      label: "United States dollar",
      value: "usd",
      bg: "bg-warning" + this.currencyStyle
    }
  ];

  handleDropdownChange(event) {
    this.selectedOption = event.target.value;
  }

  connectedCallback() {
    this.fetchData();
  }

  renderedCallback() {
    this.fetchData();

    // if (this.chartInitialized) {
    //   return;
    // }
    // this.chartInitialized = true;

    // Promise.all([loadScript(this, "https://code.highcharts.com/highcharts.js")])
    //   .then(() => {
    //     this.initializeChart();
    //   })
    //   .catch((error) => {
    //     this.dispatchEvent(
    //       new ShowToastEvent({
    //         title: "Error loading D3",
    //         message: error.message,
    //         variant: "error"
    //       })
    //     );
    //   });
  }

  async fetchData() {
    try {
      const selectedOption = this.selectedOption;
      const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${selectedOption}.json`;
      
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1
      //const datesUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${}/currencies/${selectedOption}.json`
      console.log(month)

      
      const response = await fetch(apiUrl);
      const fetchedData = await response.json();
      
      const data = fetchedData[selectedOption];
      const currencies = this.dropdownOptions.reduce((result, obj) => {
          if (obj.value !== selectedOption) {
              result.push({
                  selected: obj.value,
                  currency: obj.label,
                  value: data[obj.value]
                });
            }
            return result;
      }, []);
      //this.currencies = currencies;
    } catch (error) {
      throw new Error("No data found");
    }
  }

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

  /***Creating the list of Country */
  generateCountryList(finalData) {
    this.countryList = Object.keys(finalData).map((item) => {
      return { label: item, value: item };
    });
  }

  /***Chart Initialization */
  initializeChart() {
    let container = this.template.querySelector(".chartContainer");
    Highcharts.chart(container, {
      chart: {
        type: "column"
      },
      title: {
        text: `COVID-19 in ${this.countrySelected}`
      },
      xAxis: {
        categories: ["Confirmed", "Active", "Recovered", "Deaths"]
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> <br/>'
      },
      legend: {
        enabled: false
      },

      series: [
        {
          name: `COVID-19 data of ${this.countrySelected}`,
          data: this.graphData
        }
      ]
    });
  }

  searchHandler(event) {
    let val = event.target.value
      ? event.target.value.trim().toLowerCase()
      : event.target.value;
    if (val.trim()) {
      let filterData = this.tableData.filter((item) => {
        let country = item.Country_Region
          ? item.Country_Region.toLowerCase()
          : item.Country_Region;
        return country.includes(val);
      });
      this.filteredtableData = [...filterData];
    } else {
      this.filteredtableData = [...this.tableData];
    }
  }
  /** Country list handler */
  handleCountryChange(event) {
    this.countrySelected = event.detail.value;
    this.triggerCharts();
  }
  /** Toggle view handler */
  listHandler(event) {
    this.defaultView = event.target.dataset.name;
    if (event.target.dataset.name === "LIST") {
      this.showListView = true;
      this.filteredtableData = [...this.tableData];
    } else {
      this.showListView = false;
      this.triggerCharts();
    }
  }
  /** Chart rending on toggle click */
  triggerCharts() {
    let country = this.tableData.filter((item) => {
      return item.Country_Region === this.countrySelected;
    });
    this.graphData = status.map((item) => {
      return { name: item, color: colors[item], y: country[0][item] };
    });
    //console.log(JSON.stringify(this.graphData));
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    window.setTimeout(() => {
      this.initializeChart();
    }, 1000);
  }
}
