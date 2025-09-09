import {
  Account,
  Address,
  Asset,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export async function createToken() {
  console.log("Creating token...", process.env.MOTHER_SECRET);
  try {
    const server = new Horizon.Server("https://horizon-testnet.stellar.org"); // Use mainnet for production
    const issuerKeypair = Keypair.random(); // Generate a new keypair for the issuer
    //   const asset = new Asset("MYTOKEN", issuerKeypair.publicKey()); // Create the asset
    const motherKeypair = Keypair.fromSecret(
      "SDVA7BUJHQCOD6F24WITFMHLD3CZ67MKYADVV273GW6DGKJXDFGYNRRH",
    );

    // Build and submit a transaction to create the asset (e.g., by issuing to a distribution account)
    const account = await server.loadAccount(motherKeypair.publicKey());
    const transaction = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: Networks.TESTNET, // Use Networks.PUBLIC for mainnet
    })
      .addOperation(
        Operation.createAccount({
          destination: issuerKeypair.publicKey(),
          startingBalance: "2",
        }),
      )
      .setTimeout(30)
      .build();

    transaction.sign(issuerKeypair);

    const xdr = transaction.toXDR();
    console.log("xdr", xdr);
    return xdr;
  } catch (error) {
    console.log(error);
  }
  //   const result = await server.submitTransaction(transaction);
}
