import { LightningElement, track } from "lwc";
//import { loadStyle, loadScript } from "lightning/platformResourceLoader";

//const previousMonthsURL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/2022-11-24/currencies/eur.json"

export default class Main extends LightningElement {
  @track currencies;
  @track dates;
  selectedOption = "eur";
  selectedAmount = 1;
  currencyStyle = " slds-col slds-p-around_small slds-m-around_small";

  dropdownOptions = [
    {
      idx: 1,
      label: "Euro",
      value: "eur",
      bg: "bg-primary" + this.currencyStyle
    },
    {
      idx: 2,
      label: "Macedonian denar",
      value: "mkd",
      bg: "bg-success" + this.currencyStyle
    },
    {
      idx: 3,
      label: "Colombian peso",
      value: "cop",
      bg: "bg-secondary" + this.currencyStyle
    },
    {
      idx: 4,
      label: "United States dollar",
      value: "usd",
      bg: "bg-warning" + this.currencyStyle
    },
    {
      idx: 5,
      label: "Japanese yen",
      value: "jpy",
      bg: "bg-info" + this.currencyStyle
    },
    {
      idx: 6,
      label: "Pound sterling",
      value: "gbp",
      bg: "bg-danger" + this.currencyStyle
    },
    {
      idx: 7,
      label: "Australian dollar",
      value: "aud",
      bg: "bg-light" + this.currencyStyle
    },
    {
      idx: 8,
      label: "Canadian dollar",
      value: "cad",
      bg: "bg-warning" + this.currencyStyle
    },
    {
      idx: 9,
      label: "Australian dollar",
      value: "aud",
      bg: "bg-primary" + this.currencyStyle
    },
    {
      idx: 10,
      label: "Swiss franc",
      value: "chf",
      bg: "bg-secondary" + this.currencyStyle
    },
    {
      idx: 11,
      label: "Bitcoin",
      value: "btc",
      bg: "bg-success" + this.currencyStyle
    },
    {
      idx: 12,
      label: "Etherium classic",
      value: "etc",
      bg: "bg-primary" + this.currencyStyle
    }
  ];

  // lifecycle methods
  connectedCallback() {
    this.fetchData();
    this.fetchDates();
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

  // Getters
  get isListSelected() {
    return this.isListShown ? "active" : "";
  }

  get isChartSelected() {
    return !this.isListShown ? "active" : "";
  }

  // Function checkers
  isListShown = true;

  showList(event) {
    if (event.target.dataset.name !== "LIST") {
      this.isListShown = false;
    } else {
      this.isListShown = true;
    }
  }

  // Handlers
  handleDropdownChange(event) {
    this.selectedOption = event.target.value;
  }
  handleInputChange(event) {
    if (isNaN(event.target.value)) {
      this.selectedAmount = 1;
    } else {
      this.selectedAmount = event.target.value;
    }
  }

  // functions
  fetchDates() {
    const currentDate = new Date();

    function dataGenerator(date) {
      const currentYear = date.getFullYear();
      const currentMonth = String(date.getMonth() + 1).padStart(2, "0");
      const currentDay = String(date.getDate()).padStart(2, "0");
      return `${currentYear}-${currentMonth}-${currentDay}`;
    }

    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const one = dataGenerator(oneYearAgo);
    const six = dataGenerator(sixMonthsAgo);
    const three = dataGenerator(threeMonthsAgo);

    const dates = {
      oneYearAgo: one,
      sixMonthsAgo: six,
      threeMonthsAgo: three
    };

    this.dates = dates;
  }

  async fetchData() {
    try {
      const selectedOption = this.selectedOption;
      const dates = this.dates;
      const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${selectedOption}.json`;

      const oneYearUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${dates.oneYearAgo}/currencies/${selectedOption}.json`;
      const sixMonthsUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${dates.sixMonthsAgo}/currencies/${selectedOption}.json`;
      const threeMonthsUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${dates.threeMonthsAgo}/currencies/${selectedOption}.json`;

      const urls = [oneYearUrl, sixMonthsUrl, threeMonthsUrl, apiUrl];

      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const jsonResponses = await Promise.all(
        responses.map((response) => response.json())
      );

      const data = jsonResponses.map((item) => {
        return { keys: item.date, item: item[selectedOption] };
      });

      const testfunc = function (dataset, index, obj) {
        if (
          dataset[index].item[obj.value] - dataset[index + 1].item[obj.value] >
          0.05
        ) {
          return "bg-danger";
        }
        return "bg-success";
      };
      
      const currencies = this.dropdownOptions.reduce((result, obj, index) => {
        if (obj.value !== selectedOption) {
          result.push({
            index: index,
            currency: obj.value,
            name: obj.label,
            value: data.map((el, indx) => {
              const trendColor = testfunc(data, index, obj);
              const updatedValue = (
                el.item[obj.value] * this.selectedAmount
              ).toFixed(4);


              return {
                index: indx,
                currency: obj.value,
                date: el.keys,
                value: updatedValue,
                trendColor: trendColor
              };
            })
          });
        }
        return result;
      }, []);

      //console.log(currencies);
      this.currencies = currencies;
    } catch (error) {
      throw new Error("No data found");
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
