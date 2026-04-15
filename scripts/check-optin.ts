import algosdk from "algosdk";

const ALGOD_URL = "https://testnet-api.algonode.cloud";
const USDC_ID = 10458941;
const PAY_TO = "QZUNVQQ3T6TNOXUKZTEXZ4JJFFQ77AF5GKXUE2A43YC7FKXOLSBDI6O76Y";

async function check() {
  const client = new algosdk.Algodv2("", ALGOD_URL, "");
  try {
    const info = await client.accountAssetInformation(PAY_TO, USDC_ID).do();
    console.log(`Account ${PAY_TO} is opted into USDC. Balance: ${info['asset-holding'].amount}`);
  } catch (err: any) {
    if (err.message.includes("404")) {
      console.error(`Account ${PAY_TO} is NOT opted into USDC (Asset ID: ${USDC_ID})`);
    } else {
      console.error("Error checking asset info:", err.message);
    }
  }
}

check();
