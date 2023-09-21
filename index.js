const { jsPDF } = require("jspdf");
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const { saveHtmlAsImage } = require("./htmlToPdf");
const moment = require("moment");

// const barcodeData = require("./barcodeData");
const orderNumber = "00001"; //? Order Number
const itemsArray = require("./itemData"); //? Array of items to Packing List
const user = {
  name: "Teekayu Poongkawabutr",
  email: "teekayu@yeswebdesignstudio.com",
  phone: "(+66)87-152-8444",
}; //? User Data
require("./font/Prompt-Regular-normal.js");
require("./font/SpaceMono-Regular-normal.js");

const doc = new jsPDF({
  compress: true,
});
const canvas = createCanvas();
// doc.setTextColor("#78BE20");
doc.setTextColor("#1F1F1F");

const newItemsArray =
  itemsArray &&
  itemsArray.map((data, index) => {
    JsBarcode(canvas, data?.barcode, {
      // text: `${data?.name}/${data?.code}`,
      textAlign: "center",
      height: 40,
      width: 1.5,
      margin: 0,
      fontSize: 10,
      lineColor: "#1F1F1F",
    });
    const barcodeDataURL = canvas.toDataURL();
    return { ...data, barcodeUrl: barcodeDataURL };

    // doc.setFont("SpaceMono-Regular", "normal");
    // doc.setFontSize(6);
    // doc.text(
    //   data?.name,
    //   index < 4
    //     ? index * 40 + (index + 1) * 10
    //     : (index - 4) * 40 + (index - 3) * 10,
    //   index < 4 ? 243 : 268
    // );
    // doc.addImage(
    //   barcodeDataURL,
    //   "PNG",
    //   index < 4
    //     ? index * 40 + (index + 1) * 10
    //     : (index - 4) * 40 + (index - 3) * 10,
    //   index < 4 ? 245 : 270,
    //   40,
    //   15
    // );
  });

const logo = fs.readFileSync("./image/logo.png");
doc.addImage(logo, "PNG", 82.5, 13.5, 45, 16);

doc.setFont("Prompt-Regular", "normal");
// doc.setFont("SpaceMono-Regular", "normal");
doc.setTextColor("#1F1F1F");
doc.setFontSize(10);
doc.text(`Order No : #${orderNumber}`, 10, 45);
doc.text(`Date : ${moment().format("DD/MM/YYYY : HH:mm:ss")}`, 10, 52);

const htmlFilePath = "template/pdf.html";
const imageDirectory = "./image";
const imageFilePath = path.join(imageDirectory, `${orderNumber}.png`);

save();

async function save() {
  if (newItemsArray) {
    await saveHtmlAsImage(
      htmlFilePath,
      imageFilePath,
      newItemsArray,
      user
    ).catch((error) => console.error(error));
    const generateHtmlImage = fs.readFileSync(imageFilePath);
    doc.addImage(generateHtmlImage, "PNG", 10, 57, 190, 223);

    doc.save(`./export/${orderNumber}.pdf`);
  }
}

//? width 210 mm
//? height 297 mm
//? width-padding 190 mm (10 mm)
//? height-padding 270 mm (13.5 mm)
