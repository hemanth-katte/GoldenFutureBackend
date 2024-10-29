const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const puppeteer = require("puppeteer");
const fs = require("fs");
const handlebars = require("handlebars");

async function sendInvoiceEmail(emailConfig, invoiceData) {
  try {
    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailConfig.senderEmail,
        pass: emailConfig.senderPassword,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./EmailInvoice/views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./EmailInvoice/views"),
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));

    // Generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const source = fs.readFileSync("./EmailInvoice/views/email.handlebars", "utf8");
    const template = handlebars.compile(source);

    const html = template(invoiceData);
    await page.setContent(html);
    await page.pdf({ path: "./Invoice.pdf", format: "A4" });
    await browser.close();

    // Send Email
    emailConfig.html = html;
    const emailResult = await transporter.sendMail(emailConfig);
    console.log("Email sent: " + emailResult.response);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendInvoiceEmail,
};

// =========================== User Service =================================

// // Define email template configuration
// const emailConfig = {
//   senderEmail: "goldenfuturepvtltd@gmail.com",
//   senderPassword: "qgnb spwn nhud iigu",
//   from: "goldenfuturepvtltd@gmail.com",
//   to: "ganeshn944870@gmail.com",
//   subject: "Golden Future - E-Invoice for Purchase",
//   text: "Congratulations on your Recent Purchase. Here is your E-Invoice:",
//   template: "email",
//   attachments: [
//     {
//       filename: "invoice.pdf",
//       path: `Invoice.pdf`,
//     },
//   ],
// };

// // Function to get the formatted date and time
// function getFormattedDate() {
//   const currentTimestamp = Date.now();
//   const date = new Date(currentTimestamp);
//   return date.toISOString(); // Returns a formatted date and time string
// }

// // Define dynamic data for the invoice
// const invoiceData = {
//   created_date: getFormattedDate(),
//   productName: "Silver 5g",
//   price: 405,
//   CGST: 7.5,
//   IGST: 7.5,
//   SubTotal1: 500,
//   membershipPrice: 409,
//   CGST2: 44.9,
//   IGST2: 44.9,
//   SubTotal2: 499,
//   grandTotal: 999,
// };

// // Call the function to send the invoice email
// sendInvoiceEmail(emailConfig, invoiceData);
