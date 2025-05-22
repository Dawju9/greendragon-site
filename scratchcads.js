class ScratchCard {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            width: options.width || 320,
            height: options.height || 160,
            gridSize: options.gridSize || 12,
            rewards: options.rewards || [0, 0, 0, 5, 10, 20, 50, 100, 500],
            requiredScratched: options.requiredScratched || 6
        };

        this.state = {
            scratchedTiles: 0,
            totalWinnings: 0,
            isGameComplete: false,
            isScratching: false
        };

        this.init();
    }

    init() {
        this.createScratchCard();
        this.setupCursor();
        this.setupEventListeners();
        this.shuffledRewards = this.shuffleArray([...this.options.rewards]);
    }

    createScratchCard() {
        this.scratchCard = document.createElement('div');
        this.scratchCard.classList.add('scratch-card');
        this.scratchCard.style.width = `${this.options.width}px`;
        this.scratchCard.style.height = `${this.options.height}px`;

        this.tilesContainer = document.createElement('div');
        this.tilesContainer.classList.add('tiles');
        this.tilesContainer.style.width = `${this.options.width}px`;
        this.tilesContainer.style.height = `${this.options.height}px`;

        this.tiles = Array(this.options.gridSize).fill().map(() => {
            const canvas = document.createElement('canvas');
            canvas.classList.add('tile');
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ccc';
            ctx.fillRect(0, 0, 40, 40);
            return canvas;
        });

        this.tiles.forEach(tile => this.tilesContainer.appendChild(tile));
        this.scratchCard.appendChild(this.tilesContainer);
        this.container.appendChild(this.scratchCard);
    }

    setupCursor() {
        this.cursor = document.createElement('div');
        this.cursor.id = 'scratch-cursor';
        this.scratchCard.appendChild(this.cursor);
    }

    setupEventListeners() {
        this.tiles.forEach((tile, index) => {
            tile.addEventListener('mousemove', event => this.handleMouseMove(event, tile, index));
            tile.addEventListener('mousedown', event => this.handleMouseDown(event, tile, index));
            tile.addEventListener('touchmove', event => this.handleMouseMove(event, tile, index));
        });
    }

    handleMouseMove(event, tile, index) {
        if (this.state.isScratching) {
            this.handleScratch(event, tile, index);
        }
    }

    handleMouseDown(event, tile, index) {
        this.state.isScratching = true;
        this.handleMouseMove(event, tile, index);
    }

    handleScratch(event, tile, index) {
        if (this.state.isGameComplete) return;
        const rect = tile.getBoundingClientRect();
        const x = event.clientX || event.touches?.[0]?.clientX;
        const y = event.clientY || event.touches?.[0]?.clientY;

        if (x < 0 || x > tile.width || y < 0 || y > tile.height) return 0;

        const ctx = tile.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x - rect.left, y - rect.top, 8, 0, Math.PI * 2);
        ctx.fill();

        this.createScratchParticles(ctx, x, y);
        const scratchedPercentage = this.getScratchedPercentage(ctx);
        if (scratchedPercentage > 50) {
            this.state.scratchedTiles++;
            this.revealReward(index, ctx);

            if (this.state.scratchedTiles === this.options.requiredScratched) {
                this.state.isGameComplete = true;
                this.updateStats();
            }
        }
    }

    createScratchParticles(ctx, x, y) {
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 5;
            const particleX = x + Math.cos(angle) * radius;
            const particleY = y + Math.sin(angle) * radius;

            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    getScratchedPercentage(ctx) {
        const imageData = ctx.getImageData(0, 0, 40, 40);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        return (transparentPixels / (40 * 40)) * 100;
    }

    revealReward(index, ctx) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, 40, 40);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, 40, 40);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.shuffledRewards[index] + ' PLN', 20, 20);

        if (this.state.scratchedTiles <= this.options.requiredScratched) {
            this.state.totalWinnings += this.shuffledRewards[index];
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    updateStats() {
        const event = new CustomEvent('scratchcard:complete', {
            detail: {
                totalWinnings: this.state.totalWinnings,
                scratchedTiles: this.state.scratchedTiles
            }
        });
        this.container.dispatchEvent(event);
    }

    reset() {
        this.container.innerHTML = '';
        this.state = {
            scratchedTiles: 0,
            totalWinnings: 0,
            isGameComplete: false,
            isScratching: false
        };
        this.init();
    }
}

