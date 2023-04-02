import { LightningElement, wire, api } from 'lwc';
import CITY_UPDATED_CHANNEL from '@salesforce/messageChannel/City_Updated__c';
import { MessageContext, subscribe } from 'lightning/messageService';
const API_KEY = "152850933678b466213e8a88f4aa572a";

export default class WeatherDetails extends LightningElement {
    @api selectedCity;
    weather;
    error;
    city;
    subscription;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            CITY_UPDATED_CHANNEL,
            (message) => this.fetchWeather(message.city)
        );
    }

    fetchWeather(city) {
        this.city = city;
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data))
            .catch((error) => {
                console.error(error);
                this.error = error.message;
                this.weather = null;
            });
    }

    displayWeather(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        this.weather = { name, icon, description, temp, humidity, speed };
        this.error = null;
    }
}
