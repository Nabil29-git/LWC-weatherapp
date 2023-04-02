public with sharing class CityController {
    @AuraEnabled (cacheable=true)
    public static List<String> getUniqueBillingCities() {
        Set<String> cities = new Set<String>();
       
        List<Account> accounts = [SELECT BillingCity FROM Account WHERE BillingCity != null];  
       
        for(Account acc : accounts) {
            cities.add(acc.BillingCity);
        }
        List<String> uniqueCities = new List<String>(cities);
        uniqueCities.sort();
        
        return uniqueCities;
    }
}

