# CLI Expense Tracker — Usage

Add an expense:

```powershell
npx ts-node index.ts add --description "Lunch" --amount 15
```

List expenses:

```powershell
npx ts-node index.ts list
```

Delete an expense by ID:

```powershell
npx ts-node index.ts delete --id 2
```

Summary (all time):

```powershell
npx ts-node index.ts summary
```

Summary for a month (1-12):

```powershell
npx ts-node index.ts summary --month 10
```

CSV note: header must be exactly `ID,Date,Description,Amount` (first line).

To run compiled JS instead of `ts-node`:

```powershell
npx tsc
node dist/index.js <command>
```

That's all — run the commands from the project root.
