
$ = (termino)=>{
    return document.querySelector(termino);
}

$$ = (termino)=>{
    return document.querySelectorAll(termino);
}

generateRandomInt = (min,max)=>{
    return Math.floor((Math.random() * (( max + 1)-min)) +min);
}

let nameP1 = '';
let nameP2 = '';
let player1 = null;
let player2 = null;
let turnos = [];
let contador = 0;

const modalEmpiezaX = $('#modalEmpiezaX');

inicio = () =>{
    console.log('Iniciando...');

    const Players = Object.freeze({
        Primero: 1,
        Segundo: 2,
    })
    player1 = new Jugador(Players.Primero,tableroPlayer1,nameP1);
    player2 = new Jugador(Players.Segundo,tableroPlayer2,nameP2);
    player1.setEnemy(player2);
    player2.setEnemy(player1);

    const numeroRandom = generateRandomInt(1,2);

    if(numeroRandom === 1){
        turnos.push(player1,player2);
    }else{
        turnos.push(player2,player1);
    }
  
    modalEmpiezaX.querySelector('h1').textContent = `Empieza el jugador ${turnos[0].nombre}`;
    modalEmpiezaX.style.display = 'flex';

    setTimeout(async()=>{
        modalEmpiezaX.style.display = 'none';
        main();
        document.addEventListener('ColumnaSeleccionada',function nextPlayer(e){
            if(!isGameDone()){
                main();
            }else{
                const name = turnos[0].puntuacionTotal > turnos[1].puntuacionTotal ? turnos[0].nombre : turnos[1].nombre ;
                setTimeout(()=>{
                    alert(`El jugador ${name} gana`);
                },200);
            }
        });
    },2000)

}

async function main(){
   
    const jugadorTurno = (contador === 0 || (contador % 2 === 0)) ? turnos[0] : turnos[1];
    const numDado = await jugadorTurno.setImageViewAnimate();
    jugadorTurno.HabilitarColumnas();
    contador++;
    
}






function isGameDone(){
    let done = false;
    done = player1.isTableroCompleto() || player2.isTableroCompleto();
    return done;
}



const formulario = $('#formulario');
const btnInicio = $('#btnInicio');

const inputs = $$('.wrapper input');

const tableroPlayer1 = $('#tabPlayer1');
const tableroPlayer2 = $('#tabPlayer2');


inputs[0].addEventListener('input',(e)=>{
    nameP1 = e.target.value;
});

inputs[1].addEventListener('input',(e)=>{
    nameP2 = e.target.value;
});

btnInicio.addEventListener('click',(e)=>{
    if(nameP1 !== '' && nameP2 !== ''){
        formulario.style.display = "none";
        $('#layer1').removeAttribute('hidden');
        $('#layer2').removeAttribute('hidden');
        inicio();
    }else{
        alert('Los nombres de los usuarios deben ser obligatorios');
    }
});




