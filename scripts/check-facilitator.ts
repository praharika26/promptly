import algosdk from "algosdk";

const ALGOD_URL = "https://testnet-api.algonode.cloud";
const MNEMONIC = "toy inherit clever cave skirt alcohol flight muscle congress viable label aim great cycle easily palace blame crash endless marble pause category tissue absent one";

async function check() {
  const client = new algosdk.Algodv2("", ALGOD_URL, "");
  const account = algosdk.mnemonicToSecretKey(MNEMONIC);
  const address = account.addr;
  console.log("Facilitator Address:", address);
  
  try {
    const info = await client.accountInformation(address).do();
    console.log(`Facilitator Balance: ${Number(info.amount) / 1_000_000} ALGO`);
  } catch (err: any) {
    console.error("Error checking facilitator info:", err.message);
  }
}

check();
