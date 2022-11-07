import { z } from "zod";

export const pemFileValidator = z.object({
  key:
    typeof window === "undefined"
      ? z.string()
      : z.instanceof(FileList).transform(async (fileList, ctx) => {
          const f = fileList.item(0);
          if (f === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "No file specified",
            });
            return z.NEVER;
          }
          const isPemFile = f.name.includes(".pem");
          if (!isPemFile) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Not a pem file",
            });
            return z.NEVER;
          }
          return await f.text();
        }),
});

export type PemFileValidator = z.infer<typeof pemFileValidator>;
