import * as path from 'path'
import * as fs from 'fs'
import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import {Command} from 'commander'

interface dataInterface{
    id:number,
    date:string,
    description:string,
    amount:number
}

const today = new Date().toISOString().slice(0, 10);

const writeCsv = createObjectCsvWriter({
    path:'./expenses.csv',
    header:[{id:'id',title:'ID'},
           { id:'date', title: 'Date' },
           { id:'description', title: 'Description', },
           { id:'amount', title: 'Amount', }
    ],
    append:true
})

const result:dataInterface[] = []

const readExpense = (): Promise<dataInterface[]> => {
    return new Promise((resolve, reject) => {
        const result: dataInterface[] = [];
        fs.createReadStream('expenses.csv')
            .pipe(csvParser({
                headers: ['id', 'date', 'description', 'amount'],
                skipLines: 1
            }))
            .on('data', (row) => {
                const expense: dataInterface = {
                    id: row.id ,
                    date: row.date,
                    description: row.description,
                    amount: row.amount
                };
                result.push(expense);
            })
            .on('end', () => resolve(result))
            .on('error', reject);
    });
};


 async function addExpense(description:string,amount:number){
     const expenses = await readExpense()
     const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
     writeCsv.writeRecords([{
        id: newId,
        date: today,
        description: description,
        amount: amount
    }])

}
 async function listExpenses(){
    const expenses = await readExpense()
    if (expenses.length===0){
        console.log('No expenses yet')
        return
    }
    expenses.forEach(e =>{
        console.log(`${e.id.toString().padEnd(3)} ${e.date.padEnd(10)} ${e.description.padEnd(12)} $${e.amount}`)
    })
 }


async function deleteExpense(idToDelete: number) {
    const expenses = await readExpense();
    const filtered = expenses.filter(e => e.id !== idToDelete);
    if (filtered.length === expenses.length) {
        console.log(` Expense with ID ${idToDelete} not found.`);
        return;
    }

    const writeCsv = createObjectCsvWriter({
        path: 'expenses.csv',
        header: [
            { id: 'id', title: 'ID' },
            { id: 'date', title: 'Date' },
            { id: 'description', title: 'Description' },
            { id: 'amount', title: 'Amount' },
        ],
        append: false 
    });

    await writeCsv.writeRecords(filtered);
    console.log(`Expense with ID ${idToDelete} deleted successfully.`);
}



async function sumAllExpenses(){
   const expenses = await readExpense()
   const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
   console.log(`Total expenses: $${total}`);
}



const program = new Command()

program
.command('add')
.requiredOption('--description <description>',"Expense description")
.requiredOption('--amount <amount>',"Expense amount")
.action(async (options)=>{
    const { description, amount } = options;
    await addExpense(description, Number(amount));
    console.log('Added successfully')
})

program
.command('list')
.description('list all the expenses')
.action(async () => {
    await listExpenses()});
    

program
.command('delete')
.requiredOption('--id <id>',"id")
.description('delete expense')
.action(async (opts) => {
    await deleteExpense(opts.id)
    });

program
.command('summary')
.option('--month <month>', "month")
.description('sum the expenses')
.action(async (opts) => {
    const expenses = await readExpense()
    let filtered = expenses
    if(opts.month){
        filtered =  expenses.filter(e =>{
            const month = new Date(e.date).getMonth() + 1;
            return month === +opts.month;
        })
    } 
    const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);
    if (opts.month) {
        console.log(`Total expenses for month ${opts.month}: $${total}`);
    } else {
        console.log(`Total expenses: $${total}`);
    }

    
});









program.parse(process.argv);
