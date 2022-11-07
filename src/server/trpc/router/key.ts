import { z } from "zod";
import { pemFileValidator } from "../../../shared/pem";
import { router, publicProcedure } from "../trpc";
import * as crypto from "crypto";

export const pemKeysRouter = router({
  addKey: publicProcedure.input(pemFileValidator).mutation(({ input, ctx }) => {
    let key: crypto.KeyObject | null = null;
    if (input.key.includes("PRIVATE KEY")) {
      key = crypto.createPrivateKey({ key: input.key, format: "pem" });
    }
    if (input.key.includes("PUBLIC KEY")) {
      key = crypto.createPublicKey({ key: input.key, format: "pem" });
    }
    if (key === null) {
      throw new Error("Invalid key format");
    }
    // const a = key.export({ format: "jwk" });
    const jwk = key.export({ format: "jwk" });
    console.log("\n\n\n\n\n\n\n", jwk);
    if (key.asymmetricKeyType !== "rsa") {
      throw new Error("Not a RSA key");
    }

    if (key.type === "private") {
      return ctx.prisma.cryptokey.create({
        data: {
          raw: input.key,
          type: key.type,
          asymmetricKeyType: key.asymmetricKeyType,
          modulusLength: key.asymmetricKeyDetails!.modulusLength!,
          publicExponent: key.asymmetricKeyDetails!.publicExponent!,
          pKeyValues: {
            create: {
              privateExponent: jwk.d,
              firstPrimeFactor: jwk.p,
              secondPrimeFactor: jwk.q,
              firstExponent: jwk.dp,
              secondExponent: jwk.dq,
              coefficient: jwk.qi,
            },
          },
        },
      });
    }

    return ctx.prisma.cryptokey.create({
      data: {
        raw: input.key,
        type: key.type,
        asymmetricKeyType: key.asymmetricKeyType,
        modulusLength: key.asymmetricKeyDetails!.modulusLength!,
        publicExponent: key.asymmetricKeyDetails!.publicExponent!,
      },
    });
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.cryptokey.findFirst({
        where: {
          id: input.id,
        },
        include: {
          pKeyValues: true,
        },
      });
    }),
});
