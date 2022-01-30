let userName = localStorage.getItem('userName');
let userId = localStorage.getItem('userId');

let invoicesArr;
let invoiceLineArr;
let productsArr;
let userInvoices;
let userInvoiceLine;
let userInvoiceLineQuantity;
let sum = 0;
let total;
document.getElementById("user").innerText = userName
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", ()=> {
    window.location.href = '/login-page/login.html';
});

async function getInvoiceLine() {
    const response = await fetch("https://invoicesapi20210913135422.azurewebsites.net/invoicelines").then(response => response.json());
    if(response.value){
        getInvoices()
        invoiceLineArr = response.value;
    }
}

async function getProduct() {
    const response  = await fetch("https://invoicesapi20210913135422.azurewebsites.net/products").then(response => response.json());
    if(response.value){
        productsArr = response.value;
    }
}

async function getInvoices() {
    const response = await fetch("https://invoicesapi20210913135422.azurewebsites.net/invoices").then(response => response.json());
    if(response.value){
        invoicesArr = response.value;
        userInvoices = invoicesArr.filter(obj => {
            return obj.UserId === userId;
        });
    }

    if(userInvoices) {
        let invoicesTable = document.getElementById("invoices-table-container");
        invoicesTable.innerHTML = '';

        let invoiceTable = document.createElement("table");

        let invoiceTableBody = document.createElement("tbody");
        invoiceTable.appendChild(invoiceTableBody);

        let invoiceHeading1 = document.createElement("th");
        invoiceHeading1.appendChild(document.createTextNode(""));
        invoiceTableBody.appendChild(invoiceHeading1);

        let invoiceHeading2 = document.createElement("th");
        invoiceHeading2.appendChild(document.createTextNode("Invoice Name"));
        invoiceTableBody.appendChild(invoiceHeading2);

        let invoiceHeading3 = document.createElement("th");
        invoiceHeading3.appendChild(document.createTextNode("Paid Date"));
        invoiceTableBody.appendChild(invoiceHeading3);

        let invoiceHeading4 = document.createElement("th");
        invoiceHeading4.appendChild(document.createTextNode("Total Amount"));
        invoiceTableBody.appendChild(invoiceHeading4);

        for (let i = 0; i < userInvoices.length; i++) {
            
            sum = 0
            let userInvoiceLine1 = invoiceLineArr.filter(obj => {
                return obj.InvoiceId === userInvoices[i].InvoiceId
            })
            for(let i = 0; i < productsArr.length; i++) {
                userInvoiceLineQuantity = userInvoiceLine1.filter(obj => {
                        return obj.ProductId === productsArr[i].ProductId
                });
                total = productsArr[i].Price * userInvoiceLineQuantity[0].Quantity
                sum += total
            }
            let tr = document.createElement("tr");
            invoiceTableBody.appendChild(tr);
            for (let j = 0; j < 4; j++) {
              let td = document.createElement("td");
              if (j == 0) {
                let radioBtn = document.createElement("input")
                radioBtn.type = "radio"
                radioBtn.name = "invoice"
                radioBtn.value = userInvoices[i].InvoiceId
                radioBtn.addEventListener('change', function() {
                    let invoicesLinesTableDiv = document.getElementById("invoiceline-table-container");
                    invoicesLinesTableDiv.innerHTML = '';

                    let invoiceLineTable = document.createElement("table");

                    let invoiceLineTableBody = document.createElement("tbody");
                    invoiceLineTableBody.class = 'tableTbody'
                    invoiceLineTable.appendChild(invoiceLineTableBody);

                    let invoiceLineTableHeading1 = document.createElement("th");
                    invoiceLineTableHeading1.appendChild(document.createTextNode("Product"));
                    invoiceLineTableBody.appendChild(invoiceLineTableHeading1);

                    let invoiceLineTableHeading2 = document.createElement("th");
                    invoiceLineTableHeading2.appendChild(document.createTextNode("Price per unit"));
                    invoiceLineTableBody.appendChild(invoiceLineTableHeading2);

                    let invoiceLineTableHeading3 = document.createElement("th");
                    invoiceLineTableHeading3.appendChild(document.createTextNode("Quantity"));
                    invoiceLineTableBody.appendChild(invoiceLineTableHeading3);

                    let invoiceLineTableHeading4 = document.createElement("th");
                    invoiceLineTableHeading4.appendChild(document.createTextNode("Total Amount"));
                    invoiceLineTableBody.appendChild(invoiceLineTableHeading4);

                    userInvoiceLine = invoiceLineArr.filter(obj => {
                        return obj.InvoiceId === radioBtn.value
                    });

                
                    for(let i = 0; i < productsArr.length; i++) {
                        let tr = document.createElement("tr")
                        invoiceLineTableBody.appendChild(tr);
                        for (let j = 0; j < 4; j++) {
                            let td = document.createElement("td");
                            if(j == 0) {
                                td.appendChild(document.createTextNode(productsArr[i].Name)); 
                            }
                            else if(j == 1) {
                                td.appendChild(document.createTextNode(productsArr[i].Price)); 
                            }
                            else if(j == 2) {
                                userInvoiceLineQuantity = userInvoiceLine.filter(obj => {
                                    return obj.ProductId === productsArr[i].ProductId
                                });
                                td.appendChild(document.createTextNode(userInvoiceLineQuantity[0].Quantity)); 
                            }
                            else if(j == 3) {
                                total = productsArr[i].Price * userInvoiceLineQuantity[0].Quantity
                                td.appendChild(document.createTextNode(total)); 
                            }
                            tr.appendChild(td);
                        }
                    }
                    invoicesLinesTableDiv.appendChild(invoiceLineTable);
                });
                td.appendChild(radioBtn)
              } else if (j == 1) {
                td.appendChild(document.createTextNode(userInvoices[i].Name));
              } else if (j == 2) {
                let formatedDate = userInvoices[i].PaidDate.split('T')
                td.appendChild(document.createTextNode(formatedDate[0]));
              } else if (j == 3) {
                td.appendChild(document.createTextNode(sum));
              }
              tr.appendChild(td);
            }
        }
        invoicesTable.appendChild(invoiceTable);
    }
}

function drpdownMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
getInvoiceLine()
getProduct()