import { expect, test } from "@playwright/test";

test("company carousel preserves clicks and swipe navigation on mobile", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  // Record a cookie choice up front so the fixed consent banner doesn't sit
  // over the carousel and swallow the touch events. "rejected" also keeps
  // analytics from loading during the test.
  // (Init scripts also run in iframes, where storage may be off-limits.)
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("ggc-cookie-consent", "rejected");
    } catch {
      // not our document
    }
  });
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    const optimizedSource = url.pathname === "/_next/image" ? url.searchParams.get("url") : null;
    if (url.origin !== "http://127.0.0.1:3100" || optimizedSource?.startsWith("http")) {
      await route.abort();
      return;
    }
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const cdp = await page.context().newCDPSession(page);

  const surface = page.getByTestId("company-carousel-surface");
  const swipeRegion = page.getByTestId("company-carousel-swipe-region");
  const track = page.getByTestId("company-carousel-track");
  await expect(surface).toBeVisible();
  await expect(surface).toHaveAttribute("data-hydrated", "true", { timeout: 30_000 });
  await expect(page.getByRole("link", { name: "Explore Guardium Towing" })).toBeVisible();
  await surface.scrollIntoViewIfNeeded();

  const initialTransform = await track.evaluate((element) => getComputedStyle(element).transform);
  await page.getByRole("button", { name: "Next" }).click();
  await expect(surface).toHaveAttribute("data-current-index", "1");
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(surface).toHaveAttribute("data-current-index", "0");
  expect(pageErrors).toEqual([]);
  const bounds = await swipeRegion.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) return;

  const y = bounds.y + Math.min(bounds.height / 2, 180);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: bounds.x + bounds.width * 0.8, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: bounds.x + bounds.width * 0.25, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

  await expect(page).toHaveURL(/\/$/);
  await expect(surface).toHaveAttribute("data-current-index", "1");
  // Wait for the spring animation to settle before recording the position
  // (reading it mid-animation gives an in-between value).
  const readTransform = () => track.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(async () => {
      const before = await readTransform();
      await page.waitForTimeout(150);
      return before !== initialTransform && before === (await readTransform());
    })
    .toBe(true);
  const advancedTransform = await readTransform();

  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: bounds.x + bounds.width * 0.5, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: bounds.x + bounds.width * 0.56, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).transform)).toBe(advancedTransform);

  await page.getByRole("button", { name: "Previous" }).click();
  await expect.poll(() => track.evaluate((element) => getComputedStyle(element).transform)).toBe(initialTransform);

  await page.getByRole("link", { name: "Explore Guardium Towing" }).click();
  await expect(page).toHaveURL(/\/companies\/towing$/);
});
