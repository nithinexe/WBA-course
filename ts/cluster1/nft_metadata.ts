import wallet from "../../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr"
import base58 from "bs58"

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
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://arweave.net/PcUySHt0l-mGyfwyMrfCYFF_olbuC2L8HImE1c7-B6E"
        const metadata = {
            name: "nittsrug", // fill all this data
            symbol: "nrug",
            description: "A rug from Nitt",
            image: "https://arweave.net/PcUySHt0l-mGyfwyMrfCYFF_olbuC2L8HImE1c7-B6E",
            attributes: [
                {trait_type: 'rectangle', value: 'true'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://arweave.net/PcUySHt0l-mGyfwyMrfCYFF_olbuC2L8HImE1c7-B6E"
                    },
                ]
            },
            creators: ['nitt']
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
