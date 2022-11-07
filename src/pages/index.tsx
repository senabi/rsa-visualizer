import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { PemFileValidator, pemFileValidator } from "../shared/pem";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const LoadRSAKeyForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PemFileValidator>({
    resolver: zodResolver(pemFileValidator),
  });

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" accept=".pem" {...register("key")} />
      <button type="submit">Load key</button>
    </form>
  );
};

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({
    text: `from tRPC`,
  });
  const examples = trpc.example.getAll.useQuery();
  return (
    <>
      <Head>
        <title>RSA Visualizer</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <p>{hello.data?.greeting}</p>
        {examples.data?.map((e) => (
          <p key={e.id}>{e.createdAt.toTimeString()}</p>
        ))}
        <LoadRSAKeyForm />
      </main>
    </>
  );
};

export default Home;
