import { expect, test, type Page } from "@playwright/test";

function futureDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

async function expectNoBrokenImages(page: Page) {
  await page.waitForLoadState("networkidle");
  const broken = await page.evaluate(() =>
    [...document.images]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  );
  expect(broken, `broken images: ${broken.join(", ")}`).toEqual([]);
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 1024;

/** Picks a rental range with the custom date picker (popover on desktop, bottom sheet on phones). */
async function pickDates(page: Page, startOffset: number, endOffset: number) {
  await page.locator("#pickupDate").click();
  await page.locator(`[data-day="${futureDate(startOffset)}"]`).first().click();
  await page.locator(`[data-day="${futureDate(endOffset)}"]`).first().click();
  await page.getByRole("button", { name: "Done" }).click();
}

test("home page shows hero, search and recommended cars with real photos", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find your way.");
  await expect(page.getByRole("heading", { name: "Where are you headed?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Popular right now" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Volvo XC60, front/ }).first()).toBeAttached();
  await expectNoBrokenImages(page);
});

test("header is transparent over the hero and solid after scrolling", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header").first();
  await expect(header).toHaveAttribute("data-transparent", "true");
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(header).toHaveAttribute("data-transparent", "false");

  await page.goto("/cars");
  await expect(page.locator("header").first()).toHaveAttribute("data-transparent", "false");
});

test("desktop nav dropdowns open and lead to filtered results", async ({ page }) => {
  test.skip(isMobile(page), "desktop navigation only");
  await page.goto("/");
  await page.getByRole("button", { name: "Rent a car" }).click();
  await page.getByRole("link", { name: "Electric" }).first().click();
  await expect(page).toHaveURL(/\/cars\?fuel=electric/);
  await expect(page.getByRole("link", { name: "Tesla Model 3" })).toBeVisible();

  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("menuitem", { name: /Independent professional driver/ }).click();
  await expect(page).toHaveURL(/\/register\?role=driver/);
  await expect(page.locator("#driver")).toHaveAttribute("aria-current", "true");
});

test("mobile menu opens, navigates and closes", async ({ page }) => {
  test.skip(!isMobile(page), "mobile navigation only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByRole("link", { name: "Log in" })).toBeVisible();
  await menu.getByRole("link", { name: "How it works" }).click();
  await expect(page).toHaveURL(/\/how-it-works/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("with-driver search leads to results and driver recommendations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radiogroup", { name: "Rental type" }).getByText("With a driver").click();
  await page.getByRole("combobox", { name: "Pick-up location" }).click();
  await page.getByRole("option", { name: "Airport Terminal" }).click();
  await expect(page.locator("#pickupLocation svg.lucide-map-pin")).toHaveCount(1);
  await pickDates(page, 3, 6);
  await expect(page.locator("[data-rental-length]")).toHaveText("Rental length: 3 days");
  await page.getByRole("button", { name: "Find cars" }).click();

  await expect(page).toHaveURL(/\/cars\?.*mode=WITH_DRIVER/);
  await page.getByRole("link", { name: "Volvo XC60" }).click();
  await expect(page).toHaveURL(/\/cars\/volvo-xc60\?mode=WITH_DRIVER/);
  await expect(page.getByRole("tab", { name: "With a driver" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Recommended drivers" })).toBeVisible();
  await expect(page.getByText("Cancellation", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Online booking opens soon" }).first()).toBeDisabled();
});

test("search form validates required fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Find cars" }).click();
  await expect(page.getByText("Choose where to collect the car", { exact: true })).toBeVisible();
  await expect(page).toHaveURL("/");
});

test("story explains the product in five steps", async ({ page }) => {
  await page.goto("/");
  for (let step = 1; step <= 5; step += 1) {
    await expect(page.locator(`[data-story-step="${step}"]`)).toHaveCount(1);
  }
  await page.locator('[data-story-step="4"]').scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Car and driver confirmed together" })).toBeVisible();
  await expect(page.getByText("Car and driver confirmed together", { exact: true }).last()).toBeVisible();
});

test("category and destination tiles filter results", async ({ page }) => {
  await page.goto("/");
  await page.locator('main a[href="/cars?category=suv"]').click();
  await expect(page).toHaveURL(/category=suv/);
  await expect(page.getByRole("link", { name: "Volvo XC60" })).toBeVisible();

  await page.goto("/");
  await page.locator('main a[href="/cars?location=loc-harbour"]').click();
  await expect(page).toHaveURL(/location=loc-harbour/);
  await expect(page.getByRole("link", { name: "Audi Q5" })).toBeVisible();
});

test("details page gallery switches photos and shows the calendar", async ({ page }) => {
  await page.goto("/cars/toyota-hiace");
  await expect(page.getByText("1 / 3")).toBeVisible();
  await page.getByRole("button", { name: /Show photo 3/ }).click();
  await expect(page.getByText("3 / 3")).toBeVisible();
  await expect(page.getByRole("button", { name: /Show photo 3/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("December 2026")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rental requirements" })).toBeVisible();
  await expectNoBrokenImages(page);
});

test("results filters narrow the list and show an empty state", async ({ page }) => {
  await page.goto("/cars?mode=WITH_DRIVER&fuel=electric");
  await expect(page.getByText("No cars match these filters")).toBeVisible();
  await page.goto("/cars?brand=Toyota&sort=popular");
  await expect(page.getByRole("link", { name: "Toyota Corolla" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Volvo XC60" })).toHaveCount(0);
});

test("self-drive-only car disables the with-driver tab", async ({ page }) => {
  await page.goto("/cars/honda-fit");
  await expect(page.getByRole("tab", { name: /With a driver/ })).toBeDisabled();
  await expect(page.getByText("A valid driving license")).toBeVisible();
});

test("unknown car shows the not-found page and is not indexed", async ({ page }) => {
  // With Cache Components the shell may stream before notFound() runs, so the
  // status can stay 200 (documented Next.js behavior). Assert the UI and noindex.
  await page.goto("/cars/does-not-exist");
  await expect(page.getByText("We couldn't find that page or car.")).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).not.toHaveCount(0);
});

test("content, account and credit pages are reachable", async ({ page }) => {
  for (const [path, heading] of [
    ["/how-it-works", "Your car, your way."],
    ["/work-with-us/providers", "Bring your vehicles."],
    ["/work-with-us/drivers", "Make the drive matter."],
    ["/work-with-us/partners", "Bring your customers."],
    ["/login", "Log in"],
    ["/register", "Create an account"],
    ["/credits", "Photo credits"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
  await page.goto("/sign-in");
  await expect(page).toHaveURL(/\/login$/);
});

test("reduced motion still shows all content", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Where are you headed?" })).toBeVisible();
  await page.locator('[data-story-step="3"]').scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Choose your way" })).toBeVisible();
  await context.close();
});

test("pages have no horizontal scroll, including while scrolling", async ({ page }) => {
  for (const path of ["/", "/cars", "/cars/volvo-xc60", "/register"]) {
    await page.goto(path);
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= height; y += 700) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(80);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow on ${path} at y=${y}`).toBeLessThanOrEqual(0);
    }
  }
});

test("booking box fits inside the hero banner on short laptop screens", async ({ page }) => {
  test.skip(isMobile(page), "desktop viewports only");
  for (const [width, height] of [[1351, 662], [1366, 768], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const button = page.getByRole("button", { name: "Find cars" });
    await expect(button).toBeVisible();
    // Wait for the entrance slide-up animation to finish before measuring.
    await expect
      .poll(() => page.locator("[data-hero-search]").evaluate((el) => getComputedStyle(el).transform))
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    const buttonBox = await button.boundingBox();
    const heroBox = await page.locator("main section").first().boundingBox();
    expect(buttonBox!.y + buttonBox!.height, `${width}x${height}: button below the fold`).toBeLessThanOrEqual(height);
    expect(buttonBox!.y + buttonBox!.height, `${width}x${height}: button outside banner`).toBeLessThanOrEqual(
      heroBox!.y + heroBox!.height,
    );
  }
});

test("date picker is custom and blocks past days", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator('input[type="date"]')).toHaveCount(0);

  await page.locator("#returnDate").click();
  await expect(page.getByRole("dialog", { name: "Select your rental dates" })).toBeVisible();
  const yesterday = page.locator(`td[data-day="${futureDate(-1)}"]`).first();
  if (await yesterday.count()) {
    await expect(yesterday).toHaveAttribute("data-disabled", "true");
    await yesterday.click({ force: true });
    await expect(page.locator("#pickupDate")).toContainText("Add date");
  }

  await page.locator(`[data-day="${futureDate(2)}"]`).first().click();
  await page.locator(`[data-day="${futureDate(9)}"]`).first().click();
  await expect(page.locator("[data-rental-length]")).toHaveText("Rental length: 7 days");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Select your rental dates" })).toHaveCount(0);

  // Times sit next to each date, outside the picker.
  await page.getByRole("combobox", { name: "Return time" }).click();
  await page.getByRole("option", { name: "18:00" }).click();
  await expect(page.locator("[data-rental-length]")).toHaveText("Rental length: 7 days 8 hours");
  await expect(page.getByRole("combobox", { name: "Return time" })).toContainText("18:00");
});
