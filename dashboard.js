document.addEventListener('DOMContentLoaded', () => {
    const balanceDisplay = document.getElementById('balance');
    const sendMoneyButton = document.getElementById('sendMoney');
    const requestMoneyButton = document.getElementById('requestMoney');
    

    let balance = 0;

    const updateBalance = (amount) => {
        balance += amount;
        balanceDisplay.textContent = `$${balance.toFixed(2)}`;
    };

    const scratchCardContainer = document.createElement('div');
    scratchCardContainer.className = 'scratch-card-container';
    document.querySelector('#home').appendChild(scratchCardContainer);

    const scratchCard = new ScratchCard(scratchCardContainer, {
        rewards: [0, 0, 0, 5, 10, 20, 50, 100, 500],
        requiredScratched: 6
    });

    scratchCardContainer.addEventListener('scratchcard:complete', (event) => {
        updateBalance(event.detail.totalWinnings);
        setTimeout(() => {
            scratchCard.reset();
        }, 2000);
    });

    sendMoneyButton.addEventListener('click', () => {
        const amount = parseFloat(prompt('Enter amount to send:'));
        if (amount && amount <= balance) {
            updateBalance(-amount);
        }
    });

    requestMoneyButton.addEventListener('click', () => {
        const amount = parseFloat(prompt('Enter amount to request:'));
        if (amount) {
            alert(`Money request for $${amount.toFixed(2)} has been sent`);
        }
    });
});

