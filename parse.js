
const cheerio = require('cheerio');
const request = require('request');

const parse = {}; 

let doc1 = 'https://www.sec.gov/Archives/edgar/data/1318605/000156459018026353/tsla-10q_20180930.htm'
let doc2 = 'https://www.sec.gov/Archives/edgar/data/789019/000156459019001392/msft-10q_20181231.htm'
let doc3 = 'https://www.sec.gov/Archives/edgar/data/320193/000032019319000010/a10-qq1201912292018.htm' 
let doc4 = 'https://www.sec.gov/Archives/edgar/data/77476/000007747618000055/pepsicoq2-10xq6162018.htm'

parse.getinfo = function(doc, callback) { 
    console.log(doc)
request(doc, function (error, response, body) {
    //data to return
    let data = {
        name: null,
        irs_id: null,
        netIncome: {},
        depreciation: {},
        total_liabilities: {},
        tca: {}
    };
    
    if(error == null){  
        let doc_body = body;

        const $ = cheerio.load(doc_body);
        trs = $('tr');
        tds = $('td');
        tables = $('table');
        ps = $('p');
        divs = $('div');

        //stuff to search through for name and id
        elements = [ps,divs, tds, trs, tables];
        table_elements = [tds, trs];

        //regexes for getting information
        let re_IRS = /^\d{2}-\d{7}$/;
        let re_neti = /[^\d\$\,\.]*$/;

        elements.map(e => {
            //go through each item

            $(e).each((i, o) => {
                //search for company name
                let testString = $(o).text();

                if(testString.toUpperCase().includes('INC.') && data.name == null){
                    data.name = testString.trim();
                }else if(testString.toUpperCase().includes('CORPORATION') && data.name == null){
                    data.name = testString.trim();
                }

                if($(o).get(0).tagName == 'table'){
                    let dates = []; 

                    $(o).children().children().each((i, o1) => {

                        //go through each table
                        let testString1 = String($(o1).text());
                        //console.log($(o1));

                        let date_re1 = /\d{1,2}\/\d{1,2}\/\d{4}/; 
                        
                        //get date headers for each table
                        let date = testString1.match(date_re1);
                        let date1 = testString1.match(/\b[12][0-9]{3}\b/);

                        //create dates
                        if((date != null || date1 != null) && dates.length == 0
                            ){
                            let dateSplit = testString1.replace(/[^0-9]/g, " ").trim().split(/[ ]+/);
                            dateSplit.forEach((i)=>{
                                if(i.length == 4)
                                    dates.push(i);
                            });
                        }
                        
                        //search for net income
                        if(testString1.toUpperCase().includes('NET INCOME') && Object.keys(data.netIncome).length == 0){
                            //trim string to be just number
                            let net_strings = testString1.replace(/[^0-9\,\. ]/g, " ").trim().split(/[ ]+/);
                            if(dates.length){
                                net_strings.forEach((i)=>{
                                    let index = Object.keys(data.netIncome).length;
                                    data.netIncome[dates[index]] = net_strings[index];
                                });
                            }
                        }
                        //search for depreciation
                        else if(testString1.toUpperCase().includes('DEPRECIATION') && Object.keys(data.depreciation).length == 0){
                            //trim string to be just number
                            let dep_strings = testString1.replace(/[^0-9\,\. ]/g, " ").trim().split(/[ ]+/);
                            if(dates.length){
                                dep_strings.forEach((i)=>{
                                    let index = Object.keys(data.depreciation).length;
                                    if(dates[index] && !isNaN(dep_strings[index][0]))
                                        data.depreciation[dates[index]] = dep_strings[index];
                                });
                            }
                        }
                        else if(testString1.toUpperCase().includes('TOTAL LIABILITIES') && Object.keys(data.total_liabilities).length == 0){
                            //trim string to be just number
                            let lia_strings = testString1.replace(/[^0-9\,\. ]/g, " ").trim().split(/[ ]+/);
                            if(dates.length){
                                lia_strings.forEach((i)=>{
                                    let index = Object.keys(data.total_liabilities).length;
                                    if(dates[index] && !isNaN(lia_strings[index][0]))
                                        data.total_liabilities[dates[index]] = lia_strings[index];
                                });
                            }
                        }
                        else if(testString1.toUpperCase().includes('TOTAL CURRENT ASSETS') && Object.keys(data.tca).length == 0){
                            //trim string to be just number
                            let tca_strings = testString1.replace(/[^0-9\,\. ]/g, " ").trim().split(/[ ]+/);
                            if(dates.length){
                                tca_strings.forEach((i)=>{
                                    let index = Object.keys(data.tca).length;
                                    if(dates[index] && !isNaN(tca_strings[index][0]))
                                        data.tca[dates[index]] = tca_strings[index];
                                });
                            }
                        }
                    });
                }

                //search for IRS number
                let irs_string = testString.match(re_IRS);
                if(irs_string != null && data.irs_id == null){
                    data.irs_id = irs_string[0];
                }

            });

        });

    }else{
        console.log("error: " + error);
    }

    console.log(data);

    return callback(data);
});
}

parse.getinfo(doc4, ()=>{});

module.exports = parse;