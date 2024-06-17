import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../../wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

const walletbase58 = base58.decode(wallet);
let keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(walletbase58)
  );
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    let tx = createNft(umi,
        {mint, 
        name:"nittsrug",
        symbol:"nrug",
        uri:" https://arweave.net/RMEqDct3k3N9yZpii2pZaCWooiiL7UYNVfyuvokwIPg",
        sellerFeeBasisPoints: percentAmount(5),
    }
        
        )
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();