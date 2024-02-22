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
    let ecommerces = document.querySelectorAll(
        ".nav-tabs-scroll ul li:not(.dropdown) a"
    );
    return ecommerces;
}

function goToNextPage(){
    let nextPageButton = document.querySelector(
        ".bottom-bar .pnext a.link-pg.pg-n-selec"
    );
    nextPageButton.click();
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
    let alertElement = document.querySelector('#automation-alert');
    alertElement.remove();
}

async function receiveOrders(){
    let receiveOrdersButton = document.querySelector('button.btn.featured-action.prevent-dbclick.has-tipsy-top.btn-primary');
    if(!receiveOrdersButton){
        let moreActions = document.querySelector('.dropdown.dropup.dropdown-in.featured-actions-menu button.btn.btn-menu-acoes.dropdown-toggle');
        moreActions.click();
        await sleep(1000);
        let secondReceiveOrdersButton = document.querySelector('.btnImportarPedidosSelecionados');
        secondReceiveOrdersButton.click();
    }else{
        receiveOrdersButton.click();
    }
    
}

function closeModal(){
    let closeModalButton = document.querySelector('#bs-modal #modalPedidosEcommerceLote button.btn.btn-default.btn-ghost');
    closeModalButton.click();
}

function isOrderGeneratorComplete() {
    let checkItems = document.querySelectorAll('.modal-body table tbody tr td:nth-child(4)');
  
    for (let item of checkItems) {
      if (item.querySelector('.fa.fa-fw.fa-spinner.fa-spin')) {
        return false;
      }
    }
    return true;
}

async function waitForOrderGenerationCompletion() {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (isOrderGeneratorComplete()) {
                console.log("Order Generation Completed!");
                clearInterval(interval);
                resolve();
            }else{
                console.log("Order Generation in Progress!");
            }
        }, 3000);
    });
}



window.addEventListener("load", async function () {
    let target_url = "https://erp.tiny.com.br/lista_pedidos_ecommerce";
    
    console.log('Starting automation loop...');
    addAlert();
    await sleep(5000);

    if (window.location.href != target_url) {
        window.location.href = target_url;
        console.log("Tiny Automation: Done!");
    } else {
        
        await sleep(2000);
        ecommerces = getNavTabs();

        // Add a 3 second repetition
        for (let i = 0; i < ecommerces.length; i++) {
            ecommerces[i].click();
            await sleep(5000);

            if (!document.querySelector("#lista .empty-state-box")) {
                console.log("Data exists!");

                clickOnSelectAll();
                await sleep(3000);

                receiveOrders();
                console.log('Orders receive button clicked!');

                await waitForOrderGenerationCompletion();
                closeModal();
                await sleep(3000);

                console.log('Orders received!');
            } else {
                console.log("Data does NOT exists!");
            }
        }
    }

    console.log('Wait for 3 minutes...');
    await sleep(180000);
    console.log('Time is up!');
    console.log('Automation loop finished!');
    console.log('Starting again...');
    window.location.href = target_url;
});
