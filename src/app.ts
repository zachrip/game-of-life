import './app.scss';

// game of life functions

function generateSlots(rows: number, cols: number) {
  const container = document.createElement('div');
  container.classList.add('container');

  let r;
  let c;
  let row: HTMLDivElement;
  let col: HTMLSpanElement;
  let slotNumber = 0;
  for(r = 0; r < rows; r++) {
    row = document.createElement('div');
    row.classList.add('row');

    for(c = 0; c < cols; c++) {
      col = document.createElement('span');
      col.dataset.slotNumber = slotNumber;
      col.classList.add('col');
      row.appendChild(col);
      slotNumber++;
    }

    container.appendChild(row);
  }

  return container;
}

function getNeighborPositions(slotNumber: number, rows: number, cols: number) {
  const count = rows * cols;
  return [
    slotNumber - (cols + 1), // top left
    slotNumber - cols, // top middle
    slotNumber - (cols - 1), // top right
    slotNumber - 1, // middle left
    slotNumber + 1, // middle right
    slotNumber + (cols - 1), // bottom left
    slotNumber + cols, // bottom middle
    slotNumber + (cols + 1) // bottom right
  ].filter((neighbor, index) => {
    // not positive if this logic is flawless, but it seems to work so far
    if(neighbor > 0 && neighbor < count && !(([0, 3, 5].indexOf(index) >= 0 && (neighbor + 1) % cols === 0) || ([2, 4, 7].indexOf(index) >= 0 && neighbor % cols === 0))) {
      return true;
    }
  });
}

function getNeighbors(slotNumber: number, populatedNeighbors: number[], rows: number, cols: number, populated: boolean = true) {
  const neighbors = getNeighborPositions(slotNumber, rows, cols);
  return neighbors.reduce((arr: number[], neighbor: number) => {
    const index = populatedSlots.indexOf(neighbor);
    if(populated && index >= 0 || !populated && index === -1) {
      arr.push(neighbor);
    }
    return arr;
  }, []);
}

function tick(populatedSlots: number[], rows: number, cols: number) {
  const checked = [];
  const newSlots = populatedSlots.reduce((slots, slot, index, arr) => {
    const populatedNeighbors = getNeighbors(slot, populatedSlots, rows, cols);
    const unpopulatedNeighbors = getNeighbors(slot, populatedSlots, rows, cols, false);
    const neighborCount = populatedNeighbors.length;

    // if this slot has 2-3 neighbors, it lives!
    if(neighborCount === 2 || neighborCount === 3) {
      slots.push(slot);
    }

    unpopulatedNeighbors.forEach((slot) => {
      // if we already checked this unpopulated slot, don't check again
      if(checked.indexOf(slot) === -1) {
        const populatedNeighbors = getNeighbors(slot, populatedSlots, rows, cols, true);
        const neighborCount = populatedNeighbors.length;

        if(neighborCount === 3) {
          slots.push(slot);
        }

        checked.push(slot);
      }
    });

    return slots;
  }, []);

  return newSlots;
}

function render(container: HTMLDivElement, oldPopulatedSlots: number[], populatedSlots: number[], removeClasses: string[] = [], addClasses: string[] = []) {
  const slots = container.getElementsByClassName('col');

  // do a diff so we only update necessary nodes
  // a cool side effect of this is if you change
  // the color while it's running, only updated
  // nodes will change color
  oldPopulatedSlots.forEach((s) => {
    if(!(populatedSlots.indexOf(s) >= 0)) {
      const slot = slots[s];
      slot.classList.remove(...removeClasses);
    }
  });

  populatedSlots.forEach((s) => {
    if(!(oldPopulatedSlots.indexOf(s) >= 0)) {
      const slot = slots[s];
      slot.classList.add(...addClasses);
    }
  });

  return container;
}

function paintCell(cell: HTMLElement) {
  const { slotNumber } = cell.dataset;
  const index = populatedSlots.indexOf(parseInt(slotNumber));

  oldPopulatedSlots = [...populatedSlots];

  if(index >= 0) {
    populatedSlots.splice(index, 1);
  } else {
    populatedSlots.push(parseInt(slotNumber));
  }

  const selectedColor = colors[colorPicker.selectedIndex];

  render(container, oldPopulatedSlots, populatedSlots, ['active', ...colors], ['active', selectedColor]);
}

// application code

const rows = 21;
const cols = 21;

const container = generateSlots(rows, cols);
let oldPopulatedSlots = [];
let populatedSlots = [];

function callTick() {
  oldPopulatedSlots = [...populatedSlots];
  populatedSlots = tick(populatedSlots, rows, cols);

  const selectedColor = colors[colorPicker.selectedIndex];
  render(container, oldPopulatedSlots, populatedSlots, ['active', ...colors], ['active', selectedColor]);
}

const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
const colorPicker = document.createElement('select');

colors.forEach((color) => {
  const option = document.createElement('option');
  option.value = color;
  option.text = color;
  colorPicker.appendChild(option);
});

const tickButton = document.createElement('button');
tickButton.innerText = 'Next';

tickButton.addEventListener('click', callTick);

let timer;
const startButton = document.createElement('button');
startButton.innerText = 'Start';

startButton.addEventListener('click', () => {
  if(timer) {
    timer = clearInterval(timer);
    startButton.innerText = 'Start';
  } else {
    timer = setInterval(callTick, 1000);
    startButton.innerText = 'Stop';
  }
});

container.addEventListener('click', (event) => {
  const target = (<HTMLElement>event.target);
  if(target.classList.contains('col')) {
    paintCell(target);
  }
});

container.addEventListener('mouseover', (event) => {
  const target = (<HTMLElement>event.target);
  if(target.classList.contains('col') && event.which === 1) {
    paintCell(target);
  }
});

document.body.appendChild(container);
document.body.appendChild(colorPicker);
document.body.appendChild(tickButton);
document.body.appendChild(startButton);

// kick it off, boss!
render(container, oldPopulatedSlots, populatedSlots, [], []);