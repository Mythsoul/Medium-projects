document.addEventListener("DOMContentLoaded" , ()=>{ 
console.log(6+5)
    const functions = document.querySelectorAll("#function");
    const operators = document.querySelectorAll(".operator"); 
    const numbers = document.querySelectorAll(".number"); 
    let number1 = [];
    let sum = 0;

numbers.forEach(async (num)=>{ 
    num.addEventListener("click" , ()=>{ 
     number.push(num.textContent); 
     console.log(number);
    });     

}); 



    operators.forEach((operator)=>{ 
    operator.addEventListener("click" , ()=>{ 
        
        const work = operator.textContent; 

        switch (work ) {
            case "/":
                console.log("/ clicked"); 
                break;
            case "*" : 
            console.log("* clicked"); 
            break ;
            case "-" : 
            console.log("- clicked"); 
            break; 
            case "+" :
                console.log( "+ clicked"); 
            break; 
        
            default:
                break;
        }
    })
    })
}); 