class Jugador{

    generateRandomInt = (min,max)=>{
        return Math.floor((Math.random() * (( max + 1)-min)) +min);
    }

    constructor(playerID,tablero, nombre){
        this.id = playerID;
        this.tablero = tablero;
        this.tarjeta = this.tablero.querySelector('.tarjeta');
        this.nombre = nombre;
        this.contador = 0;
        this.punteroContador = null;
        this.matriz= [];
        this.contadorAnimacion = 0;
        this.nextDado = 0;
        this.puntuacionTotal = 0;
        this.enemy = null;

        this.inicio = ()=>{
            this.tarjeta.querySelector('h2').textContent = this.nombre;
            this.punteroContador = this.tarjeta.querySelector('h4');
            this.punteroContador.textContent = this.contador;
            this.displayNoneImgView();
            this.formarTablero();
        }

        this.setEnemy = (enemy)=>{
            this.enemy = enemy;
        }

        this.formarTablero = () =>{
            this.tablero.querySelectorAll('.columna').forEach(div => {
                this.matriz.push({
                    puntero: div, 
                    espacios: this.devolverFormatoEspacios(div)
                });
            });
        }

        this.devolverFormatoEspacios = (div) =>{
            const espacios = [];
            const liS = div.querySelectorAll('li');
            liS.forEach(li=>{
                espacios.push({
                    puntero: li,
                    puntos: 0,
                    doblePoint: false,
                    lleno: false
                });
            });
            return espacios;
        } 

        this.setImageView = (srcImg = '')=>{
            const  punteroImg = this.tarjeta.querySelector('.visualizador img');
            punteroImg.style.display = 'block';
            punteroImg.setAttribute('src',srcImg);
        }

        this.displayNoneImgView = ()=>{
            this.tarjeta.querySelector('.visualizador img').style.display = 'none';
            this.tarjeta.querySelector('.visualizador img').removeAttribute('src');
        }

        this.setImageViewAnimate = ()=>{
            return new Promise((resolve, reject) => {     
                const intervalo = setInterval(()=>{
                    this.contadorAnimacion++;
                    const numerodado = this.generateRandomInt(1,6);
                    this.setImageView(`./imgs/${numerodado}.png`);
                    if(this.contadorAnimacion >= 10){
                        clearInterval(intervalo);
                        this.contador = 0;
                        this.nextDado = numerodado;
                        this.contadorAnimacion = 0;
                        resolve(numerodado);
                    }
                },200);
            })
        }

        this.isTableroCompleto = ()=>{
            let hayEspacios = false;
            this.matriz.forEach(co=>{
                if(!hayEspacios){
                    co.espacios.forEach(li=>{
                        if(!li.lleno && !hayEspacios){
                            hayEspacios = true;
                        }
                    })
                }
            });
            return !hayEspacios;
        }

        this.HabilitarColumnas = ()=>{
            this.matriz.forEach(co=>{
                const canHabil = this.puedeUnaColumnaHabilitarse(co.espacios);
                if(canHabil){
                    this.HabilitarEventos(co.puntero);
                }
            })
        }

        this.puedeUnaColumnaHabilitarse = (espacios = [])=>{
            let canHabil = false;
            espacios.forEach(li=>{
                if(!li.lleno && !canHabil){
                    canHabil = true;
                }
            });
            return canHabil;
        }

        this.HabilitarEventos = (div)=>{
            div.addEventListener('mouseover',this.setActive);
            div.addEventListener('mouseout',this.removeActive);
            div.addEventListener('click',this.DeshabilitarEventos);
        }
        
        this.setActive = (div) =>{
            div.currentTarget.classList.add('active');
        }
        this.removeActive = (div) =>{
            div.currentTarget.classList.remove('active');
        }

        this.DeshabilitarEventos = (div)=>{

            let columnaSeeleccionada;
            this.matriz.forEach(co=>{
                co.puntero.classList.remove('active');
                co.puntero.removeEventListener('click',this.DeshabilitarEventos,false);
                co.puntero.removeEventListener('mouseover',this.setActive,false);
                co.puntero.removeEventListener('mouseout',this.removeActive,false);
                if(co.puntero.id === div.currentTarget.id){
                    columnaSeeleccionada = co;
                }
                
            })
            this.SelectLi(columnaSeeleccionada);
        }

        this.SelectLi = (columna) =>{
            let insertado = false;
            if(this.id === 1){
                for(let index = (columna.espacios.length - 1);index >= 0 && !insertado; index--){
                    if(!columna.espacios[index].lleno){
                        insertado = this.controladorLi(columna,columna.espacios[index]);
                    }
                }
            }else{
                columna.espacios.forEach(e=>{
                    if(!e.lleno &&!insertado){
                        insertado = this.controladorLi(columna,e);
                    }
                })
            }
        }

        this.controladorLi = (columna, li)=>{
            li.puntos = this.nextDado;
            const doublePoint = this.isDoblePoint(columna.espacios,this.nextDado);
            li.lleno = true;
            li.doblePoint = doublePoint;
            if(doublePoint){
                this.setFilterImgClass(li.puntero.querySelector('img'));
            }
            this.updateContadorColumna(columna);
            this.updateGolbalContador();
            this.setLiImage(li.puntero);
            this.updateColumnaEnemy(columna,this.nextDado);
            this.nextDado = 0;
            return true;
        }

        this.isDoblePoint = (espacios = [], dado) =>{
            	
            let doublePoint = false;

            espacios.forEach(e=>{
                if(e.lleno && e.puntos === dado){
                    doublePoint = true;
                    e.doblePoint = true;
                    this.setFilterImgClass(e.puntero.querySelector('img'));
                }
            });

            return doublePoint;

        }

        this.updateContadorColumna = (columna) =>{
            const texto = columna.puntero.querySelector('h2');
            let total = 0;
            columna.espacios.forEach(li=>{
                if(li.lleno){
                    if(li.doblePoint){
                        total += (li.puntos * 2);
                    }else{
                       total += li.puntos; 
                    }
                }
            });
            texto.textContent = total;
            
        }

        this.updateGolbalContador = () =>{
            let total = 0; 
            this.matriz.forEach(m=>{
                m.espacios.forEach(li=>{
                    if(li.lleno){
                        if(li.doblePoint){
                            total += (li.puntos * 2);
                        }else{
                           total += li.puntos; 
                        }
                    }
                })
            });
            this.punteroContador.textContent = total;
            this.puntuacionTotal = total;
        }

        this.updateColumnaEnemy = (columna, dado) =>{
            const idColumna = parseInt(columna.puntero.id.split('-')[1]);
            this.enemy.matriz[idColumna-1].espacios.forEach(li =>{
                if(li.lleno){
                    if(li.puntos === dado){
                        li.puntos = 0;
                        li.lleno = false;
                        li.doblePoint = false;
                        this.enemy.removeFilterImgClass(li.puntero.querySelector('img'));
                        this.enemy.removeImgLi(li.puntero.querySelector('img'));
                    }
                }
            })

            this.enemy.updateContadorColumna(this.enemy.matriz[idColumna-1]);
            this.enemy.updateGolbalContador();
        }

        this.setFilterImgClass = (img)=>{
            img.classList.add('sepiaFilterImg');
        }

        this.removeFilterImgClass = (img)=>{
            img.classList.remove('sepiaFilterImg');
        }
        this.removeImgLi = (img)=>{
            img.removeAttribute('src');
            img.style.display = 'none';
        }

        this.setLiImage = (li) =>{
            const imgLi = li.querySelector('img');
            imgLi.setAttribute('src',`./imgs/${this.nextDado}.png`);
            imgLi.style.display = 'block';
            this.remuveImageView();
            let evento = new Event("ColumnaSeleccionada");
            document.dispatchEvent(evento);
        }

        this.remuveImageView = () =>{
            const  punteroImg = this.tarjeta.querySelector('.visualizador img');
            punteroImg.removeAttribute('src');
            punteroImg.style.display = 'none';
        }



       

        this.inicio();
    }
}
