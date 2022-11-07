import { Cryptokey, Pkeyvalues } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const KeyData: React.FC<{
  data: Cryptokey & { pKeyValues: Pkeyvalues | null };
}> = (props) => {
  console.log(props.data);
  return (
    <>
      <div className="whitespace-pre-wrap">{props.data.raw}</div>
      <div>{props.data.modulusLength}</div>
      <div>{props.data.publicExponent.toString()}</div>
      <div>{props.data.asymmetricKeyType}</div>
      <div>{props.data.type}</div>
      {props.data.pKeyValues !== null && (
        <>
          <div>{props.data.pKeyValues.privateExponent}</div>
          <div>{props.data.pKeyValues.firstPrimeFactor}</div>
          <div>{props.data.pKeyValues.secondPrimeFactor}</div>
          <div>{props.data.pKeyValues.firstExponent}</div>
          <div>{props.data.pKeyValues.secondExponent}</div>
          <div>{props.data.pKeyValues.coefficient}</div>
        </>
      )}
    </>
  );
};

const KeyPageContent: React.FC<{ id: string }> = (props) => {
  const { data, isLoading } = trpc.rsa.getOne.useQuery({ id: props.id });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>Key not found</div>;
  }
  return <KeyData data={data} />;
};

const KeyPage = () => {
  const { query } = useRouter();
  const { id } = query;
  if (!id || typeof id !== "string") {
    return <div>Invalid key id</div>;
  }
  return <KeyPageContent id={id} />;
};

export default KeyPage;
