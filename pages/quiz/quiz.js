import { verificarTema,  trocarTema } from "../../helpers/tema-helper.js"

const botaoTema = document.querySelector(".tema button")
const body = document.querySelector("body")
const assunto = localStorage.getItem ("assunto")

let quiz = {}
let pontos = 0
let perguntas = 1
let respostas = ""
let idInputRespostas = ""
let respostaCorretaId = ""
                                                                    
botaoTema.addEventListener("click", () => {
    trocarTema(body, botaoTema)
})




verificarTema(body, botaoTema)





function alterarAssunto() {
    const divIcone = document.querySelector(".assunto_icone")
    const iconeImg = document.querySelector(".assunto_icone img")
    const assuntoTitulo = document.querySelector(".assunto h1")

    divIcone.classList.add (assunto.toLowerCase())
    iconeImg.setAttribute("src",`../../assets/images/icon-${assunto.toLowerCase()}.svg`)
    assuntoTitulo.innerText = assunto
    iconeImg.setAttribute("alt", `icone de ${assunto}`)
}


async function buscarPerguntas () {
    const urlDados = "../../data.json"

    await fetch(urlDados).then(resposta => resposta.json()).then(dados => {
        dados.quizzes.forEach(dado => {
            if(dado.title === assunto) {
                quiz = dado
            }
        })

    })
    
}


function montarPergunta () {
    const main = document.querySelector("main")
    main.innerHTML =  `
            <section class="pergunta">
        <div>
            <p>Questão ${perguntas} de 10</p>

            <h2>${alterarSinais(quiz.questions[perguntas-1].question)}</h2>
        </div>
    <div class="barra_progresso">
      <div style="width: ${perguntas * 10}%"></div>  
    </div>
    </section>
    <section class="alternativas">
        <form action="">
        <label for="alternativa_a">
            <input type="radio" id="alternativa_a" name="alternativa" value= "${alterarSinais(quiz.questions[perguntas-1].options[0])}">
            <div>
                <span>A</span>
                ${alterarSinais(quiz.questions[perguntas-1].options[0])}
            </div>
        </label>
        <label for="alternativa_b">
            <input type="radio" id="alternativa_b" name="alternativa" value="${alterarSinais(quiz.questions[perguntas-1].options[1])}">
            <div>
                <span>B</span>
                ${alterarSinais(quiz.questions[perguntas-1].options[1])}
            </div>
        </label>
        <label for="alternativa_c">
            <input type="radio"  id="alternativa_c" name="alternativa" value="${alterarSinais(quiz.questions[perguntas-1].options[2])}">
            <div>
                <span>C</span>
                ${alterarSinais(quiz.questions[perguntas-1].options[2])}
            </div>
        </label>
        <label for="alternativa_d">
            <input type="radio" id="alternativa_d" name="alternativa" value="${alterarSinais(quiz.questions[perguntas-1].options[3])}">
            <div>
                <span>D</span>
                ${alterarSinais(quiz.questions[perguntas-1].options[3])}
            </div>
        </label>
        </form>
        <button>
            Responder
        </button>
    </section>
`
}

function alterarSinais(texto) {
    return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function guardarRespostas(evento) {
    respostas = evento.target.value
    idInputRespostas= evento.target.id

    const botaoEnviar = document.querySelector(".alternativas button")
    botaoEnviar.addEventListener("click", validarRespostas)

}


function validarRespostas() {
    const botaoEnviar =  document.querySelector(".alternativas button")
    botaoEnviar.innerText = "Proxima"
    botaoEnviar.removeEventListener("click", validarRespostas)
    botaoEnviar.addEventListener("click", proximaPergunta)
    
    if (perguntas === 10) {
        botaoEnviar.addEventListener("click", finalizar)
        botaoEnviar.innerText = "finalizar"
    }
    
    if (respostas === quiz.questions[perguntas-1].answer) {
        document.querySelector(`label[for='${idInputRespostas}']`).setAttribute("id", "correta")
        pontos = pontos + 1 }
        else {
            document.querySelector(`label[for='${idInputRespostas}']`).setAttribute("id", "errada")
            document.querySelector(`label[for='${respostaCorretaId}']`).setAttribute("id", "correta")

        }
        perguntas = perguntas + 1
        
    }

function finalizar() {
    localStorage.setItem("pontos", pontos)
    window.location.href = "/../pages/resultado/resultado.html"
}
function proximaPergunta() {
    montarPergunta()
    adicionarEventoInputs()
    
    

}

function adicionarEventoInputs() {
    const inputsRespostas = document.querySelectorAll(".alternativas input")
    inputsRespostas.forEach(input => {
        input.addEventListener("click", guardarRespostas)
        if (input.value === quiz.questions[perguntas-1].answer) {
            respostaCorretaId = input.id

        }
    })
}


async function iniciar() {
    alterarAssunto()
    await buscarPerguntas()
    montarPergunta()
    adicionarEventoInputs()
    



}


iniciar()