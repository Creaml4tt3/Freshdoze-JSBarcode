const puppeteer = require("puppeteer");
const fs = require("fs");

async function saveHtmlAsImage(htmlFilePath, imageFilePath, itemsArray, user) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
  await page.setContent(htmlContent);

  await page.waitForFunction(() => {
    const fontLoaded = window
      .getComputedStyle(document.body)
      .fontFamily.includes("Prompt");
    return fontLoaded;
  });

  await page.evaluate(
    (itemsArray, user) => {
      const customer_name = document.querySelector(
        "#customer_name span:last-child"
      );
      customer_name && (customer_name.textContent = user?.name);
      const customer_email = document.querySelector(
        "#customer_email span:last-child"
      );
      customer_email && (customer_email.textContent = user?.email);
      const customer_phone = document.querySelector(
        "#customer_phone span:last-child"
      );
      customer_phone && (customer_phone.textContent = user?.phone);

      const items_wapper = document.querySelector("#items_wrapper");
      const items =
        itemsArray &&
        itemsArray.map((item, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
        <td class="text-center">${index + 1}</td>
        <td>${item?.name}</td>
        <td class="text-center">${item?.quantity}</td>
        <td class="text-center">${Number(item?.unitPrice).toFixed(2)}฿</td>
        <td class="text-center">${Number(item?.vat).toFixed(2)}฿</td>
        <td class="text-center">${Number(
          Number(item?.unitPrice) * Number(item?.quantity)
        ).toFixed(2)}฿</td>
        `;
          return row;
        });
      items_wapper && items?.forEach((item) => items_wapper?.append(item));

      const totalQuantity = itemsArray.reduce(
        (sum, item) => sum + item?.quantity,
        0
      );
      const totalAmount = itemsArray.reduce(
        (sum, item) => sum + item?.quantity * item?.unitPrice,
        0
      );
      const grand_total = document.querySelector("#grand_total");
      grand_total && (grand_total.textContent = totalQuantity);
      const grand_amount = document.querySelector("#grand_amount");
      grand_amount &&
        (grand_amount.textContent = `${Number(totalAmount).toFixed(2)}฿`);
    },
    itemsArray,
    user
  );

  await page.screenshot({ path: imageFilePath });
  await browser.close();
}

module.exports = { saveHtmlAsImage };
