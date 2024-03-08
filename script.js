let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];


function init() {
    render();
}


function render() {
    const contentDiv = document.getElementById('content');
    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateAnimatedCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateAnimatedXSVG();
            }
            // Add onclick attribute to each td element
            tableHTML += `<td onclick="handleClick(${index})">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    contentDiv.innerHTML = tableHTML;
};


function handleClick(index) {
    if (fields[index] === null && !isGameFinished()) {
        fields[index] = getNextSymbol(); // Alternate between 'circle' and 'cross'
        const symbol = fields[index] === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedXSVG();
        document.getElementsByTagName('td')[index].innerHTML = symbol;
        document.getElementsByTagName('td')[index].removeAttribute('onclick'); // Remove onclick event
        if (isGameFinished()) {
            const winningCombination = getWinningIndices();
            if (winningCombination.length > 0) {
                drawWinningLine(winningCombination);
            }
        }
    }
}


function isGameFinished() {
    // Check horizontal lines
    for (let i = 0; i < 3; i++) {
        if (fields[i * 3] && fields[i * 3] === fields[i * 3 + 1] && fields[i * 3] === fields[i * 3 + 2]) {
            return true; // Horizontal line found
        }
    }
    // Check vertical lines
    for (let i = 0; i < 3; i++) {
        if (fields[i] && fields[i] === fields[i + 3] && fields[i] === fields[i + 6]) {
            return true; // Vertical line found
        }
    }
    // Check diagonal lines
    if (fields[0] && fields[0] === fields[4] && fields[0] === fields[8]) {
        return true; // Diagonal line (top-left to bottom-right) found
    }
    if (fields[2] && fields[2] === fields[4] && fields[2] === fields[6]) {
        return true; // Diagonal line (top-right to bottom-left) found
    }
    // Check if all fields are filled (draw)
    if (!fields.includes(null)) {
        return true; // All fields filled (draw)
    }
    return false; // Game not finished
}


function drawWinningLine(combination) {
    const lineColor = '#32CD32';
    const lineWidth = 5;
    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const contentRect = document.getElementById('content').getBoundingClientRect();
    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${ startRect.top + startRect.height / 2 - lineWidth / 2 } px`;
    line.style.left = `${ startRect.left + startRect.width / 2 } px`;
    line.style.transform = `rotate(${ lineAngle }rad)`;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
}


// Get the indices of cells that form the winning combination
function getWinningIndices() {
    const winningLines = [
        [0, 1, 2], // Horizontal top
        [3, 4, 5], // Horizontal middle
        [6, 7, 8], // Horizontal bottom
        [0, 3, 6], // Vertical left
        [1, 4, 7], // Vertical middle
        [2, 5, 8], // Vertical right
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];
    for (const line of winningLines) {
        const [a, b, c] = line;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return line;
        }
    }
    return [];
}


function getNextSymbol() {
    // Function to alternate between 'circle' and 'cross'
    return fields.filter(field => field !== null).length % 2 === 0 ? 'circle' : 'cross';
}


function generateAnimatedCircleSVG() {
    return `<svg width="70" height="70">
                <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5" stroke-dasharray="188">
                    <animate attributeName="stroke-dashoffset" from="188" to="0" dur="1s" fill="freeze" />
                    <animate attributeName="fill" from="none" to="#00B0EF" begin="1s" dur="0.5s" fill="freeze" />
                </circle>
            </svg>`;
}


function generateAnimatedXSVG() {
    return `<svg width="70" height="70">
                <line x1="10" y1="10" x2="60" y2="60" stroke="yellow" stroke-width="5" stroke-linecap="round">
                    <animate attributeName="x2" from="10" to="60" dur="0.5s" fill="freeze" />
                    <animate attributeName="y2" from="10" to="60" dur="0.5s" fill="freeze" />
                </line>
                <line x1="60" y1="10" x2="10" y2="60" stroke="yellow" stroke-width="5" stroke-linecap="round">
                    <animate attributeName="x2" from="60" to="10" dur="0.5s" fill="freeze" />
                    <animate attributeName="y2" from="10" to="60" dur="0.5s" fill="freeze" />
                </line>
            </svg>`;
}