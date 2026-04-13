import algosdk from 'algosdk';

async function main() {
  const kmd = new algosdk.Kmd("a".repeat(64), "http://localhost", 4002);
  const wallets = (await kmd.listWallets()).wallets;
  if (!wallets || wallets.length === 0) throw new Error("No wallets found");
  
  const walletId = wallets[0].id;
  const handle = (await kmd.initWalletHandle(walletId, "")).wallet_handle_token;
  const addresses = (await kmd.listKeys(handle)).addresses;
  
  if (!addresses || addresses.length === 0) throw new Error("No addresses found");
  const defaultAddress = addresses[0];
  
  const privateKey = (await kmd.exportKey(handle, "", defaultAddress)).private_key;
  
  const b64 = Buffer.from(privateKey).toString('base64');
  console.log(`AVM_PRIVATE_KEY=${b64}`);
  console.log(`PAY_TO=${defaultAddress}`);
}

main().catch(console.error);
