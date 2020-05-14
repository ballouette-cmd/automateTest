
//googleTest.js

var https = require('https');

var devis_1 = {
    Imatriculation: "DV-058-SH",
    kilometrage: "2455003",
    mail: "TEST@test.com",
    location: "roissy",
    devis: {
        frein: [1, 3, 4],
        SE: [1, true]
    }
}
var devis_2 = {
    Imatriculation: "DN-501-KC",
    kilometrage: "78392",
    mail: "TEST2@test2.com",
    location: "paris",
    devis: {
        frein: [1, 3, 4],
        Amo: [1, true]
    }
}

var devis_3 = {
    Imatriculation: "AE-962-GF",
    mail: "TEST3@test3.com",
    location: "versailles"
}

module.exports = {
    'Demo test ecom service': function (browser) {
            // browser
            //     .url("https://ecom5-itg1.audifrance.fr")
            //     .assert.title('Audi Service')
            //     .setValue('#car_registrationNumber', 'AE-962-GF')
            //     .click('#submit_form_identification');
        connectUrl(browser, devis_1);
    }

}

//connection à l'url
//connect with  car registrationNumber with/without  car mileage
function connectUrl(browser, devis) {
    browser
        .url('https://ecom5.audi.rec1.agence-one.net/vehicule/identification/')
        // .waitForElementVisible('#car_registrationNumber', 3000)
        // .click('#details-button')
        // .click('#proceed-link')
        .setValue('#car_registrationNumber', devis.Imatriculation);
    if (devis.kilometrage) {
        browser.setValue('#car_mileage', devis.kilometrage);
    }
    browser
        .click('#submit_form_identification')
        // .waitForElementVisible('#not-my-car', 3000)
        .click('#is-my-car')
    // .waitForElementVisible('#search_partner', 3000);
    selectLocation(browser, devis.location)
}

//set partner location
function selectLocation(browser, location) {
    browser
        .setValue('#search_partner', location)
        .pause(3000)
        .click('#ui-id-1')
        .pause(3000)
        .click('link text', 'Choisir ce Partenaire')
    // .waitForElementVisible('.ui-freinage', 30000);
    getDevis(browser, devis_1.devis);
}

//select quotation
function getDevis(browser, devis) {
    for (var key in devis) {
        var flag = [devis[key].length - 1]
        if (key == 'frein') {
            devisFrein(browser, devis[key]);
            lastDevis(browser, flag)
        }
        if (key == 'clim') {
            devisClim(browser, devis[key]);
            lastDevis(browser, flag)
        }
        if (key == 'SE') {
            devisSE(browser, devis[key]);
            lastDevis(browser, flag)
        }
        if (key == 'Amo') {
            devisAmo(browser, devis[key]);
            lastDevis(browser, flag)
        }
        else if (key == 'Echap') {
            devisEchap(browser, devis[key]);
            lastDevis(browser, flag);
        }
    }
}

// detect the last quotation
function lastDevis(browser, flag) {
    if (flag == true) {
        browser.click('#quote-btn');
        sendInfo(browser, devis_1);
    }
    else {
        browser.click('link text', 'Ajouter une prestation');
    }
}

// send requester info
function sendInfo(browser, devis) {
    browser
        .waitForElementVisible('#devis-mail-label')
        .click("#devis-mail-label")
        .setValue('#email-contact-quotation', devis.mail)
        .click('#btn-quotation')
        .end();
}

// get brake quotation
function devisFrein(browser, devis) {
    var action = [
        "label[for='321']",
        "label[for='322']",
        "label[for='323']",
        "label[for='324']",
        "label[for='325']",
        "label[for='326']",
        "label[for='327']",
        "label[for='328']"
    ]

    browser
        // .waitForElementVisible('.ui-freinage', 30000)
        .click('.ui-freinage')
        .pause(3000)
    for (var i = 0; i < devis.length; i++) {
        browser.click(action[devis[i] - 1]);
    }
}

//get air conditionning quotation
function devisClim(browser, devis) {
    var action = [
        "label[for='distance297']",
    ]
    browser
        // .waitForElementVisible('.ui-climatisation')
        .click('.ui-climatisation')
    browser.click(action[1]);
}

//get others services
function devisSE(browser, devis) {
    var action = {
        se75000: "label[for='349']",
    }
    browser
        // .waitForElementVisible('.ui-service-entretien')
        .click('.ui-service-entretien')
    for (var i = 0; i < devis.length; i++) {
        if (devis[i] == true) {
            return 0
        }
        else {
            browser
                .click(action[se75000]);
        }
    }
}

//get shock absorber quotation
function devisAmo(browser, devis) {
    var action = [
        "label[for='distance357']",
        "label[for='distance358']"
    ]
    browser
        // .waitForElementVisible('.ui-amortisseur')
        .click('.ui-amortisseur')
    for (var i = 0; i < devis.length; i++) {
        browser
            .click(action[devis[i] - 1])
            .pause(3000)
    }
}

function devisEchap(browser, devis) {
    var action = [
        "label[for='distance336']",
        "label[for='distance360']"
    ]
    browser
        .click('.ui-echappement')
    for (var i = 0; i < devis.length; i++) {
        browser.click(action[i]);
    }
}