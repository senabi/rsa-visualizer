import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { PemFileValidator, pemFileValidator } from "../shared/pem";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";

type FileInputType = {
  name: keyof PemFileValidator;
  accept: string;
};

const FileInput: React.FC<FileInputType> = (props) => {
  const { name } = props;
  const { register, unregister, setValue, watch } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      console.log("\n\n\n\nonDrop", droppedFiles);
      // register("key").onChange();
      setValue(name, droppedFiles[0], { shouldValidate: true });
      setFileName(droppedFiles[0]!.name);
    },
    [setValue, name]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  useEffect(() => {
    console.log("useEffect ...register", name);
    register(name);
    return () => {
      console.log("useEffect ...unregister", name);
      setFileName(null);
      console.log("unregestering");
      unregister(name);
    };
  }, [name]);
  // }, [name, register, unregister]);
  return (
    <>
      <div
        {...getRootProps()}
        aria-label="File Upload"
        className="flex h-full w-full flex-col"
      >
        <input {...props} {...getInputProps()} />
        <div
          className={`flex h-full flex-col rounded-lg border-2 border-dashed border-white 
          border-opacity-20 bg-[var(--colors-loContrast)] p-4 shadow-2xl 
          hover:bg-[var(--colors-slate2)] ${
            isDragActive
              ? "border-[var(--colors-indigo9)] bg-[var(--colors-indigo4)]"
              : ""
          }`}
        >
          <div className="flex h-full items-center justify-center gap-2 text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="h-10 w-10 -rotate-45"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"
                fill="white"
              />
              <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="currentColor" />
            </svg>
            <div>
              Drag your RSA keys
              <p className="text-base text-[var(--colors-slate11)]">
                {fileName ?? "Public or private keys"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const LoadRSAKeyForm: React.FC = () => {
  const router = useRouter();
  const methods = useForm<PemFileValidator>({
    resolver: zodResolver(pemFileValidator),
  });
  console.log("errors...", methods.formState.errors["key"]);

  const rsaMutation = trpc.rsa.addKey.useMutation({
    onSuccess: (data) => {
      router.push(`/key/${data.id}`);
    },
  });

  const onSubmit = (data: PemFileValidator) => {
    console.log(">>>", data);
    rsaMutation.mutate({
      key: data.key,
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col items-center justify-center gap-4"
      >
        <FileInput accept=".pem" name="key" />
        <button
          className={`${
            rsaMutation.isLoading ? "pointer-events-none" : ""
          } flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2`}
          type="submit"
        >
          <svg
            className={`h-5 w-5 animate-spin ${
              !rsaMutation.isLoading ? "hidden" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          Analize key
        </button>
      </form>
    </FormProvider>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>RSA Visualizer</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex h-screen min-h-screen flex-col items-center p-4">
        <h1 className="w-4/5 content-start py-4 px-8 text-6xl font-medium sm:text-7xl">
          RSA <br />
          keys visualizer
        </h1>
        <div className="mb-auto mt-auto flex h-1/2 w-full items-center justify-center p-4 md:w-3/4">
          <LoadRSAKeyForm />
        </div>
      </main>
    </>
  );
};

export default Home;
