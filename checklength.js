const hexString = "a30b1563a558dce05035ad51d9839711dee65eda9e9cd986c65f882c91cbd9e4";
const buffer = Buffer.from(hexString, 'hex');

console.log(`String: ${hexString}`);
console.log(`Length in characters: ${hexString.length}`);
console.log(`Length in bytes: ${buffer.length}`);