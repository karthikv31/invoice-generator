let items = [];

// Load the next invoice number from local storage or initialize to 1
let nextInvoiceNumber = localStorage.getItem('nextInvoiceNumber');
if (!nextInvoiceNumber) {
    nextInvoiceNumber = 1;
} else {
    nextInvoiceNumber = parseInt(nextInvoiceNumber, 10);
}

// Set the initial invoice number in the input field
document.getElementById('invoice-number').value = nextInvoiceNumber;

document.getElementById('add-item-button').addEventListener('click', addItem);
document.getElementById('generate-invoice-button').addEventListener('click', generateInvoice);
document.getElementById('download-pdf-button').addEventListener('click', downloadPDF);

function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemQuantity = parseInt(document.getElementById('item-quantity').value, 10);
    const itemPrice = parseFloat(document.getElementById('item-price').value);

    if (!itemName || itemQuantity <= 0 || itemPrice <= 0) {
        alert('Please enter valid item details.');
        return;
    }

    items.push({
        name: itemName,
        quantity: itemQuantity,
        price: itemPrice
    });

    document.getElementById('item-quantity').value = '';
    document.getElementById('item-price').value = '';

    alert('Item added successfully!');
}

function generateInvoice() {
    const customerName = document.getElementById('customer-name').value;
    const customerAddress = document.getElementById('customer-address').value;

    if (!customerName || !customerAddress || items.length === 0) {
        alert('Please fill in all the fields and add at least one item.');
        return;
    }

    let totalAmount = 0;
    let itemRows = '';

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

    const invoiceNumber = nextInvoiceNumber++;

    // Update the next invoice number in local storage
    localStorage.setItem('nextInvoiceNumber', nextInvoiceNumber);

    const invoiceOutput = `
        <h2>Invoice #${invoiceNumber}</h2>
        <p><strong>SNACKS AND CO.</strong></p>
        <p>2300 Kathryn ln plano tx 75025</p>
        <p><strong>BILL TO</strong></p>
        <p>${customerName}</p>
        <p>${customerAddress}</p>
        <p><strong>FOR</strong></p>
        <p>SAMOSAS</p>
        <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
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
                <tr>
                    <td colspan="4"><strong>TOTAL</strong></td>
                    <td>$${totalAmount.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        <p><b>Make all checks payable to SNACKS AND CO.</b></p>
        <p>If you have any questions concerning this invoice, use the following contact information:</p>
        <p><b>NELSON  MOB: 6828120880</b></p>
        <p>THANK YOU FOR YOUR BUSINESS!</p>
    `;

    document.getElementById('invoice-output').innerHTML = invoiceOutput;
    items = [];  // Clear items after generating the invoice
}

function downloadPDF() {
    const invoiceOutput = document.getElementById('invoice-output').innerHTML;

    if (!invoiceOutput) {
        alert('Please generate the invoice first.');
        return;
    }

    const val = htmlToPdfmake(invoiceOutput);
    const dd = { content: val };
    pdfMake.createPdf(dd).download(`invoice_${nextInvoiceNumber - 1}.pdf`);
}
