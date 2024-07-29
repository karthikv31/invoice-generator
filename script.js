document.addEventListener("DOMContentLoaded", () => {
  let items = [];
  let nextInvoiceNumber = localStorage.getItem("nextInvoiceNumber") || 1;
  document.getElementById("invoice-number").value = nextInvoiceNumber;

  document.getElementById("add-item-button").addEventListener("click", addItem);
  document
    .getElementById("generate-invoice-button")
    .addEventListener("click", generateInvoice);
  document
    .getElementById("download-pdf-button")
    .addEventListener("click", downloadPDF);

  function addItem() {
    const itemName = document.getElementById("item-name").value;
    const itemQuantity = parseInt(
      document.getElementById("item-quantity").value,
      10
    );
    const itemPrice = parseFloat(document.getElementById("item-price").value);

    if (!itemName || itemQuantity <= 0 || itemPrice <= 0) {
      alert("Please enter valid item details.");
      return;
    }

    items.push({ name: itemName, quantity: itemQuantity, price: itemPrice });
    document.getElementById("item-quantity").value = "";
    document.getElementById("item-price").value = "";

    alert("Item added successfully!");
  }

  function generateInvoice() {
    const customerName = document.getElementById("customer-name").value;
    const customerAddress = document.getElementById("customer-address").value;
    const salesTax = parseFloat(document.getElementById("sales-tax").value);

    if (!customerName || !customerAddress || items.length === 0) {
      alert("Please fill in all the fields and add at least one item.");
      return;
    }

    let totalAmount = 0;
    let itemRows = "";

    items.forEach((item, index) => {
      const amount = item.quantity * item.price;
      totalAmount += amount;
      itemRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${amount.toFixed(2)}</td>
                </tr>
            `;
    });

    let salesTaxAmount = 0;
    if (salesTax > 0) {
      salesTaxAmount = totalAmount * (salesTax / 100);
      totalAmount += salesTaxAmount;
    }

    const invoiceNumber = document.getElementById("invoice-number").value || nextInvoiceNumber++;
    const currentDate = new Date().toLocaleDateString();
    localStorage.setItem("nextInvoiceNumber", nextInvoiceNumber);

    const invoiceOutput = `
            <h2>Invoice #${invoiceNumber}</h2>
            <p>Date: ${currentDate}</p>
            <p><strong>SNACKS AND CO.</strong></p>
            <p>2300 Kathryn Ln, Plano, TX 75025</p>
            <p><strong>BILL TO</strong></p>
            <p>${customerName}</p>
            <p>${customerAddress}</p>
            <table border="1" cellpadding="15" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>QTY</th>
                        <th>UNIT PRICE</th>
                        <th>AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemRows}
                    ${
                      salesTax > 0
                        ? `<tr>
                        <td colspan="4"><strong>SALES TAX (${salesTax}%)</strong></td>
                        <td>$${salesTaxAmount.toFixed(2)}</td>
                    </tr>`
                        : ""
                    }
                    <tr>
                        <td colspan="4"><strong>TOTAL</strong></td>
                        <td>$${totalAmount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <p><b>Make all checks payable to SNACKS AND CO.</b></p>
            <p> or</p>
            <p>Pay through <b>Zelle: snacksandco24@gmail.com </b></p>
            <p>If you have any questions concerning this invoice, use the following contact information:</p>
            <p><b>NELSON  MOB: 6828120880</b></p>
            <p>THANK YOU FOR YOUR BUSINESS!</p>
        `;

    document.getElementById("invoice-output").innerHTML = invoiceOutput;
    items = [];
  }


  function downloadPDF() {
    const invoiceOutput = document.getElementById("invoice-output").innerHTML;

    if (!invoiceOutput) {
      alert("Please generate the invoice first.");
      return;
    }

    const logoImage = new Image();
    logoImage.src = "./images/logo.jpg";
    logoImage.onload = function () {
      const logoBase64 = getBase64Image(logoImage);
      const val = htmlToPdfmake(invoiceOutput);
      const dd = {
        content: [
          {
            columns: [
              {
                stack: [
                  {
                    text: "Invoice",
                    style: "header",
                  },
                  {
                    text: `Invoice #${document.getElementById("invoice-number").value}`,
                    style: "subheader",
                  },
                  {
                    text: `Date: ${new Date().toLocaleDateString()}`,
                    style: "subheader",
                  },
                ],
              },
              {
                image: logoBase64,
                width: 100,
                alignment: "right",
              },
            ],
            margin: [0, 0, 0, 20],
          },
          {
            stack: val,
            style: "tableExample",
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
          subheader: {
            fontSize: 15,
            bold: true,
          },
          tableExample: {
            margin: [0, 5, 0, 15],
            width: "auto",
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: "black",
          },
          table: {
            margin: [0, 5, 0, 15],
            width: "auto",
            fontSize: 12,
            border: 1,
            padding: 5,
          },
        },

        defaultStyle: {
          columnGap: 20,
        },
      };

      pdfMake.createPdf(dd).download(`invoice_${document.getElementById("invoice-number").value}.pdf`);
    };
  }

  function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }
});
