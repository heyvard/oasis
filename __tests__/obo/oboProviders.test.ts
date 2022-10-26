import { token } from "../__utils__/test-provider";
import { decodeJwt, OboProvider } from "../../lib";
import { errorAudience } from "../../lib/mocks/handlers";
import tokenX from "../../lib/obo-providers/tokenx";
import azureOBO from "../../lib/obo-providers/azure";

describe.each([
  ["tokenX", tokenX, "urn:tokenx:dings"],
  ["azure", azureOBO, "urn:azure:dings"],
])("%s", (_, oboProvider: OboProvider, issuer: string) => {
  it("returns token when exchanges succeeds", async () => {
    const jwt = await oboProvider(await token("pid"), "audience");
    expect(jwt).not.toBeNull();

    const payload = decodeJwt(jwt!);
    expect(payload.iss).toBe(issuer);
  });
  it("returns null when exchange fails", async () => {
    const jwt = await oboProvider(await token("pid"), errorAudience);
    expect(jwt).toBeNull();
  });
});
