'use strict'
const Table = require('cli-table');
const Handlebars = require('handlebars');
const table = new Table({
    head: ['Template Name', 'Owner/Name', 'Branch'],
    style: {
        head: ['green']
    }
});

module.exports = () => {
    // console.log("-----------", process.cwd());
    table.push(
        ['First value', 'Second value', 'ningxiao'], ['First value', 'Second value', 'ningxiao']
    );
    console.log(table.toString());
    var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
        "{{kids.length}} kids:</p>" +
        "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
    var template = Handlebars.compile(source);

    var data = {
        "name": "Alan",
        "hometown": "Somewhere, TX",
        "kids": [{ "name": "Jimmy", "age": "12" }, { "name": "Sally", "age": "4" }]
    };
    var result = template(data);
    console.log(result);
};