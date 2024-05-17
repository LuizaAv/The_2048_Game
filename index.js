

const prompt = require('prompt-sync')({sigint: true})

class Game{
    constructor(){
        this.clickQuantity = 0
        this.elementsStatus = {}
        this.score = 0
        this.matrix = [
                        [0,2,0,0],
                        [0,0,0,0],
                        [0,0,0,0],
                        [0,0,2,0]
                    ]
    }

    printMatrix(){
        this.matrix.forEach(row => {
            console.log(row.join(' '));
        });
    }

    reset(){
        this.matrix.map((item, row) => {
            item.map((item, coloumn) => {
                this.matrix[row][coloumn] = 0
            })
        })

        let elem1 = Math.floor(Math.random() * 4)
        let elem2 = Math.floor(Math.random() * 4)
        let elem3 = Math.floor(Math.random() * 4)
        let elem4 = Math.floor(Math.random() * 4)

        while (elem1 === elem3 && elem2 === elem4) {
            elem3 = Math.floor(Math.random() * 4)
            elem4 = Math.floor(Math.random() * 4)
        }

        this.matrix[elem1][elem2] = 2
        this.matrix[elem3][elem4] = 2

        return this.matrix
    }


    updateElementsStatus(matrix = this.matrix){
        matrix.forEach((item, row) => {
            item.forEach((item, coloumn) => {
                if(item === 0){
                    this.elementsStatus[`element${row}${coloumn}`] = true
                }
            })
        })

        if(Object.keys(this.elementsStatus).length === 0){
            return "The Game Is Over :("
        }
    
        return this.elementsStatus
    }

    generateRandomValue(matrix = this.matrix){
        let addedElem = Math.random() < 0.5 ? 2 : 4
        let randomRowIndex = Math.floor(Math.random() * 4) 
        let randomColoumnIndex = Math.floor(Math.random() * 4)

        if(this.elementsStatus[`element${randomRowIndex}${randomColoumnIndex}`] === true){
            this.elementsStatus[`element${randomRowIndex}${randomColoumnIndex}`] = false
            matrix[randomRowIndex][randomColoumnIndex] = addedElem
        }

        return this.matrix
    }

    increaseTheScore(arg){
        if(typeof arg === "number"){
            this.score += arg
        }
        return `THe score: ${this.score}`
    }
}

class Matrix extends Game{
    constructor(){
        super()
    }

    move(direction){
        if(direction === "t"){
            return this.moveTop()
        }else if(direction === "b"){
            return this.moveBottom()
        }else if(direction === "l"){
            return this.moveLeft()
        }else if(direction === "r"){
            return this.moveRight()
        }else{
            console.log("Enter a valid direction")
                return this.matrix
        }
    }

    moveTop() {

        for(let row = 0; row < this.matrix.length; row++){
            for(let coloumn = 1; coloumn < this.matrix.length; ++coloumn){
                if (this.matrix[coloumn][row] !== 0){
                    let currentRow = coloumn

                    while(currentRow > 0 && this.matrix[currentRow - 1][row] === 0){
                        this.matrix[currentRow - 1][row] = this.matrix[currentRow][row];
                        this.matrix[currentRow][row] = 0;
                        --currentRow
                    }

                    if(currentRow > 0 && this.matrix[currentRow - 1][row] === this.matrix[currentRow][row]){
                        this.matrix[currentRow - 1][row] += this.matrix[currentRow - 1][row]
                        this.increaseTheScore(this.matrix[currentRow - 1][row])

                        this.matrix[currentRow][row] = 0
                    }
                }
            }
        }

        this.updateElementsStatus()
        this.generateRandomValue()

        return this.printMatrix()
    }

    moveBottom() {
        for(let coloumn = 0; coloumn < this.matrix.length; ++coloumn){
            for (let row = this.matrix.length - 2; row >= 0; --row) {
                if (this.matrix[row][coloumn] !== 0) {
                    let currentRow = row

                    while(currentRow < this.matrix.length - 1 && this.matrix[currentRow + 1][coloumn] === 0){
                        this.matrix[currentRow + 1][coloumn] = this.matrix[currentRow][coloumn]
                        this.matrix[currentRow][coloumn] = 0
                        ++currentRow
                    }
                    if(currentRow < this.matrix.length - 1 && this.matrix[currentRow + 1][coloumn] === this.matrix[currentRow][coloumn]){
                        this.matrix[currentRow + 1][coloumn] += this.matrix[currentRow + 1][coloumn]
                        this.increaseTheScore(this.matrix[currentRow + 1][coloumn])

                        this.matrix[currentRow][coloumn] = 0
                    }
                }
            }
        }

        this.updateElementsStatus()
        this.generateRandomValue()

        return this.printMatrix()
    }

    moveRight() {
        for(let row = 0; row < this.matrix.length; row++){
            for(let coloumn = this.matrix.length - 2; coloumn >= 0; --coloumn){
                if(this.matrix[row][coloumn] !== 0){
                    let currentCol = coloumn
            
                    while(currentCol < this.matrix.length - 1 && this.matrix[row][currentCol + 1] === 0){
                        this.matrix[row][currentCol + 1] = this.matrix[row][currentCol]
                        this.matrix[row][currentCol] = 0
                        ++currentCol
                    }

                    if(currentCol < this.matrix.length - 1 && this.matrix[row][currentCol + 1] === this.matrix[row][currentCol]){
                        this.matrix[row][currentCol + 1] += this.matrix[row][currentCol + 1]
                        this.increaseTheScore(this.matrix[row][currentCol + 1])

                        this.matrix[row][currentCol] = 0
                    }
                }
            }
        }

        this.updateElementsStatus()
        this.generateRandomValue()

        return this.printMatrix()
    }

    moveLeft() {
        for(let row = 0; row < this.matrix.length; row++){
            let mergedElems = []
            for(let coloumn = 1; coloumn < this.matrix.length; ++coloumn){
                if(this.matrix[row][coloumn] !== 0){
                    let currentCol = coloumn
                    while(currentCol > 0 && (this.matrix[row][currentCol - 1] === 0 || this.matrix[row][currentCol - 1] === this.matrix[row][currentCol])){
                        if(this.matrix[row][currentCol - 1] === 0){
                            this.matrix[row][currentCol - 1] = this.matrix[row][currentCol]
                            this.matrix[row][currentCol] = 0
                        }else if(this.matrix[row][currentCol - 1] === this.matrix[row][currentCol] && !mergedElems.includes(currentCol - 1)){
                            this.matrix[row][currentCol - 1] += this.matrix[row][currentCol - 1]
                            this.increaseTheScore(this.matrix[row][currentCol - 1])

                            this.matrix[row][currentCol] = 0
                            mergedElems.push(currentCol - 1)
                            break
                        }
                        --currentCol
                    }
                }
            }
        }


        this.updateElementsStatus()
        this.generateRandomValue()

        return this.printMatrix()
    }

    userInput(){
        this.updateElementsStatus()

        while (Object.keys(this.elementsStatus).length !== 0) {
            let result = prompt("Enter the direction please (it can be <t> for top, <b> for bottom, <l> for left, <r> for right): ")
            this.move(result)
            console.log(this.matrix)
            console.log(this.increaseTheScore())
        }

        console.log(" The Game Is Over :( ")
    }

}


const newGame = new Game()
const matric = new Matrix()

console.log(matric.reset())
matric.userInput()








