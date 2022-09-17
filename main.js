
const campos = document.querySelectorAll('.cmp');
const tabuleiro = []; //Configuração do tabuleiro: -1 = bomba; 0 = campo neutro; > 0 = nº de bombas próximas.
const camposAbrir = []; //Guarda os campos iguais a 0 p/ serme verificados

//P/ fazer:=================

//Se o campo clickado for bomba:
//Mostra todas as posições de bomba
//encerra o jogo.

//Mensagem de derrota
//Mensagem de vitória
//Colocar marcadores de bomba;

//Colocar som ao clickar
//Criar dificuldades diferentes

//O Tabuleiro deve ser gerado quando o usuário der o primeiro click;
//

//Centralizar e mudar a cor dos numeros baseado no tamanho deles
//Adicionar foto de minas nos campos de minas

//Arrumar A GERAÇÃO DO TABULEIRO

//Feito:===================
//Gerar o tabulerio (v)
//Verificar se a posição que o usuário clickou é uma bomba. (v)
//Se não for bomba, deve "debloquear" a área (V)
//Se não for um numero, deve desbloquear todas as casa próximas. (horizontal e vertical) (v)
//Deve continuar liberando os campos até que não tenha mais nenhum campo vazio que não seja número (v)


campos.forEach((td, index) => {
    td.addEventListener('click', () => {
        
        let rodando = true;

        // console.log(index);
        // console.log(campos[index]);

        if(verificaBomba(index)){
            console.log('Perdeu');
            return;
        }

        abreCamposLaterais(index);

        do{

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
//Soma +1 aos campos proximos a bomba
function geraBombas(){
    let valor;

    for(let i = 0; i < 14; i++){
        valor = Math.floor(Math.random() * 72);

        tabuleiro[valor] = -1; 

        if(valor-1 != 0 && tabuleiro[valor-1] != -1){
            tabuleiro[valor-1]++;
        }

        if(valor+1 < 72 && tabuleiro[valor+1] != -1){
            tabuleiro[valor+1]++;
        }

        if(valor+9 < 72 && tabuleiro[valor+9] != -1){
            tabuleiro[valor+9]++;
        }

        if(valor-9 >= 0 && tabuleiro[valor-9] != -1){
            tabuleiro[valor-9]++;
        }
    }
}

//Função que chama todas as outras pra gerar o tabuleiro
function geraTabuleiro(){

    limpaTabuleiro();
    geraBombas();
}

geraTabuleiro();

console.log(tabuleiro);

//Função que verifica o campo que foi clickado. Se for bomba, retorna true.
function verificaBomba(posicao){

    return tabuleiro[posicao] == -1 ?  true : false ;
}

//Função que verifica o campo que foi clickado. Se for número, retorna true.
function verificaNumero(posicao){

    return tabuleiro[posicao] > 0 ?  true : false ;
}

//função que muda a cor do campo(libera) e revela o que tem nele.
function mostraCampo(index){

    campos[index].classList.add("cmp-a");
    campos[index].classList.remove("cmp-f");

    if(verificaNumero(index)){
        campos[index].innerText = tabuleiro[index];
    }
}

//Verifica se o campo informado já foi aberto.
function checaAbertura(index){
    return campos[index].classList.contains("cmp-a") ? true : false;
}

//Função que recebe um index e abre os campos em cima desse index até encontrar um número.
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

//Função que vai liberando os campos até encontrar valores números.
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

