'use strict';

// отримуємо ігрове поле з HTML
const gameField = document.getElementById("game-field");
// отримуємо вікно вибору розміру поля
const gameFieldSizeWrapper = document.querySelector(".game-field-size-wrapper");
// отримуємо всі кнопти для встановлення розміру поля
const gameFieldSizeButtons = document.querySelectorAll(".game-field-size__button");
// отримуємо кількість ходів
const countMoves = document.getElementById("count-moves");
// отримуємо кнопку перезапуску гри
const gameRestart = document.getElementById("game-restart");
// отримуємо кнопку повернення до меню вибору поля
const gameMenu = document.getElementById("game-menu");
// отримуємо вікно перемоги
const gameWinModalWrapper = document.querySelector(".game-win-modal-wrapper");
// отримуємо кнопку закриття модально вікна перемоги
const gameWinCloseButton = document.querySelector(".game-win-modal__close-button");

// кількість клітинок в ігровому полі
let countCells = gameField.dataset.countcells;
// кількість рядків і стовпців поля
let countRows = +Math.sqrt(countCells);
// індекс пустої клітки
let emptyCellIndex = +countCells;
// кількість ходів
let moves = 0;

// створення ігрового поля
const createCells = () => {
   // створюємо всі клітки ігрового поля, крім пустої 
   for (let i = 1; i < countCells; ++i) {
      // створюємо елемент-клітку
      const liCell = document.createElement("li");

      // добавляємо їм клас і індекс по порядку 1, 2, 3, 4 ... 8
      liCell.classList.add("game-field__cell");
      liCell.dataset.index = i;
      liCell.style.flexBasis = `${100 / countRows}%`;

      // добавляємо значення клітинці
      liCell.innerHTML = i;

      // добавляємо готову клітку в HTML
      gameField.appendChild(liCell);
   }
   // створюємо пусту клітку, добавляємо індекс, але не добавляємо значення
   const liCell = document.createElement("li");
   liCell.classList.add("game-field__cell");
   liCell.dataset.index = countCells;
   liCell.style.flexBasis = `${100 / countRows}%`;
   gameField.appendChild(liCell);
}

// видалення ігрового поля
const removeCells = () => {
   gameField.innerHTML = ``;
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
   // клітинка не належить полю
   if (indexOfCell < 1 || indexOfCell > countCells)
      return false;

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

// закриття вікна вибору розміру поля
const closeGameFieldSize = () => {
   gameFieldSizeWrapper.classList.add("hidden");
}

// відкриття вікна вибору розміру поля
const openGameFieldSize = () => {
   gameFieldSizeWrapper.classList.remove("hidden");
}

// відкриття гри
const openGame = () => {
   const game = document.querySelector(".game-wrapper");
   game.classList.remove("hidden");
}

// закриття гри
const closeGame = () => {
   const game = document.querySelector(".game-wrapper");
   game.classList.add("hidden");
}

// зміна розміру поля
const changeFieldSize = (size) => {
   gameField.dataset.countcells = size;
}

// оновлення глобальних змінних після зміни розміру поля
const updateChanges = () => {
   // обновлюємо кількість клітинок поля
   countCells = gameField.dataset.countcells;
   countRows = +Math.sqrt(countCells);
   emptyCellIndex = +countCells;
}

// обнулення кількості ходів
const resetCountMoves = () => {
   countMoves.innerHTML = `-`;
   moves = 0;
}

// оновлення кількості ходів
const updateCountMoves = () => {
   moves++;
   countMoves.innerHTML = `${moves}`;
}

// повертає випадкове число в інтервалі [1, 4]
const getRandomNumberFrom1to4 = () => {
   return Math.ceil(Math.random() * 4);
}

// повертає індекс клітинки по заданому напрямку, де {1 - top, 2 - right, 3 - bottom, 4 - left}
const getIndexOfCellByDirection = (direction) => {
   let indexOfCell = emptyCellIndex;
   switch (direction) {
      case 1: {
         indexOfCell -= countRows;
         break;
      }
      case 2: {
         indexOfCell++;
         break;
      }
      case 3: {
         indexOfCell += countRows;
         break;
      }
      case 4: {
         indexOfCell--;
         break;
      }
   }

   return indexOfCell;
}

// перемішування ігрового поля
const gameShuffle = () => {
   for (let i = 0; i <= 47; ++i) {
      const direction = getRandomNumberFrom1to4();
      const indexOfCell = getIndexOfCellByDirection(direction);
      if (isAdjacentCell(indexOfCell)) {
         switchStates(emptyCellIndex, indexOfCell);
         emptyCellIndex = indexOfCell;
      }
   }
}

// відкриття вікна перемоги
const openGameWinModal = () => {
   gameWinModalWrapper.classList.remove("hidden");
}

// закриття вікна перемоги
const closeGameWinModal = () => {
   gameWinModalWrapper.classList.add("hidden");
};

const updateGameWinInfo = () => {
   const gameWinScore = document.querySelector(".game-win-modal__score");
   gameWinScore.innerHTML = `${moves}`;
}

// перевірка на виграш
const isGameWin = () => {
   const gameFieldCells = gameField.querySelectorAll('.game-field__cell');
   let currentIndex = 1;
   for (let i = 0; i < countCells - 1; ++i) {
      const index = +gameFieldCells[i].innerHTML;
      //console.log(index, i + 1);
      if (index != i + 1) {
         return false;
      }
   }

   return true;
}

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
         // збільшили кількість ходів
         updateCountMoves();
         // поміняли стани кліток
         switchStates(indexOfCell, emptyCellIndex);
         // змінили індекс пустої клітки
         emptyCellIndex = indexOfCell;
      }

      if (isGameWin()) {
         closeGame();
         updateGameWinInfo();
         openGameWinModal();
      }
   }
})

// відслідковуємо клік по кнопці вибору розміру поля
gameFieldSizeButtons.forEach((item) => {
   item.addEventListener('click', function(event) {
      const gameSize = event.target.dataset.size;

      closeGameFieldSize();
      openGame();

      changeFieldSize(gameSize);
      updateChanges();

      createCells();
      resetCountMoves();
      gameShuffle();
   });
});

// відслідковуємо клік по кнопці перезапуску гри
gameRestart.addEventListener('click', () => {
   resetCountMoves();
   gameShuffle();
})

// відслідковуємо клік по кнопці переходу до меню
gameMenu.addEventListener('click', () => {
   closeGame();
   removeCells();
   openGameFieldSize();
});

gameWinCloseButton.addEventListener('click', () => {
   closeGameWinModal();
   resetCountMoves();
   gameShuffle();
   openGame();
});