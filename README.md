# Mortgage Refinancer

Calculate refinancing of fixed Danish Totalkredit mortgages with "installments"/afdrag.

Use on desktop, there's a lot of tables and numbers.
https://mathiastj.github.io/mortgage-refinancer/

To see an example of converting up from 1% to 4% interest check:
https://mathiastj.github.io/mortgage-refinancer/?example=1

To see an example of converting down from 4% to 2% interest check:
https://mathiastj.github.io/mortgage-refinancer/?example=2
## Motivation

I wanted to calculate the breakeven point of refinancing my mortgage. The Totalkredit app has a calculator, but it doesn't take into account [the extra 8% tax deduction of interest payments up to 50k/100k](https://skat.dk/data.aspx?oid=2047228). The loan offers sent from my bank did not take this into account either.

I started out with an Excel sheet, but figured this would be a fun little project, and I also think it gives a better overview.

## Technical motivation

I wanted to try out React Hooks and Tailwind CSS with a Next.js setup.

## Features

- Correctly use the 8% extra tax deduction on interest and "bidrag" payments. Takes into account whether the mortgage is financed by a single person or a couple.
- To correctly calculate the 8% extra tax deduction it's possible for the user to enter their other interest payments per year.
- Choose municipality for correct municipality and church tax.
- Shows breakeven point in years of when the principal of the new loan exceeds that of the old.
- Shows breakeven point of when monthly payments after taxes _in total_ for the new loan have exceeded that of the old.
- Shows breakeven point of when monthly payments after taxes for the new loan have exceeded that of the old for a year.
- Automatically calculates "bidragssats" (extra charges) for the new loan, based on estimated price of the house and the new loan amount.
- Show the price with or without "kundekroner", a discount on the "bidragssats" (extra charges).
- Easily compare old and new loan in two tables next to each other.

Here's a screenshot from desktop:
![image](https://user-images.githubusercontent.com/2278040/235747060-d47aed9a-f8f2-41c6-a5fc-32c5bea5e060.png)
