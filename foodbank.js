var sheet_id = '1ywAzEGnIrkPSlslY7MW86z7Pt41fb5ijN-8CawIxTfM';
var tab_id = 2;
var sold_jobs = [];

async function getGsheetData(sheetId, tabId) {
  // Steps to set this up
  // 1. publish all the sheets you want to get data from in gSheets
  // 2. allow links in the sharing properties
  // 3. retrieve the sheetId from the url
  //      - looks like this: '1qkR5ALHeEe8TKRBiiAiw_mFmhJ4HsNDPvgulL0ccGhM'
  // 4. determine the tabId. This should be an integer starting at 1
  //    in the order the tabs were created
    var nums = [];
    var url = `https://spreadsheets.google.com/feeds/cells/${sheetId}/${tabId}/public/values?alt=json`;
    var dt = [];
    var arr = {};
    await $.getJSON(url, function (data) {
        var entry = data.feed.entry;
        for (var i = 0; i < entry.length; i++) {
        let e = entry[i];
        let c = { row: getEntryRow(e), col: getEntryCol(e), val: e.content.$t };
        if (c.row == "1") {
            dt.push(c.val);
            arr[c.val] = [];
        } else {
            arr[dt[parseInt(c.col) - 1]].push(c.val);
        }
        }
    });
    let headers = Object.keys(arr)
    arr.headers = headers
    return arr;
}

function getEntryCol(entryItem) {
    return entryItem.gs$cell.col
}
function getEntryRow(entryItem) {
    return entryItem.gs$cell.row
}
function arrayTotal(array) {
    return array.reduce((a, b) => a + b)
}
function runningTotal(array) {
    let rt = []
    for (i in array) {
        if (i == 0) {
            rt[i] = array[i]
        } else {
            rt[i] = rt[i - 1] + array[i]
        }
    }
    return rt
}

function runningTotal(array) {
    let rt = []
    for (i in array) {
        if (i == 0) {
            rt[i] = parseInt(array[i])
        } else {
            rt[i] = rt[i - 1] + parseInt(array[i])
        }
    }
    return rt
}


getGsheetData(sheet_id, tab_id).then((data) => {
    var d = data['Sold Jobs']
    console.log('running total: ', runningTotal(d))
    var values_arry = runningTotal(d)

    var l = values_arry.length

    console.log(l)
    var current = values_arry[l-1]
    var day_before = values_arry[l - 2]
    var current_donations = 5000 + (current * 5)
    var today_add = (current - day_before) * 5
    var grocery_total = current_donations * 9

    $('#total_donation_text').html("$" + current_donations)
    $('#difference_text').html("$" + today_add)
    $('#grocery_text').html("$" + grocery_total)
})