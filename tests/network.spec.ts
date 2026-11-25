import { test, expect } from "../fixtures/pom.fixture";
import { products } from "../test-data/inventory.data";

test.describe("Network Interception & Resilience Suite", () => {
  test("Abort image requests to accelerate functional shopping flow", async ({
    page,
    inventoryPage,
  }) => {
    let blockedImagesCount = 0;

    // 1. Intercept and abort all image requests before navigating
    await page.route("**/*.{png,jpg,jpeg,svg}", async (route) => {
      blockedImagesCount++;
      await route.abort();
    });

    // 2. Navigate and run core business workflow without images
    await inventoryPage.navigateTo("/inventory.html");
    await inventoryPage.verifyPageLoaded();
    await inventoryPage.addProductToCart(products.backpack);

    // 3. Assert images were blocked AND functional UI remained intact
    expect(blockedImagesCount).toBeGreaterThan(0);
    await inventoryPage.header.verifyCartCount(1);
  });

  test("Simulate 500 Server Error on product images without breaking UI functionality", async ({
    page,
    inventoryPage,
  }) => {
    // Inject a 500 Internal Server Error for all product JPGs
    await page.route("**/*.jpg", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "text/plain",
        body: "Internal Server Error",
      });
    });

    await inventoryPage.navigateTo("/inventory.html");
    await inventoryPage.verifyPageLoaded();

    // Verify user can still sort and add items even when image CDN fail
    await inventoryPage.sortBy("lohi");
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.header.verifyCartCount(1);
  });

  test("Intercept and audit first-party network responses for 4xx/5xx errors", async ({
    page,
    inventoryPage,
  }) => {
    const failedRequests: string[] = [];

    // Monitor sub-resources (scripts, CSS, images, XHR) while ignoring SPA document fallback 404s
    page.on("response", (response) => {
      const isDocument = response.request().resourceType() === "document";
      if (
        !isDocument &&
        response.url().includes("saucedemo.com") &&
        response.status() >= 400
      ) {
        failedRequests.push(`${response.status()} - ${response.url()}`);
      }
    });

    await inventoryPage.navigateTo("/inventory.html");
    await inventoryPage.verifyPageLoaded();

    expect(failedRequests).toEqual([]);
  });
});
