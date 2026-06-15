const upgrades = {
    clicker: {
        baseCost: 100,
        cost: 100,
        multiplier: 2,
        level: 0,
        costScaling: 2.2,  // each purchase costs 1.8x more
        maxLevel: 10  // maximum level for this upgrade
    },
    autoTralala: {
        baseCost: 500,
        cost: 500,
        level: 0,
        costScaling: 1.7,  // each purchase costs 1.8x more
        maxLevel: 5,  // maximum level for this upgrade
        coinsPerSecond: 1  // generates 1 Rot Coin per second
    }
};


function buyUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];

    if (upgrade.level >= upgrade.maxLevel) return;

    if (rotCoins < upgrade.cost) {
        alertBox("Not enough Rot Coins to buy this upgrade!");
        return;
    }

    rotCoins -= upgrade.cost;
    totalRotCoinsSpent += upgrade.cost;
    upgrade.level++;
    if (upgradeId === 'autoTralala') {
        const rate = upgrades.autoTralala.coinsPerSecond * upgrades.autoTralala.level;
        document.getElementById("autoTralala-rate").textContent = rate;
    }
    updateCPS();

    updateResources();
    floaterLoss(upgrade.cost, event);

    const btn = document.querySelector(`[onClick="buyUpgrade('${upgradeId}')"]`);

    if (upgrade.level >= upgrade.maxLevel) {
        // Just hit max level
        document.getElementById(`${upgradeId}-cost`).textContent = `Max Level Reached!`;
        btn.disabled = true;
        btn.textContent = `Max Level (${upgrade.level}/${upgrade.maxLevel})`;
    } else {
        // Increase cost for next purchase
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costScaling, upgrade.level));
        document.getElementById(`${upgradeId}-cost`).textContent = `Cost: ${upgrade.cost} Rot Coins`;
        btn.textContent = `Buy Upgrade (Lvl ${upgrade.level}/${upgrade.maxLevel})`;
    }
}