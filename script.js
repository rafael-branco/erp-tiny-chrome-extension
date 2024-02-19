var sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(
        (resolve) => (sleepSetTimeout_ctrl = setTimeout(resolve, ms))
    );
}

function clickOnSelectAll() {
    document.querySelector("#tbdados thead th input").click();
}

function getNavTabs() {
    ecommerces = document.querySelectorAll(
        ".nav-tabs-scroll ul li:not(.dropdown) a"
    );
    return ecommerces;
}

function addAlert() {
    var alertStyle = `
    <style>
      /* Styling for the fixed alert */
      #automation-alert {
        padding: 10px;
        background-color: #4CAF50; /* Green */
        color: white;
        opacity: 1; /* Fully visible */
        border-radius: 3px; /* Rounded corners for a sleek look */
        text-align: center;
        /* Positioning to make it absolute and on top of everything */
        position: absolute;
        top: 10px; /* Close to the top of the body */
        right: 10px; /* Close to the right side of the body */
        z-index: 1000; /* Ensure it's above other content */
        font-size: 12px; /* Smaller font size */
      }
      /* Ensure the body has at least a relative position */
      body {
        position: relative;
      }
    </style>
    `;

    var alertHtml = `
    <div id="automation-alert">Automation is running...</div>
    `;

    document.head.innerHTML += alertStyle;

    if (!document.body.querySelector("#automation-alert")) {
        document.body.insertAdjacentHTML("beforeend", alertHtml);
    }
}

function removeAlert(){
    alertElement = document.querySelector('#automation-alert');
    alertElement.remove();
}

function receiveOrders(){
    receiveOrdersButton = document.querySelector('button.btn.featured-action.prevent-dbclick.has-tipsy-top.btn-primary');
    receiveOrdersButton.click();
}

function closeModal(){
    closeModalButton = document.querySelector('#bs-modal #modalPedidosEcommerceLote button.btn.btn-default.btn-ghost');
    closeModalButton.click();
}

window.addEventListener("load", async function () {
    target_url = "https://erp.tiny.com.br/lista_pedidos_ecommerce";

    await sleep(5000);

    if (window.location.href != target_url) {
        window.location.href = target_url;
        console.log("Tiny Automation: Done!");
    } else {
        addAlert();
        await sleep(2000);
        ecommerces = getNavTabs();

        for (let i = 0; i < ecommerces.length; i++) {
            ecommerces[i].click();
            await sleep(5000);

            if (!document.querySelector("#lista .empty-state-box")) {
                console.log("Data exists!");

                clickOnSelectAll();
                await sleep(3000);

                receiveOrders();
                await sleep(5000);
                console.log('Orders receive button clicked!');
                
                closeModal();
                await sleep(3000);
                console.log('Orders received!');
            } else {
                console.log("Data does NOT exists!");
            }
        }
    }

    console.log('Automation finished!');
    removeAlert();
});
