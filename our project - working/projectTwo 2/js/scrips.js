const MINUTE = 1000 * 60;
const PAGES = {
    HOME: 'homeContainer',
    LIVE_REPORTS: 'liveReportsContainer',
    ABOUT: 'aboutContainer',
};

let currentPage = PAGES.HOME;

$(function () {
    function init() {
        $("#mainContainer").append('<div id="homeContainer"></div>');
        onHomeCreated();

        // Events registration
        $("#btnHome").on("click", function () {
            if (currentPage === PAGES.HOME) {
                return;
            }
            currentPage = PAGES.HOME;
            $("#mainContainer").empty();
            $("#mainContainer").append('<div id="homeContainer"></div>');
            onHomeCreated();
        })
        $("#btnLiveReports").on("click", function () {
            if (currentPage === PAGES.LIVE_REPORTS) {
                return;
            }
            currentPage = PAGES.LIVE_REPORTS;
            $("#mainContainer").empty();
            $("#mainContainer").append('<div id="liveReportsContainer"><p>Live Reports</p></div>');
        })
        $("#btnAbout").on("click", function () {
            if (currentPage === PAGES.ABOUT) {
                return;
            }
            currentPage = PAGES.ABOUT;
            $("#mainContainer").empty();
            $("#mainContainer").append('<div id="aboutContainer"><p>About</p></div>');
        })
    }

    init();
});

function onHomeCreated() {
    const cachedConinsStr = localStorage.getItem('coins');
    if (!cachedConinsStr) {
        $("#mainContainer")
            .append(`
            <div class="d-flex align-items-center" style="width:300px">
                <strong>Loading Data...</strong>
                <div class="spinner-border ms-auto" role="status" aria-hidden="true">
                </div>
            </div>`
            );
    }

    if (cachedConinsStr) {
        const cachedConins = JSON.parse(cachedConinsStr);

        // If 2 minutes passed
        if (new Date().getTime() - cachedConins.lastUpdate < MINUTE * 0.5) {
            cardsView(cachedConins.coinsData);
            return;
        }
    }



    $.ajax({
        type: 'GET',
        url: "https://api.coingecko.com/api/v3/coins",
        success: function (coinsData) {
            localStorage.setItem("coins", JSON.stringify({
                coinsData,
                lastUpdate: new Date().getTime(),
            }));
            cardsView(coinsData);
        }
    });
};

function cardsView(coinsData) {
    let output = '';
    $.each(coinsData, (index, coin) => {
        output += `
                    <div class="card" id="card-${coin.id}">
                            <div class="card-body" id="${coin.id}>
                                <div class="upperCardContainer" id="titleCoinContainer-${coin.id}">
                                    <img src="${coin.image.small}" style="highet:60px, width: 60px" />
                                    <h5 class="card-title">${coin.symbol}</h5>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault-${coin.id}" onclick="saveCoinToReports('${coin.id}')">
                                    </div>
                                </div>
                                <div class="card-text">${coin.name}</div>

                                <divid="moreInfoContainer-${coin.id}">
                                    <button class="btn btn-warning" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#moreInfoContainer-${coin.id}" aria-expanded="false" aria-controls="collapseExample" onclick="moreInfo('${coin.id}')">
                                        More Info
                                    </button>
                                
                                    <div id="accordion-${coin.id}">
                                        <div class="collapse" id="moreInfoContainer-${coin.id}">
                                            <div class="card" id="infoCard-${coin.id}">
                                                
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>    
                    </div>
                `;
    });

    $('#homeContainer').append(output);
    return false;
}


let infoCoins = [];

function moreInfo(id) {

    if (!infoCoins.length) {
        infoCoins.push(id);
        moreInfoView(id);

    }

    let idExist = 0;
    for (i = 0; i < infoCoins.length; i++) {
        if (infoCoins[i] == id) {
            idExist++;
        }
    }

    if (idExist == 0) {
        infoCoins.push(id);
        moreInfoView(id);
    }

    console.log("infoCoins" + infoCoins);
}

function moreInfoView(id) {
    $.ajax({
        type: 'GET',
        url: `https://api.coingecko.com/api/v3/coins/${id}`,
        success: function (coinInfo) {
            console.log(coinInfo.market_data.current_price.usd);

            localStorage.setItem(`moreInfoPressed-${id}`, JSON.stringify({
                coinInfo,
                lastUpdate: new Date().getTime(),
            }));
            $(`#infoCard-${id}`).append(`<b>${coinInfo.market_data.current_price.usd} $<br>${coinInfo.market_data.current_price.eur} €<br>${coinInfo.market_data.current_price.ils} ₪<b>`);

        }
    });
}

let coinsCounter = 0;
let listOfCoinsToReports = [];

function saveCoinToReports(id) {
    if (!listOfCoinsToReports.length) {
        listOfCoinsToReports.push(id);
        localStorage.setItem("coinsToPresentOnReports" , JSON.stringify({
            id: listOfCoinsToReports
        }))
        coinsCounter++;
    }

    let idExist = 0;

    for (i = 0; i < listOfCoinsToReports.length; i++) {
        if (listOfCoinsToReports[i] == id) {
            idExist++;   
        }
        if(idExist ==1) {
            localStorage.coinsToPresentOnReports
            
        }
        
    }

    if (idExist == 0) {
        listOfCoinsToReports.push(id);
        localStorage.setItem("coinsToPresentOnReports" , JSON.stringify({
            listOfCoinsToReports
        }))
        coinsCounter++;
    }

    
    $("#coinsSelected").empty();
    $("#coinsSelected").append(`${coinsCounter} coins were picked for live Reports`);
    console.log("listOfCoinsToReports:" + " " + listOfCoinsToReports);
    
    if(listOfCoinsToReports == 5) {
        showCoinsToReport();
        
    }

}

function showCoinsToReport() {
    $("#coinsSelectedCounter").empty();
    $("#coinsSelectedCounter").append("zain");
}

