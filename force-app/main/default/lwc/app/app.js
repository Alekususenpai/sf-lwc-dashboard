import { LightningElement, track } from 'lwc';

// const URL = "https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/1/query?f=json&where=Confirmed%20%3E%200&outFields=Country_Region,Confirmed,Deaths,Recovered,Last_Update,Active&orderByFields=Confirmed%20desc"

export default class App extends LightningElement {
    obj = {
    total1: 343,
    total2: 454,
    total3: 765,
    total4: 234

}
    connectedCallback(){
        this.fetchData()
    }

    async fetchData(){
       // let response = await fetch(URL)
        //let data = await response.json()
       // this.obj.total += 6
        
    }
}