
const campos = document.querySelectorAll('.cmp');
const tabuleiro = []; //Configuração do tabuleiro: -1 = bomba; 0 = campo neutro; > 0 = nº de bombas próximas.
const camposAbrir = []; //Guarda os campos iguais a 0 p/ serme verificados

let tabuVisua = [[],[],[],[],[],[],[]];

//P/ fazer:=================

//Se o campo clickado for bomba:
//Mostra todas as posições de bomba
//encerra o jogo.

//Mensagem de derrota
//Mensagem de vitória
//Colocar marcadores de bomba;

//Colocar som ao clickar
//Criar dificuldades diferentes
//Adicionar foto de minas nos campos de minas


//Feito:===================
//Gerar o tabulerio (v)
//Verificar se a posição que o usuário clickou é uma bomba. (v)
//Se não for bomba, deve "debloquear" a área (V)
//Se não for um numero, deve desbloquear todas as casa próximas. (horizontal e vertical) (v)
//Deve continuar liberando os campos até que não tenha mais nenhum campo vazio que não seja número (v)
//Arrumar A GERAÇÃO DO TABULEIRO(v);
//Centralizar e mudar a cor dos numeros baseado no tamanho deles(v)
//O Tabuleiro deve ser gerado quando o usuário der o primeiro click;(v)

campos.forEach((td, index) => {
    td.addEventListener('click', () => {
        
        let rodando = true;

        //primeiro click do usuário
        if(tabuleiro[0] == undefined){
            geraTabuleiro(index);
        }

        //clickou na bomba?
        if(verificaBomba(index)){
            console.log('Perdeu');
            return;
        }

        abreCamposLaterais(index);

        do{//libera os campos adjacentes a todos os 0 encontrados

            if(camposAbrir.length != 0){   
                console.log(camposAbrir[0]);
                abreCamposLaterais(camposAbrir[0]);
                camposAbrir.shift();

            }else{
                rodando = false;
            }

        }while(rodando);

    });
});

//Preenche toda a matriz com 0 (campo neutro);
function limpaTabuleiro(){

    for(let i = 0; i < 72; i++){
        tabuleiro[i] = 0; 
    }
}

//Sorteia posições no tabuleiro para serem bombas
//Inicialmente gera 14 bombas (fácil)
function geraBombas(click){
    let indice;

    for(let i = 0; i < 14; i++){
      
        do{
            indice = Math.floor(Math.random() * 72);

        }while(tabuleiro[indice] == -1 || indice == click);

        tabuleiro[indice] = -1; 
    }
}

//Soma +1 aos campos laterais a bomba.
//Desconsidera diagonais
function verificaBombaProxima(){

    for(let i = 0; i < 72; i++){
       if(tabuleiro[i] == -1){
                                                //Prox linha
            if(i-1 >= 0 && tabuleiro[i-1] != -1 && i%9 != 0){
                tabuleiro[i-1]++;
            }
                                                //Prox linha
            if(i+1 < 72 && tabuleiro[i+1] != -1 && (i+1)%9 != 0){
                tabuleiro[i+1]++;
            }

            if(i+9 < 72 && tabuleiro[i+9] != -1){
                tabuleiro[i+9]++;
            }

            if(i-9 >= 0 && tabuleiro[i-9] != -1){
                tabuleiro[i-9]++;
            }
       }
    }
}

//chama todas as outras funções pra gerar o tabuleiro
function geraTabuleiro(click){

    limpaTabuleiro();
    geraBombas(click);
    verificaBombaProxima();
}

//Verifica se o campo clickado é uma bomba.
function verificaBomba(posicao){

    return tabuleiro[posicao] == -1 ?  true : false ;
}

//Verifica se o campo clickado é um número.
function verificaNumero(posicao){

    return tabuleiro[posicao] > 0 ?  true : false ;
}

//Muda a cor do campo(libera) e revela o que tem nele.
//Muda a cor dos numeros;
function mostraCampo(index){

    campos[index].classList.add("cmp-a");
    campos[index].classList.remove("cmp-f");

    if(verificaNumero(index)){
        campos[index].innerText = tabuleiro[index];

        if(tabuleiro[index] == 1){
            campos[index].classList.add("um");

        }else if(tabuleiro[index] == 2){
            campos[index].classList.add("dois");

        }else if(tabuleiro[index] == 3){
            campos[index].classList.add("tres");

        }else if(tabuleiro[index] == 4){
            campos[index].classList.add("quatro");
        }
    }
}

//Verifica se o campo informado já foi aberto.
function checaAbertura(index){
    return campos[index].classList.contains("cmp-a") ? true : false;
}

//recebe um index e abre os campos em cima desse index até encontrar um número.
function abreCamposCima(index){

    for(let x = index-9;  x > -1; x-= 9){
       
        if(checaAbertura(x)){
            return;
        }

        mostraCampo(x);

        if(verificaNumero(x))
          return;

        camposAbrir.push(x);

    }
}

//Recebe um index e abre os campos embaixo desse index até achar um numero.
function abreCamposBaixo(index){

    for(let x = index+9;  x < 72; x+= 9){
       
        if(checaAbertura(x)){
            return;
        }

        mostraCampo(x);

        if(verificaNumero(x))
            return;

        camposAbrir.push(x);

    }
}

//Recebe um index e abre os campos a direita desse index até achar um numero.
function abreCamposDireita(index, max){

    for(let y = index+1; y < max; y++){

        if(checaAbertura(y)){
            return;
        }

        mostraCampo(y);

        if(verificaNumero(y))
            return;
    
        camposAbrir.push(y);
    }
}

//Recebe um index e abre os campos a esquerda desse index até achar um numero.
function abreCamposEsquerda(index, max){

    for(let y = index-1;  y >= max; y--){

        if(checaAbertura(y)){
            return;
        }

        mostraCampo(y);

        if(verificaNumero(y)){
            return;
        }

        camposAbrir.push(y);
    }

    return;
}

//Função que vai liberando os campos até encontrar números.
function abreCamposLaterais(index){

    //Limite do tabuleiro:
    const maxDir = Math.floor(((index/9)+1))*9; 
    const maxEsq = Math.floor((index/9))*9; 
    
    if(verificaNumero(index)){
        mostraCampo(index);
        return;
    }

    mostraCampo(index);

    abreCamposEsquerda(index, maxEsq);
    abreCamposDireita(index, maxDir);
    abreCamposBaixo(index);
    abreCamposCima(index);
}

