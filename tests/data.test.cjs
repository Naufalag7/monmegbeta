'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../script.js'),'utf8').replace(/\nboot\(\);\s*$/, '\n');
const sandbox = vm.createContext({console});
vm.runInContext(source+'\nglobalThis.exposed={parseCSV,parseFeed,parseAmount,parseDate,makeDate,budgetFor,sum,money};',sandbox);
const x = sandbox.exposed;

test('CSV preserves quoted commas, escaped quotes and line endings',()=>{
  const rows = x.parseCSV('A,B,C\r\n"Hi, Lily","She said ""yay""",3\r\n');
  assert.equal(rows.length,2);
  assert.deepEqual(Array.from(rows[1]),['Hi, Lily','She said "yay"','3']);
});
test('Indonesian dates and invalid calendar days',()=>{
  assert.equal(x.parseDate('08/11/2026'),'2026-11-08');
  assert.equal(x.parseDate('8 November 2026'),'2026-11-08');
  assert.equal(x.parseDate('2026-02-30'),null);
  assert.equal(x.makeDate(2024,2,29),'2024-02-29');
});
test('Rupiah whole number parsing protects invalid amounts',()=>{
  assert.equal(x.parseAmount('Rp 45.000'),45000);
  assert.equal(x.parseAmount('-'),null);
  assert.equal(x.parseAmount('0'),null);
  assert.equal(x.money(200000),'Rp 200.000');
});
test('Each Sheet profile is isolated; finance math matches visible totals',()=>{
  const csv='2026-11-08,Pengeluaran,45000,Makan siang,lily\n2026-11-07,Pemasukan,200000,Gaji,lily\n2026-11-06,Tabungan,20000,Tabungan,lily\n2026-11-05,Pengeluaran,14000,Minum kopi,lily\n2026-11-04,Pengeluaran,10000,Makan,nopal';
  const lily=x.parseFeed(csv,'lily');const nopal=x.parseFeed(csv,'nopal');
  assert.equal(lily.length,4);assert.equal(nopal.length,1);
  assert.equal(x.sum(lily,'Pemasukan'),200000);
  assert.equal(x.sum(lily,'Pengeluaran'),59000);
  assert.equal(x.sum(lily,'Tabungan'),20000);
  assert.equal(x.sum(lily,'Pemasukan')-x.sum(lily,'Pengeluaran')-x.sum(lily,'Tabungan'),121000);
  assert.equal(x.budgetFor(lily.find(r=>r.note==='Makan siang')),'makan');
  assert.equal(x.budgetFor(lily.find(r=>r.note==='Gaji')),null);
});
test('empty valid published CSV does not imply fabricated money',()=>{
  assert.equal(x.parseFeed('Tanggal,Jenis,Nominal,Keterangan,Profil','lily').length,0);
});
