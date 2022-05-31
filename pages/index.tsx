import { token } from "../__tests__/__utils__/test-provider";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const testToken = await token("123");

  return {
    props: { testToken },
  };
};

interface IndexProps {
  testToken: string;
}

const isLocalhost = () =>
  typeof location !== "undefined" && location.host.includes("localhost");

const CurlForLocalhost = ({ token }: { token: string }) => {
  const [localhost, setLocalhost] = useState(false);

  useEffect(() => {
    if (isLocalhost()) setLocalhost(true);
  }, []);

  if (!localhost) return null;
  return (
    <>
      <h1>
        Use this command to test request to authenticated route for localhost
      </h1>
      <code>
        {/* eslint-disable react/no-unescaped-entities */}
        curl http://localhost:3000/closed -H "Authorization: Bearer {token}"
      </code>
      <style jsx>{`
        code {
          display: block;
          background: #eee;
          border: 1px solid #ccc;
          padding: 1em;
        }
      `}</style>
    </>
  );
};

export default function Index({ testToken }: IndexProps) {
  const doAuthenticatedRequest = async () => {
    const headers = isLocalhost()
      ? { authorization: `Bearer ${testToken}` }
      : undefined;
    const res = await fetch("/api/authenticated", {
      headers,
      redirect: "manual",
    });

    if (res.status == 200) alert(await res.text());
    if (res.status !== 200) alert("Not authenticated");
  };

  return (
    <>
      <h1>Index is open.</h1>

      <ul>
        <li>
          <Link href="/open">Navigate to open page</Link>
        </li>
        <li>
          <Link href="/closed">Navigate to closed page</Link>
        </li>
      </ul>

      <CurlForLocalhost token={testToken} />

      <h1>Perform authenticated API request</h1>
      <button onClick={doAuthenticatedRequest}>Perform API request</button>
    </>
  );
}
