import { expect, test } from "@playwright/test";

function futureDateTime(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T10:00`;
}

test("home page shows hero, search and featured cars", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find your way.");
  await expect(page.getByRole("heading", { name: "Where are you headed?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A car for every kind of day" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Volvo XC60" })).toBeVisible();
});

test("search form validates required fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search cars" }).click();
  await expect(page.getByText("Choose a pickup location")).toBeVisible();
  await expect(page).toHaveURL("/");
});

test("with-driver search leads to results and driver recommendations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radiogroup", { name: "Rental type" }).getByText("With a driver").click();

  await page.getByRole("combobox", { name: "Pickup location" }).click();
  await page.getByRole("option", { name: "Airport Terminal" }).click();
  await page.getByRole("combobox", { name: "Drop-off location" }).click();
  await page.getByRole("option", { name: "Airport Terminal" }).click();
  await page.getByLabel("Pickup date & time").fill(futureDateTime(3));
  await page.getByLabel("Return date & time").fill(futureDateTime(6));
  await page.getByRole("button", { name: "Search cars" }).click();

  await expect(page).toHaveURL(/\/cars\?.*mode=WITH_DRIVER/);
  await expect(page.getByRole("heading", { name: /cars? for with a driver from Airport Terminal/ })).toBeVisible();

  await page.getByRole("link", { name: "Volvo XC60" }).click();
  await expect(page).toHaveURL(/\/cars\/volvo-xc60\?mode=WITH_DRIVER/);
  await expect(page.getByRole("tab", { name: "With a driver" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Recommended drivers" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Online booking opens soon" })).toBeDisabled();
});

test("results filters narrow the list and show an empty state", async ({ page }) => {
  await page.goto("/cars?mode=WITH_DRIVER&fuel=electric");
  await expect(page.getByText("No cars match these filters")).toBeVisible();

  await page.goto("/cars?mode=SELF_DRIVE&fuel=electric");
  await expect(page.getByRole("link", { name: "Tesla Model 3" })).toBeVisible();
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

test("content and partner pages are reachable", async ({ page }) => {
  for (const [path, heading] of [
    ["/how-it-works", "Your car, your way."],
    ["/work-with-us", "Rental partners"],
    ["/work-with-us/providers", "Bring your vehicles."],
    ["/work-with-us/drivers", "Make the drive matter."],
    ["/work-with-us/partners", "Bring your customers."],
    ["/help", "Help"],
    ["/terms", "Terms"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
});

test("page has no horizontal scroll", async ({ page }) => {
  for (const path of ["/", "/cars", "/cars/volvo-xc60"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
  }
});
