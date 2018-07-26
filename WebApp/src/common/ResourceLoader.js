import {abilityList,cardList} from "../mockData/data";

class ResourceLoader{

    constructor(url) {
        this.url = url;
    }

    
    static getInstance(url='../mockData/data') {
        if(!this.instance) {
            this.instance = new ResourceLoader(url);
        }
        return this.instance;
    }

    

}