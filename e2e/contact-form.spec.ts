import { expect, test, type Page, type Request } from "@playwright/test";

/**
 * Contact form security checks. These must run against a server started with
 * CONTACT_DRY_RUN=1 (no email is sent) and Cloudflare's Turnstile TEST keys:
 *
 *   build:  NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build
 *   run:    CONTACT_DRY_RUN=1 TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA \
 *             npx playwright test e2e/contact-form.spec.ts
 *
 * The "@captcha-fail" test instead needs the always-failing test secret:
 *   CONTACT_DRY_RUN=1 TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA \
 *     npx playwright test e2e/contact-form.spec.ts --grep @captcha-fail
 */

const DRY_RUN = process.env.CONTACT_DRY_RUN === "1";
const SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";
const PASS_SECRET = SECRET.startsWith("1x");
const FAIL_SECRET = SECRET.startsWith("2x");

test.skip(!DRY_RUN, "Refusing to run without CONTACT_DRY_RUN=1 (would send real email)");

const SUCCESS = /Message sent successfully/;

async function openForm(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("ggc-cookie-consent", "rejected");
    } catch {
      // iframe without storage access
    }
  });
  await page.goto("/contact");
  await expect(page.getByRole("button", { name: "Send Message" })).toBeVisible();
}

async function fill(page: Page, fields: { name: string; email: string; message: string }) {
  await page.locator("#name").fill(fields.name);
  await page.locator("#email").fill(fields.email);
  await page.locator("#message").fill(fields.message);
}

/** Wait until the form token and the Turnstile token are both ready. */
async function waitReady(page: Page) {
  await expect(page.getByRole("button", { name: "Send Message" })).toBeEnabled({ timeout: 30_000 });
}

async function submit(page: Page) {
  await page.getByRole("button", { name: "Send Message" }).click();
}

const status = (page: Page) => page.locator("form [class*='bg-green-50'], form [class*='bg-red-50']");

test.describe("contact form (dry run, Turnstile test keys)", () => {
  test.skip(!PASS_SECRET, "Needs TURNSTILE_SECRET_KEY=1x… (always-pass test secret)");

  test("validation, timing, replay, rate limit, missing captcha", async ({ page }) => {
    test.setTimeout(180_000);
    await openForm(page);

    // Capture the server action request so it can be replayed / tampered with.
    let actionRequest: Request | null = null;
    page.on("request", (request) => {
      if (request.method() === "POST" && request.headers()["next-action"] && request.postData()?.includes("_turnstileToken")) {
        actionRequest = request;
      }
    });

    // 1. Submitting right after the form loads is "too quickly"; a retry after
    //    waiting works without reloading the page.            (email count 1)
    await fill(page, { name: "QA Tester", email: "qa.dryrun@example.com", message: "First dry-run message." });
    await waitReady(page);
    await submit(page);
    await expect(status(page)).toContainText("too quickly");
    await page.waitForTimeout(5_500);
    await waitReady(page);
    await submit(page);
    await expect(status(page)).toContainText(SUCCESS);

    // 2. Validation: a one-letter name passes the browser but not the server.
    await fill(page, { name: "A", email: "qa.dryrun@example.com", message: "Hello, this is a dry-run test." });
    await waitReady(page);
    await page.waitForTimeout(5_500); // the token was refreshed after the success
    await submit(page);
    await expect(status(page)).toContainText("Name must be at least 2 characters");

    // 3. Invalid email the browser accepts (no TLD) is rejected by the server.
    await page.locator("#name").fill("QA Tester");
    await page.locator("#email").fill("qa@localhost");
    await waitReady(page);
    await submit(page);
    await expect(status(page)).toContainText("valid email");

    // 4. Missing Turnstile token (request tampered in flight) -> rejected.
    await page.locator("#email").fill("qa.dryrun@example.com");
    await waitReady(page);
    await page.route("**/contact", async (route) => {
      const request = route.request();
      if (request.method() === "POST" && request.headers()["next-action"]) {
        const body = (request.postData() ?? "").replace(/"_turnstileToken":"[^"]*"/, '"_turnstileToken":""');
        await route.continue({ postData: body });
        return;
      }
      await route.continue();
    });
    await submit(page);
    await expect(status(page)).toContainText("Security verification failed");
    await page.unroute("**/contact");

    // 5. Success with line breaks in the message.            (email count 2)
    actionRequest = null;
    await page.locator("#message").fill("Line one of the test.\nLine two of the test.");
    await waitReady(page);
    await submit(page);
    await expect(status(page)).toContainText(SUCCESS);

    // 6. Replaying that exact request is rejected (single-use form token).
    expect(actionRequest).not.toBeNull();
    const sent = actionRequest as unknown as Request;
    const replay = await page.request.post(sent.url(), {
      headers: sent.headers(),
      data: sent.postData() ?? "",
    });
    const replayText = await replay.text();
    expect(replayText).toContain("TOKEN_EXPIRED");
    expect(replayText).not.toContain('"success":true');

    // 7. Third message from the same email is allowed (count 3), the fourth
    //    is rate limited.
    await fill(page, { name: "QA Tester", email: "qa.dryrun@example.com", message: "Third dry-run message." });
    await waitReady(page);
    await page.waitForTimeout(5_500);
    await submit(page);
    await expect(status(page)).toContainText(SUCCESS);

    await fill(page, { name: "QA Tester", email: "qa.dryrun@example.com", message: "Fourth dry-run message." });
    await waitReady(page);
    await page.waitForTimeout(5_500);
    await submit(page);
    await expect(status(page)).toContainText("recently sent from this email");
  });

  test("honeypot and spam are rejected without sending", async ({ page }) => {
    test.setTimeout(90_000);
    await openForm(page);

    // Honeypot filled: bots get a fake success, nothing is sent.
    await fill(page, { name: "Bot Person", email: "honeypot.qa@example.com", message: "Totally legitimate message here." });
    await page.locator('input[name="_honey"]').fill("http://spam.example", { force: true });
    await waitReady(page);
    await page.waitForTimeout(5_500);
    await submit(page);
    await expect(status(page)).toContainText(SUCCESS);

    // Spam content: rejected, and the sender is then blocked for a while.
    await page.reload();
    await fill(page, {
      name: "WINNER WINNER",
      email: "test@spam-qa.example",
      message: "Congratulations! Click here for free money at the casino http://spam.example",
    });
    await waitReady(page);
    await page.waitForTimeout(5_500);
    await submit(page);
    await expect(status(page)).toContainText("could not be sent");

    await page.locator("#message").fill("A perfectly normal follow-up message.");
    await page.locator("#name").fill("Normal Name");
    await waitReady(page);
    await submit(page);
    await expect(status(page)).toContainText("could not be sent");
  });
});

test("captcha failure is rejected @captcha-fail", async ({ page }) => {
  test.skip(!FAIL_SECRET, "Needs TURNSTILE_SECRET_KEY=2x… (always-fail test secret)");
  test.setTimeout(90_000);
  await openForm(page);
  await fill(page, { name: "QA Tester", email: "captcha.qa@example.com", message: "Captcha failure dry-run test." });
  await waitReady(page);
  await page.waitForTimeout(5_500);
  await submit(page);
  await expect(status(page)).toContainText("Security verification failed");
});
