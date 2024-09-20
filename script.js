var sleepSetTimeout_ctrl;

console.log("Overriding alert and confirm functions!");
window.alert = function(){
    console.log("Alert!");
};
window.confirm = function(){
    console.log("Confirm!");
    return true;
};
console.log("Overrided!");


function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(
        (resolve) => (sleepSetTimeout_ctrl = setTimeout(resolve, ms))
    );
}

function clickOnSelectAll() {
    let selectAll = document.querySelector("#tbdados thead th input");
    if (!selectAll) {
        location.reload();
    } else {
        selectAll.click();
    }

}

function getNavTabs() {
    let ecommerces = document.querySelectorAll(
        ".nav-tabs-scroll ul li:not(.dropdown) a"
    );
    return ecommerces;
}

function goToNextPage() {
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

function removeAlert() {
    let alertElement = document.querySelector('#automation-alert');
    alertElement.remove();
}

async function receiveOrders() {
    let receiveOrdersButton = document.querySelector('button.btn.featured-action.prevent-dbclick.has-tipsy-top.btn-primary');
    if (!receiveOrdersButton) {
        let moreActions = document.querySelector('.dropdown.dropup.dropdown-in.featured-actions-menu button.btn.btn-menu-acoes.dropdown-toggle');
        moreActions.click();
        await sleep(1000);
        let secondReceiveOrdersButton = document.querySelector('.btnImportarPedidosSelecionados');
        secondReceiveOrdersButton.click();
    } else {
        receiveOrdersButton.click();
    }

}

function closeModal() {
    let closeModalButton = document.querySelector('#bs-modal #modalPedidosEcommerceLote button.btn.btn-default.btn-ghost');
    if (!closeModalButton) {
        location.reload();
    } else {
        closeModalButton.click();
    }

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

async function login() {
    let username = document.querySelector(".desktop input[name='username']");
    let password = document.querySelector(".desktop input[name='password']");
    let submitButton = document.querySelector(".desktop form > div:nth-child(3) button");

    if (!!username && !!password && !!submitButton) {
        await sleep(3000);
        username.value = 'teste123@estoqueimports';

        await sleep(1000);
        password.value = 'Admin12345..';

        await sleep(2000);
        submitButton.click();
        await sleep(2000);
    }

}

async function isAnotherSessionWarnPage() {

    console.log("Checking whether it has another session...");

    await sleep(5000);

    let confirmButton = document.querySelector("body.modal-open.ui-popup-open .modal.modal-ui-popup.modal-bottom.in button[popup-action='confirm']");
    let pageTitle = document.querySelector("body.modal-open.ui-popup-open .modal.modal-ui-popup.modal-bottom.in h3");
    let currentURL = window.location.hostname;

    if (!pageTitle || !confirmButton) {
        return false;
    }

    return !!confirmButton && pageTitle.textContent == "Este usuário já está logado em outra máquina" && currentURL == "erp.tiny.com.br";


}

async function waitForOrderGenerationCompletion() {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (isOrderGeneratorComplete()) {
                console.log("Order Generation Completed!");
                clearInterval(interval);
                resolve();
            } else {
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

    if (window.location.hostname == "accounts.tiny.com.br") {
        console.log('Logging in...');
        await login();

    } else if (await isAnotherSessionWarnPage()) {
        console.log('Another session is already running...');
        console.log('Continuing with this session...');

        let confirmButton = document.querySelector("body.modal-open.ui-popup-open .modal.modal-ui-popup.modal-bottom.in button[popup-action='confirm']");
        if (!!confirmButton) {
            confirmButton.click();
            await sleep(5000);
        }

    } else if (window.location.href != target_url) {
        console.log('Wrong page! Navigating to the target page now...');
        window.location.href = target_url;

    } else {
        console.log('Starting order generation...');

        await sleep(2000);
        ecommerces = getNavTabs();

        // Add a 3 second repetition
        for (let i = 0; i < ecommerces.length; i++) {
            ecommerces[i].click();
            await sleep(5000);

            document.querySelector(".periodos a").click();
            await sleep(1000);
            document.querySelector("#opc-data").click();
            await sleep(1000);
            document.querySelector('.periodos .filter-controls .filter-apply').click()
            await sleep(1000);

            if (!document.querySelector("#lista .empty-state-box")) {
                console.log("Data exists!");

                clickOnSelectAll();
                await sleep(3000);

                await receiveOrders();
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

    if (window.location.href == "https://erp.tiny.com.br/lista_pedidos_ecommerce" ||
        window.location.href == "https://erp.tiny.com.br/lista_pedidos_ecommerce#") {
        console.log('Wait for 1 minute and 30 seconds...');
        await sleep(90000);
        console.log('Time is up!');

    }

    console.log('Automation loop finished!');
    console.log('Starting again...');
    window.location.href = target_url;
});
