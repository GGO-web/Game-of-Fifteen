'use strict';

const gameField = document.getElementById("game-field");
const countCells = gameField.dataset.countcells;
const countRows = +Math.sqrt(countCells);
let emptyCellIndex = +countCells;

const createCells = () => {
   for (let i = 1; i < countCells; ++i) {
      const liCell = document.createElement("li");
      liCell.classList.add("game-field__cell");
      liCell.dataset.index = i;
      liCell.innerHTML = i;
      gameField.appendChild(liCell);
   }
   const liCell = document.createElement("li");
   liCell.classList.add("game-field__cell");
   liCell.dataset.index = countCells;
   gameField.appendChild(liCell);
}

const switchStates = (cellIndex1, cellIndex2) => {
   const cell1 = gameField.querySelector(`.game-field__cell:nth-child(${cellIndex1})`);
   const cell2 = gameField.querySelector(`.game-field__cell:nth-child(${cellIndex2})`);

   const val1 = cell1.innerHTML, val2 = cell2.innerHTML;
   cell1.innerHTML = val2, cell2.innerHTML = val1;
} 

const isAdjacentCell = (indexOfCell) => {
   let haveTop = true,
       haveBottom = true,
       haveLeft = true,
       haveRight = true;

   if (indexOfCell % countRows === 1) haveLeft = false;
   if (indexOfCell % countRows === 0) haveRight = false;
   if (indexOfCell / countRows <= 1)  haveTop = false;
   if (indexOfCell / countRows > countRows - 1) haveBottom = false;

   //console.log(haveTop, haveRight, haveBottom, haveLeft);

   if (haveLeft && emptyCellIndex === indexOfCell - 1) return true;
   if (haveRight && emptyCellIndex === indexOfCell + 1) return true;
   if (haveTop && emptyCellIndex === indexOfCell - countRows) return true;
   if (haveBottom && emptyCellIndex === indexOfCell + countRows) return true;

   return false;
} 

createCells();

gameField.addEventListener('click', function(event) {
   const currCell = event.target;
   const currCellVal = currCell.innerHTML;
   if (currCell.classList.contains("game-field__cell") && currCellVal != "") {
      const indexOfCell = +currCell.dataset.index;
      console.log(isAdjacentCell(indexOfCell));
      if (isAdjacentCell(indexOfCell)) {
         switchStates(indexOfCell, emptyCellIndex);
         emptyCellIndex = indexOfCell;
      }
   }
})