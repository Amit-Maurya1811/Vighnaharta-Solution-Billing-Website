document.addEventListener('DOMContentLoaded', () => {
    let goodsCount = 1;

    // Add more goods functionality
    document.getElementById('addMore').addEventListener('click', () => {
        goodsCount++;

        const goodsSection = document.getElementById('goodsSection');
        const goodItem = document.createElement('tr');
        goodItem.classList.add('good-item');

        goodItem.innerHTML = `
            <td>${goodsCount}</td>
            <td><input type="text" class="description" required></td>
            <td><input type="text" class="sacCode" required></td>
            <td><input type="number" class="quantity" required></td>
            <td><input type="number" class="rate" required></td>
            <td><input type="number" class="amount" readonly></td>
            <td><button type="button" class="delete-btn">×</button></td>
        `;
        goodsSection.appendChild(goodItem);

        addDeleteFunctionality(goodItem);
    });

    function addDeleteFunctionality(row) {
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            row.remove();
            updateGoodsCount();
        });
    }

    const initialRow = document.querySelector('.good-item');
    addDeleteFunctionality(initialRow);

    function updateGoodsCount() {
        const rows = document.querySelectorAll('.good-item');
        rows.forEach((row, index) => {
            row.querySelector('td:first-child').textContent = index + 1;
        });
        goodsCount = rows.length;
    }

    // GST Calculation
    document.getElementById('calculateGST').addEventListener('click', function () {
        let totalAmount = 0;
        const goods = document.querySelectorAll('.good-item');

        goods.forEach(good => {
            const quantity = parseFloat(good.querySelector('.quantity').value);
            const rate = parseFloat(good.querySelector('.rate').value);
            const amount = quantity * rate;
            totalAmount += amount;
            good.querySelector('.amount').value = amount.toFixed(2);
        });

        const cgst = totalAmount * 0.09;
        const sgst = totalAmount * 0.09;
        const grandTotal = totalAmount + cgst + sgst;

        document.getElementById('totalAmount').value = totalAmount.toFixed(2);
        document.getElementById('cgst').value = cgst.toFixed(2);
        document.getElementById('sgst').value = sgst.toFixed(2);
        document.getElementById('grandTotal').value = grandTotal.toFixed(2);

        document.getElementById('amountInWords').value = convertToWords(grandTotal);
    });

    // Generate PDF with Centered Header and Tabular Format
    document.getElementById('generatePDF').addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Calculate the center position
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;

        // Centered Header Section
        doc.setFontSize(12);
        doc.text("VIGHNAHERTA SOLUTION", centerX, 10, { align: 'center' });
        doc.text("17/17 EK FORD ROAD, KHARDAHA, WEST BENGAL-700115", centerX, 20, { align: 'center' });
        doc.text("GSTIN - 19BAVPM5795A1Z2", centerX, 30, { align: 'center' });

        doc.text(`Bill No: ${document.getElementById("billNumber").value}`, 10,centerX);
        doc.text(`Date: ${document.getElementById("date").value}`, 10, centerX);

        // Address Section
        doc.text(`To: ${document.getElementById("companyName").value}`, 10, 60);
        doc.text(`Address: ${document.getElementById("address").value}`, 10, 70);

        // Prepare data for AutoTable (table of goods)
        const goods = document.querySelectorAll(".good-item");
        const tableData = [];
        goods.forEach((item, index) => {
            const description = item.querySelector(".description").value;
            const sacCode = item.querySelector(".sacCode").value;
            const quantity = item.querySelector(".quantity").value;
            const rate = item.querySelector(".rate").value;
            const amount = item.querySelector(".amount").value;

            tableData.push([
                index + 1,
                description,
                sacCode,
                quantity,
                rate,
                amount
            ]);
        });

        // AutoTable: Adding goods table
        doc.autoTable({
            head: [['Sl No.', 'Description of Goods', 'SAC Code', 'Qty.', 'Rate', 'Amount']],
            body: tableData,
            startY: 80,  // Adjust the position based on your layout
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
            styles: { fontSize: 10 },
        });

        // GST Calculation Section
        const finalY = doc.previousAutoTable.finalY || 80;

        doc.text(`Total Amount: ${document.getElementById('totalAmount').value}`, 10, finalY + 10);
        doc.text(`CGST (9%): ${document.getElementById('cgst').value}`, 10, finalY + 20);
        doc.text(`SGST (9%): ${document.getElementById('sgst').value}`, 10, finalY + 30);
        doc.text(`Grand Total: ${document.getElementById('grandTotal').value}`, 10, finalY + 40);

        // Footer Section
        doc.text("For Vighnaherta Solution", 150, finalY + 60);
        doc.text("Authorized Signatory", 150, finalY + 70);

        // Save the PDF
        doc.save("invoice.pdf");
    });

    function convertToWords(num) {
        // Number to words conversion function
        // ...
    }
});
