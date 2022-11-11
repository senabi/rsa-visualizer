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
    <div className="flex h-screen w-screen items-center justify-center">
      <Tabs.Root
        className="flex h-1/2 w-1/2 flex-col rounded-lg bg-[var(--colors-loContrast)] shadow-2xl"
        defaultValue="tab1"
      >
        <Tabs.List
          className="flex select-none justify-evenly gap-2 border-b-2 border-[var(--colors-slate4)] p-1 text-lg"
          aria-label="Manage key"
        >
          <Tabs.Trigger
            className="w-full rounded hover:bg-[var(--colors-slate3)] active:bg-[var(--colors-slate3)]"
            value="tab1"
          >
            Key
          </Tabs.Trigger>
          <Tabs.Trigger
            className="w-full rounded hover:bg-[var(--colors-slate3)] active:bg-[var(--colors-slate3)]"
            value="tab2"
          >
            Public Values
          </Tabs.Trigger>
          {props.data.pKeyValues ? (
            <Tabs.Trigger
              className="w-full rounded hover:bg-[var(--colors-slate3)] active:bg-[var(--colors-slate3)]"
              value="tab3"
            >
              Private Values
            </Tabs.Trigger>
          ) : null}
        </Tabs.List>
        <Tabs.Content
          value="tab1"
          className="overflow-x-auto overflow-y-hidden p-4 hover:overflow-y-auto inactive:hidden"
        >
          <div className="whitespace-pre-wrap">{props.data.raw}</div>
        </Tabs.Content>
        <Tabs.Content
          className="flex flex-col gap-4 p-5 inactive:hidden"
          value="tab2"
        >
          <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
            <div className="font-semibold">Modulus</div>
            <div className="pt-1">{props.data.modulusLength}</div>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
            <div className="font-semibold">Public Exponent</div>
            <div className="pt-1">{props.data.publicExponent.toString()}</div>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
            <div className="font-semibold">Cryptographic algorithm</div>
            <div className="pt-1">{props.data.asymmetricKeyType}</div>
          </div>
          <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
            <div className="font-semibold">Type</div>
            <div className="pt-1">{props.data.type}</div>
          </div>
        </Tabs.Content>
        {props.data.pKeyValues !== null && (
          <Tabs.Content
            className="flex flex-col gap-4 overflow-hidden break-words bg-scroll p-5 hover:overflow-y-auto hover:pr-[15px] inactive:hidden"
            value="tab3"
          >
            <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
              <div className="font-semibold">Private Exponent</div>
              <div className="pt-1">
                {props.data.pKeyValues.privateExponent}
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
              <div className="font-semibold">First Prime Factor</div>
              <div className="pt-1">
                {props.data.pKeyValues.firstPrimeFactor}
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
              <div className="font-semibold">Second Prime Factor</div>
              <div className="pt-1">
                {props.data.pKeyValues.secondPrimeFactor}
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
              <div className="font-semibold">First Exponent</div>
              <div className="pt-1">{props.data.pKeyValues.firstExponent}</div>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
              <div className="font-semibold">Second Exponent</div>
              <div className="pt-1">{props.data.pKeyValues.secondExponent}</div>
            </div>
            <div className="flex flex-col gap-1 rounded-lg bg-[var(--colors-slateA3)] p-3 text-[var(--colors-slateA12)]">
              <div className="font-semibold">Coefficient</div>
              <div className="pt-1">{props.data.pKeyValues.coefficient}</div>
            </div>
          </Tabs.Content>
        )}
      </Tabs.Root>
    </div>
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
