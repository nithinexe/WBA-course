import wallet from "../../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr"
import base58 from "bs58";

// Create a devnet connection

const umi = createUmi('https://api.devnet.solana.com');

const walletbase58 = base58.decode(wallet);
let keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(walletbase58)
  );
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        //2. Convert image to generic file.
        //3. Upload image

        const image = await readFile("/Users/sunny/projects/WBA/solana-starter/ts/cluster1/rugg.png")

        const genericFile = createGenericFile(image, 
            "rug",
            {contentType:"image/png"},
        );

        const [myUri] = await umi.uploader.upload(
            [genericFile]
        );
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
