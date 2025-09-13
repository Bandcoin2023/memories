import {
  Asset,
  Horizon,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export async function createToken({
  userPublicKey,
}: {
  userPublicKey: string;
}) {
  try {
    const server = new Horizon.Server("https://horizon-testnet.stellar.org");
    const issuerKeypair = Keypair.random();
    const asset = new Asset("VONGCONG", issuerKeypair.publicKey());
    const motherKeypair = Keypair.fromSecret(
      "SDVA7BUJHQCOD6F24WITFMHLD3CZ67MKYADVV273GW6DGKJXDFGYNRRH",
    );

    // Load mother account
    const motherAccount = await server.loadAccount(motherKeypair.publicKey());

    // Create issuer account and establish trust
    const transaction = new TransactionBuilder(motherAccount, {
      fee: "100",
      networkPassphrase: Networks.TESTNET,
    })
      // Create issuer account
      .addOperation(
        Operation.createAccount({
          destination: issuerKeypair.publicKey(),
          startingBalance: "2",
        }),
      )

      // User trusts the VONGCONG token
      .addOperation(
        Operation.changeTrust({
          asset: asset,
          source: userPublicKey,
        }),
      )
      .addOperation(
        Operation.payment({
          destination: userPublicKey,
          asset: asset,
          amount: "1000",
          source: issuerKeypair.publicKey(),
        }),
      )
      .setTimeout(30)
      .build();

    // transaction.sign(motherKeypair);
    transaction.sign(issuerKeypair);

    const xdr = transaction.toXDR();
    return xdr;
  } catch (error) {
    console.log(error);
  }
}
