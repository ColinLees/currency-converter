const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    const response = await axios.get('http://data.fixer.io/api/latest?access_key=f68b13604ac8e570a00f7d8fe7f25e1b&format=1');

    const rate = response.data.rates;
    const euro = 1 / rate[fromCurrency];
    const exchangeRate = euro * rate[toCurrency];

    if(isNaN(exchangeRate)) {
        throw new Error (`Unable to get currency ${fromCurrency} and ${toCurrency}`)
    }

    return exchangeRate;
}

const getCountries = async (toCurrency) => {
    try {
        const response = await axios.get(`http://restcountries.eu/rest/v2/currency/${toCurrency}`);

        return response.data.map(country => '\n' + country.name);
    } catch (error) {
        throw new Error(`Unable to get counrites that use ${toCurrency}`)
    }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const countries = await getCountries(toCurrency);
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.\nYou can spend these in the following countries: ${countries}`;
}

convertCurrency('GBP', 'EUR', 206)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message);
    });