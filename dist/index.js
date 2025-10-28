"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const csv_parser_1 = require("csv-parser");
const csv_writer_1 = require("csv-writer");
const today = new Date().toISOString().slice(0, 10);
const writeCsv = (0, csv_writer_1.createObjectCsvWriter)({
    path: './expenses.csv',
    header: [{ id: 'id', title: 'ID' },
        { id: 'date', title: 'Date' },
        { id: 'description', title: 'Description', },
        { id: 'amount', title: 'Amount', }
    ]
});
const result = [];
const readExpense = () => {
    // resolve path explicitly so script works regardless of cwd
    const csvPath = path.resolve(process.cwd(), 'expenses.csv');
    fs.createReadStream(csvPath)
        .pipe((0, csv_parser_1.default)())
        .on('data', (row) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        // csv-parser uses header names from the CSV file. Map possible
        // header variants (e.g. "ID" / "id") to our `dataInterface` shape.
        const mapped = {
            id: Number((_b = (_a = row.ID) !== null && _a !== void 0 ? _a : row.id) !== null && _b !== void 0 ? _b : 0),
            date: String((_d = (_c = row.Date) !== null && _c !== void 0 ? _c : row.date) !== null && _d !== void 0 ? _d : ''),
            description: String((_f = (_e = row.Description) !== null && _e !== void 0 ? _e : row.description) !== null && _f !== void 0 ? _f : ''),
            amount: String((_h = (_g = row.Amount) !== null && _g !== void 0 ? _g : row.amount) !== null && _h !== void 0 ? _h : '')
        };
        result.push(mapped);
    })
        .on('end', () => {
        // now the stream finished and `result` contains parsed rows
        console.log(result);
    })
        .on('error', (err) => {
        console.error('Error reading CSV:', err);
    });
};
readExpense();
