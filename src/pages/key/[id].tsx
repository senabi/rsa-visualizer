import { Cryptokey, Pkeyvalues } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

const KeyData: React.FC<{
  data: Cryptokey & { pKeyValues: Pkeyvalues | null };
}> = (props) => {
  console.log(props.data);
  return (
    <Tabs.Root className="" defaultValue="tab1">
      <Tabs.List className="" aria-label="Manage key">
        <Tabs.Trigger className="" value="tab1">
          Key
        </Tabs.Trigger>
        <Tabs.Trigger className="" value="tab2">
          Public Values
        </Tabs.Trigger>
        {props.data.pKeyValues ? (
          <Tabs.Trigger className="" value="tab3">
            Private Values
          </Tabs.Trigger>
        ) : null}
      </Tabs.List>
      <Tabs.Content value="tab1">
        <div className="whitespace-pre-wrap">{props.data.raw}</div>
      </Tabs.Content>
      <Tabs.Content className="flex flex-col gap-2" value="tab2">
        <div>Modulus {props.data.modulusLength}</div>
        <div>Public Exponent {props.data.publicExponent.toString()}</div>
        <div>Cryptographic algorithm {props.data.asymmetricKeyType}</div>
        <div>Type {props.data.type}</div>
      </Tabs.Content>
      {props.data.pKeyValues !== null && (
        <Tabs.Content className="flex flex-col gap-2" value="tab3">
          <div>Private Exponent {props.data.pKeyValues.privateExponent}</div>
          <div>First Prime Factor {props.data.pKeyValues.firstPrimeFactor}</div>
          <div>
            Second Prime Factor {props.data.pKeyValues.secondPrimeFactor}
          </div>
          <div>First Exponent {props.data.pKeyValues.firstExponent}</div>
          <div>Second Exponent {props.data.pKeyValues.secondExponent}</div>
          <div>Coefficient {props.data.pKeyValues.coefficient}</div>
        </Tabs.Content>
      )}
    </Tabs.Root>
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
