let Q1x=[], Q2x=[], Q3x=[], Q4x=[];
let tela = 1;
let velocidade = 15;
let xp = 5, yp = 5;
let pont = 0, texto = "";
let xo, yo;
let barraX;
let barraVel = 15; // velocidade da barra
let numBlocos;
let blocoLargura, blocoAltura;
let barraLargura, barraAltura;

function iniciar(){
    Q1x = []; Q2x = []; Q3x = []; Q4x = [];

    barraLargura = width * 0.15; 
    barraAltura = height * 0.02; 
    barraX = width/2 - barraLargura/2;

    blocoLargura = width * 0.04;  
    blocoAltura = height * 0.03;  

    numBlocos = Math.floor(width / (blocoLargura + 10));

    for(let i=0; i<numBlocos; i++){
        let posX = 10 + i * (blocoLargura + 10);
        Q1x[i] = posX;
        Q2x[i] = posX;
        Q3x[i] = posX;
        Q4x[i] = posX;
    }

    xo = width/2;
    yo = height/2;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    iniciar();
}

function draw() {
    background(tela==2 ? 0 : 255);

    if(tela==1){
        textSize(width*0.03);
        fill(0);
        textAlign(CENTER);
        text('Pressione ENTER para começar o jogo', width/2, height/2);
        if(keyIsDown(ENTER)) tela=2;
    }

    if(tela==2){
        // Setas - movimentação da barra
        if (keyIsDown(LEFT_ARROW)) barraX -= barraVel;
        if (keyIsDown(RIGHT_ARROW)) barraX += barraVel;

        // Limita a barra para não sair da tela
        barraX = constrain(barraX, 0, width - barraLargura);

        // Movimentação da bola
        if(xo > width) xp = -Math.abs(xp);
        if(xo < 0) xp = Math.abs(xp);
        if(yo > height){
            texto = "Game over! Pontuação: " + pont + "\nPressione ENTER para reiniciar";
            tela = 3;
        }
        if(yo < 0) yp = Math.abs(yp);

        xo += xp;
        yo += yp;

        // Colisão bola-barra
        if(dist(barraX, height - barraAltura*2, xo, yo) < barraAltura*2) yp = -Math.abs(yp);
        for(let i = 15; i <= barraLargura; i += 15){
            if(dist(barraX+i, height-barraAltura*2, xo, yo) < 15) yp = -velocidade-3;
        }

        // Desenho da barra e bola
        stroke('silver');   // só para a bola
        strokeWeight(4);
        ellipse(xo, yo, blocoAltura, blocoAltura);

        rect(barraX, height - barraAltura*2, barraLargura, barraAltura); // barra
        stroke('green'); // mantém para outros elementos futuros

        // Colisão com blocos
        for(let linha=0; linha<4; linha++){
            let Q = linha==0? Q1x : linha==1? Q2x : linha==2? Q3x : Q4x;
            let yPos = 10 + linha*(blocoAltura+10);

            // Definindo cores conforme a linha
            let corBloco;
            if(linha==0) corBloco = 'red';   // linha de cima
            else if(linha==1) corBloco = 'green';  // penúltima
            else if(linha==2) corBloco = 'blue';   // próxima da barra
            else corBloco = 'yellow';             // última de baixo

            fill(corBloco);
            noStroke(); // blocos sem borda

            for(let i=0; i<Q.length; i++){
               rect(Q[i], yPos, blocoLargura, blocoAltura);
               if(dist(Q[i]+blocoLargura/2, yPos+blocoAltura/2, xo, yo) < Math.max(blocoAltura, blocoLargura)/2 + 10){
                     Q[i] = 10000; 
                     yp = -velocidade;
                     pont++;
               }
            }
         }

        // Verifica se todos os blocos foram destruídos
        let todosDestruidos = Q1x.every(v => v === 10000) &&
                              Q2x.every(v => v === 10000) &&
                              Q3x.every(v => v === 10000) &&
                              Q4x.every(v => v === 10000);

        if(todosDestruidos){
            texto = "Parabéns! Você venceu! \nPressione ENTER para jogar novamente";
            tela = 4;
        }

        textSize(width*0.02); 
        fill(255);
        textAlign(LEFT);
        text('Pontuação: '+pont, 20, 30);
    }

    if(tela==3){ // Game Over
        textSize(width*0.03);
        fill(0);
        textAlign(CENTER);
        text(texto, width/2, height/2);
        if(keyIsDown(ENTER)){
            tela=2;
            iniciar();
            pont = 0;
        }
    }

    if(tela==4){ // Vitória
        textSize(width*0.03);
        fill(0);
        textAlign(CENTER);
        text(texto, width/2, height/2);
        if(keyIsDown(ENTER)){
            tela=2;
            iniciar();
            pont = 0;
        }
    }
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    iniciar();
}
