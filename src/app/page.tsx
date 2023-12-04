import Image from "next/image";
import styles from "./page.module.css";
import { HypercertClient } from "@hypercerts-org/sdk";

export default async function Home() {
  const client = new HypercertClient({
    chain: { id: 5 }, // goerli testnet
  });

  const graph = client.indexer.graphClient;

  const res = await graph.RecentClaims({ orderDirection: "desc", first: 1 });

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
          style={{ marginRight: "1rem" }}
        />
        <p>
          <code style={{ fontSize: "40px" }}> + </code>
        </p>
        <Image
          src="/hypercerts_logo_green.png"
          alt="Hypercerts Logo"
          width={180}
          height={180}
          style={{ marginLeft: "1rem" }}
        />
      </div>

      <div>
        <code
          style={{
            fontSize: "20px",
            color: client ? "lightgreen" : "inherit",
          }}
        >
          {client
            ? "Client is connected in readonly mode"
            : "Client not in readonly mode"}
        </code>
      </div>

      {client && client.config ? (
        <div>
          <code
            style={{
              fontSize: "20px",
              color: client ? "lightgreen" : "inherit",
            }}
          >
            <table>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(client.config).map(([key, value]) => (
                  <tr key={key}>
                    <td
                      style={{
                        paddingRight: "1rem",
                      }}
                    >
                      {key}
                    </td>
                    <td style={{ color: "white" }}>
                      {value?.toString() || "undefined"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </code>
        </div>
      ) : undefined}

      {res && res.claims ? (
        <div style={{ paddingTop: "2rem" }}>
          <h2>Most recent claim</h2>
          <code
            style={{
              fontSize: "20px",
              color: client ? "lightgreen" : "inherit",
            }}
          >
            <table>
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(res.claims[0]).map(([key, value]) => (
                  <tr key={key}>
                    <td
                      style={{
                        paddingRight: "1rem",
                      }}
                    >
                      {key}
                    </td>
                    <td style={{ color: "white" }}>
                      {value?.toString() || "undefined"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </code>
        </div>
      ) : undefined}
    </main>
  );
}
