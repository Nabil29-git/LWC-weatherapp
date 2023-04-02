import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import CITY_UPDATED_CHANNEL from '@salesforce/messageChannel/CityUpdated__c';
import getCities from '@salesforce/apex/CityController.getUniqueBillingCities';

export default class MyComponent extends LightningElement {
    selectedCity;
    options = [];
    @wire(MessageContext)
    messageContext;

    handleCityChange(event) {
        this.selectedCity = event.target.value;
        const payload = { city: this.selectedCity };
        publish(this.messageContext, CITY_UPDATED_CHANNEL, payload);
    }

    @wire(getCities)
    wiredCities({ error, data }) {
        if (data) {
            this.options = data.map(city => {
                return { label: city, value: city };
            });
        } else if (error) {
            console.error(error);
        }
    }

    handleChange(event) {
        this.selectedCity = event.detail.value;
        const selectedEvent = new CustomEvent('cityselect', { detail: this.selectedCity });
        this.dispatchEvent(selectedEvent);
    }
}
