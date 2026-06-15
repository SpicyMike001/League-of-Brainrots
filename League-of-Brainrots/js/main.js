let clicksThisSecond = 0;
let clickCPS = 0;

let statsInterval = null;

document.addEventListener('contextmenu', event => event.preventDefault());

setInterval(() => {
    totalTimePlayed++;
}, 1000);


// Track clicks
setInterval(() => {
    clickCPS = clicksThisSecond;
    clicksThisSecond = 0;
    updateCPS();
}, 1000);

setInterval(() => {
    const auto = upgrades.autoTralala;
    if (auto.level === 0) return;
    const generated = auto.coinsPerSecond * auto.level;
    rotCoins += generated;
    totalRotCoins += generated;
    updateResources();
    updateCPS();
}, 1000);

const backgrounds = {
    "brainrot-1": "/assets/images/backgrounds/background-1.png"
};

window.onload = () => {
    const brainrot = document.getElementById("brainrot-1");
    document.body.style.backgroundImage = `url('${backgrounds[brainrot.id]}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}

function updateResources() {
    document.getElementById("rot-coins").innerHTML =
        `<span style="color: gold;">${rotCoins}</span><img src="/assets/images/resources/rotcoin.png" alt="Rot Coin" width="20" height="20">`;
    document.getElementById("rot-shards").innerHTML =
        `<span style="color: cyan;">${rotShards}</span><img src="/assets/images/resources/rotshard.png" alt="Rot Shard" width="20" height="20">`;
    document.getElementById("brainrot-essence").innerHTML =
        `<span style="color: magenta;">${brainrotEssence}</span><img src="/assets/images/resources/brainrot-essence.png" alt="Brainrot Essence" width="20" height="20">`;
}

function alertBox(message) {
    const existing = document.getElementById("alert-box");
    if (existing) existing.remove();

    const box = document.createElement("div");
    box.id = "alert-box";
    box.textContent = message;
    document.body.appendChild(box);

    setTimeout(() => {
        box.classList.add("fade-out");
        box.addEventListener("animationend", () => box.remove());
    }, 2000);
}

function floaterGain(amount, event) {
    const floater = document.createElement("div");
    floater.textContent = "+" + amount;
    floater.classList.add("coin-floater-gain");
    floater.style.left = event.clientX + "px";
    floater.style.top = event.clientY + "px";
    document.body.appendChild(floater);
    floater.addEventListener("animationend", () => floater.remove());
}

function floaterLoss(amount, event) {
    const floater = document.createElement("div");
    floater.textContent = "-" + amount;
    floater.classList.add("coin-floater-loss");
    floater.style.left = event.clientX + "px";
    floater.style.top = event.clientY + "px";
    document.body.appendChild(floater);
    floater.addEventListener("animationend", () => floater.remove());
}

function clickBrainrot(img, event) {
    const clickValue = 1 * Math.pow(upgrades.clicker.multiplier, upgrades.clicker.level);
    rotCoins += clickValue;
    totalRotCoins += clickValue;
    totalClicks++;
    clicksThisSecond++;
    updateResources();
    floaterGain(clickValue, event);
    img.classList.remove("pop");
    void img.offsetWidth;
    img.classList.add("pop");
}

function clickMenuIcon(icon) {
    icon.style.backgroundColor = "rgba(220, 220, 220, 1)";
    setTimeout(() => {
        icon.style.backgroundColor = "";
    }, 100);
    icon.classList.remove("iconpop");
    void icon.offsetWidth;
    icon.classList.add("iconpop");

    if (icon.alt === "Stats") openPopup("stats-popup");
    if (icon.alt === "Store") openPopup("shop-popup");
}

function updateCPS() {
    const autoCPS = upgrades.autoTralala.coinsPerSecond * upgrades.autoTralala.level;
    const totalCPS = autoCPS + (clickCPS * Math.pow(upgrades.clicker.multiplier, upgrades.clicker.level));
    document.getElementById("coinspersecond").textContent = totalCPS + " Rot Coins per second";
}

// ── Popup helpers ──────────────────────────────────────

function openPopup(id) {
    document.getElementById(id).classList.remove("hidden");

    if (id === "stats-popup") {
        updateStatsPopup(); // immediate update

        // start real-time updates
        statsInterval = setInterval(updateStatsPopup, 500); // every 0.5s
    }
}

function closePopup(id) {
    document.getElementById(id).classList.add("hidden");

    // stop real-time updates when closed
    if (id === "stats-popup") {
        clearInterval(statsInterval);
        statsInterval = null;
    }

}

function updateStatsPopup() {
    document.getElementById("stat-totalRotCoins").textContent = totalRotCoins;
    document.getElementById("stat-totalRotCoinsSpent").textContent = totalRotCoinsSpent;
    document.getElementById("stat-totalRotShards").textContent = totalRotShards;
    document.getElementById("stat-totalRotShardsSpent").textContent = totalRotShardsSpent;
    document.getElementById("stat-totalBrainrotEssence").textContent = totalBrainrotEssence;
    document.getElementById("stat-totalBrainrotEssenceSpent").textContent = totalBrainrotEssenceSpent;
    document.getElementById("stat-totalClicks").textContent = totalClicks;
    document.getElementById("stat-totalTimePlayed").textContent = formatTime(totalTimePlayed);
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function buyItem(item, currency, price) {
    const currencyMap = {
        rotcoin: () => rotCoins,
        rotshard: () => rotShards,
        brainrotessence: () => brainrotEssence,
    };

    const setCurrencyMap = {
        rotcoin: (v) => { rotCoins = v; },
        rotshard: (v) => { rotShards = v; },
        brainrotessence: (v) => { brainrotEssence = v; },
    };

    const itemMap = {
        rotcoin: () => { rotCoins += getItemAmount(item); totalRotCoins += getItemAmount(item); updateResources(); },
        rotshard: () => { rotShards += getItemAmount(item); totalRotShards += getItemAmount(item); updateResources(); },
        brainrotessence: () => { brainrotEssence += getItemAmount(item); totalBrainrotEssence += getItemAmount(item); updateResources(); },
    };

    const getCurrent = currencyMap[currency];
    const setCurrent = setCurrencyMap[currency];

    if (!getCurrent || !setCurrent) return alertBox("Unknown currency.");
    if (!itemMap[item]) return alertBox("Unknown item.");

    if (getCurrent() < price) {
        alertBox("Not enough " + currency + "!");
        return;
    }

    setCurrent(getCurrent() - price);
    trackSpent(currency, price);
    itemMap[item]();
}

function getItemAmount(item) {
    const amounts = {
        rotcoin: 1000,
        rotshard: 50,
        brainrotessence: 5,
    };
    return amounts[item] ?? 1;
}

function trackSpent(currency, price) {
    if (currency === "rotcoin") totalRotCoinsSpent += price;
    if (currency === "rotshard") totalRotShardsSpent += price;
    if (currency === "brainrotessence") totalBrainrotEssenceSpent += price;
}