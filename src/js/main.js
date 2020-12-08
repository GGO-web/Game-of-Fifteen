'use strict';

// отримуємо ігрове поле з HTML
const gameField = document.getElementById("game-field");
// кількість клітинок в ігровому полі
const countCells = gameField.dataset.countcells;
// кількість рядків і стовпців поля
const countRows = +Math.sqrt(countCells);
// індекс пустої клітки
let emptyCellIndex = +countCells;

// створення ігрового поля
const createCells = () => {
   // створюємо всі клітки ігрового поля, крім пустої 
   for (let i = 1; i < countCells; ++i) {
      // створюємо елемент-клітку
      const liCell = document.createElement("li");

      // добавляємо їм клас і індекс по порядку 1, 2, 3, 4 ... 8
      liCell.classList.add("game-field__cell");
      liCell.dataset.index = i;

      // добавляємо значення клітинці
      liCell.innerHTML = i;

      // добавляємо готову клітку в HTML
      gameField.appendChild(liCell);
   }
   // створюємо пусту клітку, добавляємо індекс, але не добавляємо значення
   const liCell = document.createElement("li");
   liCell.classList.add("game-field__cell");
   liCell.dataset.index = countCells;
   gameField.appendChild(liCell);
}

// зміна станів ігрових кліток
const switchStates = (cellIndex1, cellIndex2) => {
   // дістали клітинки-елементи з HTML
   const cell1 = gameField.querySelector(`.game-field__cell:nth-child(${cellIndex1})`);
   const cell2 = gameField.querySelector(`.game-field__cell:nth-child(${cellIndex2})`);

   // дістали значення цих кліток
   const val1 = cell1.innerHTML, val2 = cell2.innerHTML;
   // поміняли місцями їх значення
   cell1.innerHTML = val2, cell2.innerHTML = val1;
} 

// перевірка на дотик
const isAdjacentCell = (indexOfCell) => {
   // чи має клітка сусідів відповідно згори, знизу, ліворуч, праворуч?
   let haveTop = true,
      haveBottom = true,
      haveLeft = true,
      haveRight = true;

   // чи має клітка сусідів відповідно ліворуч, праворуч, зверху, знизу?
   if (indexOfCell % countRows === 1) haveLeft = false;
   if (indexOfCell % countRows === 0) haveRight = false;
   if (indexOfCell / countRows <= 1) haveTop = false;
   if (indexOfCell / countRows > countRows - 1) haveBottom = false;

   // чи є одиним із сусідів пуста клітка?
   if (haveLeft && emptyCellIndex === indexOfCell - 1) return true;
   if (haveRight && emptyCellIndex === indexOfCell + 1) return true;
   if (haveTop && emptyCellIndex === indexOfCell - countRows) return true;
   if (haveBottom && emptyCellIndex === indexOfCell + countRows) return true;

   return false;
} 

createCells();

// відслідковуємо клік по ігровому полю
gameField.addEventListener('click', function(event) {
   // клітка, по якій відбувся клік
   const currCell = event.target;
   // значення поточної клітки
   const currCellVal = currCell.innerHTML;

   // клікнули по клітинці чи промахнулись? чи клікнули по пустій клітинці?
   if (currCell.classList.contains("game-field__cell") && currCellVal != "") {
      // індекс поточної клітки
      const indexOfCell = +currCell.dataset.index;

      // чи клітка є суміжною з пустою?
      if (isAdjacentCell(indexOfCell)) {
         // поміняли стани кліток
         switchStates(indexOfCell, emptyCellIndex);
         // змінили індекс пустої клітки
         emptyCellIndex = indexOfCell;
      }
   }
})