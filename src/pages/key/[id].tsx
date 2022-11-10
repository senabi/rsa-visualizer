import { Cryptokey, Pkeyvalues } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
// import * as Tabs from '@radix-ui/react-tabs';
// import './styles.css';

const TabsDemo = () => (
  <Tabs.Root className="TabsRoot" defaultValue="tab1">
    <Tabs.List className="TabsList" aria-label="Manage your account">
      <Tabs.Trigger className="TabsTrigger" value="tab1">
        Account
      </Tabs.Trigger>
      <Tabs.Trigger className="TabsTrigger" value="tab2">
        Password
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content className="TabsContent" value="tab1">
      <p className="Text">
        Make changes to your account here. Click save when you're done.
      </p>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="name">
          Name
        </label>
        <input className="Input" id="name" defaultValue="Pedro Duarte" />
      </fieldset>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="username">
          Username
        </label>
        <input className="Input" id="username" defaultValue="@peduarte" />
      </fieldset>
      <div
        style={{ display: "flex", marginTop: 20, justifyContent: "flex-end" }}
      >
        <button className="Button green">Save changes</button>
      </div>
    </Tabs.Content>
    <Tabs.Content className="TabsContent" value="tab2">
      <p className="Text">
        Change your password here. After saving, you'll be logged out.
      </p>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="currentPassword">
          Current password
        </label>
        <input className="Input" id="currentPassword" type="password" />
      </fieldset>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="newPassword">
          New password
        </label>
        <input className="Input" id="newPassword" type="password" />
      </fieldset>
      <fieldset className="Fieldset">
        <label className="Label" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input className="Input" id="confirmPassword" type="password" />
      </fieldset>
      <div
        style={{ display: "flex", marginTop: 20, justifyContent: "flex-end" }}
      >
        <button className="Button green">Change password</button>
      </div>
    </Tabs.Content>
  </Tabs.Root>
);

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
