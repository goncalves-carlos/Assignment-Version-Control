const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({
    extended:true

}))

const port = 3000

const path = require("path");

const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'vicente',
        password: 'student',
        database: 'restAPI'
    }
});

app.use(express.static('public'))

/**
 * @api {get} /index.html Main Page CRUD Operation
 * @apiGroup MainPage HTML
 * @apiSuccess {File} index.html Displays the main html file with the CRUD operations
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    Displays Page with CRUD operations
 * @apiErrorExample {json} index.html error
 *    HTTP/1.1 500 Internal Server Error
 */
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

/**
 * @api {post} /city_post_Create Creates a city if it does not exists
 * @apiGroup City Operation
 * @apiParam {String} name City Name
 * @apiParam {String} countryCode City CountryCode
 * @apiParam {String} district City District
 * @apiParam {Number} population City Population
 * @apiSuccess {Object[]} city City
 * @apiSuccess {Number} city.ID City ID
 * @apiSuccess {String} city.Name City Name
 * @apiSuccess {String} city.CountryCode Country Country Code
 * @apiSuccess {String} city.District City District
 * @apiSuccess {Number} city.Population Population
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 4080,
 *      "Name": "Belval",
 *      "CountryCode": "LUX"
 *      "District": "Luxembourg",
 *      "Population": "312"
 *    }]
 * @apiErrorExample {json} City error
 *    HTTP/1.1 500 Internal Server Error
 */
app.post('/city_post_Create', async (req, res) => {
    let response = {
        city_name: req.body.city_name,
        country_code: req.body.country_code,
        district: req.body.district,
        population: req.body.population,
    };
    console.log(response)
    const exists = await knex('city').where('Name', response.city_name)
    if (JSON.stringify(exists) != "[]") {
        return res.send("City " + response.city_name + " already exists!")
    }
    await knex('city')
        .insert({
            Name: response.city_name,
            CountryCode: response.country_code,
            District: response.district,
            Population: response.population
        })
    const result = await knex('city').where('Name', response.city_name)
    res.send(result)
})

/**
 * @api {get} /city_get List a city
 * @apiGroup City Operation
 * @apiParam {String} name City Name
 * @apiSuccess {Object[]} city City
 * @apiSuccess {Number} city.ID City ID
 * @apiSuccess {String} city.Name City Name
 * @apiSuccess {String} city.CountryCode Country Country Code
 * @apiSuccess {String} city.District City District
 * @apiSuccess {Number} city.Population Population
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 3003,
 *      "Name": "Caen",
 *      "CountryCode": "FRA"
 *      "District": "Basse-Normandie",
 *      "Population": "113987"
 *    }]
 * @apiErrorExample {json} City error
 *    HTTP/1.1 500 Internal Server Error
 */
app.get('/city_get', async (req, res) => {
    let response = {
        city_name: req.query.city_name,
    };
    console.log(response)
    const result = await knex('city').where('Name', response.city_name)
    res.send(result)
})

/**
 * @api {post} /city_update Updates a city
 * @apiGroup City Operation
 * @apiParam {String} name City Name
 * @apiParam {String} countryCode City CountryCode
 * @apiParam {String} district City District
 * @apiParam {Number} population City Population
 * @apiSuccess {Object[]} city City
 * @apiSuccess {Number} city.ID City ID
 * @apiSuccess {String} city.Name City Name
 * @apiSuccess {String} city.CountryCode Country Country Code
 * @apiSuccess {String} city.District City District
 * @apiSuccess {Number} city.Population Population
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      "id": 4080,
 *      "Name": "Belval",
 *      "CountryCode": "LUX"
 *      "District": "Luxembourg",
 *      "Population": "500"
 *    }]
 * @apiErrorExample {json} City error
 *    HTTP/1.1 500 Internal Server Error
 */
app.post('/city_update', async (req, res) => {
    let response = {
        city_name: req.body.city_name,
        country_code: req.body.country_code,
        district: req.body.district,
        population: req.body.population,
    };
    if (!(response.country_code.length == 0) && !(response.district.length == 0) && !(response.population.length == 0)) {
        await knex('city')
            .where('Name', response.city_name)
            .update({
                Name: response.city_name,
                CountryCode: response.country_code,
                District: response.district,
                Population: response.population
            })
            .then(function (data) {
                console.log(data)
            })
    } else if (response.country_code.length == 0 && response.district.length == 0 && response.population.length == 0) {
        res.send("Please fill the entries")
    } else if (response.country_code.length == 0 && response.district.length == 0 && !(response.population.length == 0)) {
        await knex('city')
            .where('Name', response.city_name)
            .update({Name: response.city_name, Population: response.population})
            .then(function (data) {
                console.log(data)
            })
    } else if (response.country_code.length == 0 && !(response.district.length == 0) && response.population.length == 0) {
        await knex('city')
            .where('Name', response.city_name)
            .update({Name: response.city_name, District: response.district})
            .then(function (data) {
                console.log(data)
            })
    } else if (response.country_code.length == 0 && !(response.district.length == 0) && !(response.population.length == 0)) {
        await knex('city')
            .where('Name', response.city_name)
            .update({Name: response.city_name, District: response.district, Population: response.population})
            .then(function (data) {
                console.log(data)
            })
    } else if (!(response.country_code.length == 0) && response.district.length == 0 && response.population.length == 0) {
        await knex('city')
            .where('Name', response.city_name)
            .update({Name: response.city_name, CountryCode: response.country_code})
            .then(function (data) {
                console.log(data)
            })
    } else if (!(response.country_code.length == 0) && response.district.length == 0 && !(response.population.length == 0)) {
        await knex('city')
            .where('Name', response.city_name)
            .update({Name: response.city_name, CountryCode: response.country_code, Population: response.population})
            .then(function (data) {
                console.log(data)
            })
    } else if (!(response.country_code.length == 0) && !(response.district.length == 0) && response.population.length == 0) {
        await knex('city')
            .where('Name', response.city_name)
            .update({Name: response.city_name, CountryCode: response.country_code, District: response.district})
            .then(function (data) {
                console.log(data)
            })
    }

    console.log(response)
    const result = await knex('city').where('Name', response.city_name)
    res.send(result)
})

/**
 * @api {post} /city_del Deletes a city
 * @apiGroup City Operation
 * @apiParam {String} name City Name
 * @apiSuccess {Boolean} city City city removed successfully
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [{
 *      true,
 *    }]
 * @apiErrorExample {json} City error
 *    HTTP/1.1 500 Internal Server Error
 */
app.post('/city_del', async (req, res) => {
    let response = {
        city_name: req.body.city_name,
    };
    console.log(response)
    const result = await knex('city').where('Name', response.city_name).del()
    res.send(JSON.stringify((result == 0) ? false : true))
})

app.listen(port, () => {
    console.log('Example app listening at http://localhost: 3000.')
})