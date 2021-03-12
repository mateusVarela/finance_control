const transacaoDimensional = document.querySelector("#transacoes")
const exibeSaldo = document.querySelector("#saldo")
const exibeRenda = document.querySelector("#dinheiro-mais")
const exibeDespesa = document.querySelector("#dinheiro-menos")
const form = document.querySelector("#form")
const inputNomeTransacao = document.querySelector("#text")
const inputValorTransacao = document.querySelector("#valor")
/*
let transferencias = [
    { id: 1, name: 'Sálario', quantidade: 1200},
    { id: 2, name: 'Alimentação', quantidade: 200},
    { id: 3, name: 'Tv', quantidade: -250},
    { id: 4, name: 'Net', quantidade: -50},
    { id: 5, name: 'Microondas', quantidade: -50},
    { id: 6, name: 'Dispesas', quantidade: -80},
    { id: 7, name: 'Bebida', quantidade: 0},
    { id: 8, name: 'Lanches', quantidade: -50}
]
*/

const localStorageTransacao = JSON.parse(localStorage.getItem('transferencias'))

const transferencias = localStorage.getItem('transferencias') !== null ? localStorageTransacao : []

const removeTransacao = ID => {
    transferencias = transferencias.filter(transacao => transacao.id !== ID)
    atualizaLocalStorage()
    init()
}

//Função responsável por adicionar transação com descrição na tela.
const addTransacaoNoDom = transacao => {
    const operador = transacao.quantidade < 0 ? '-' : '+'
    const classe = transacao.quantidade < 0 ? 'dinheiro_menos' : 'dinheiro_mais'
    const operacaoQuantidade = Math.abs(transacao.quantidade)
    const li = document.createElement('li')

    li.classList.add(classe)
    li.innerHTML = 
    `
        ${transacao.name} <span> ${operador} R$ ${operacaoQuantidade}</span>
        <button class="delete-btn" onClick="removeTransacao(${transacao.id})">
         x 
        </button>
    `
    transacaoDimensional.append(li)
}


//Função responsavel por atualizar a tela.
const atualizaSaldoDom = () => {
    const transacaoDeValores = transferencias
        .map(transacao => transacao.quantidade)

    const total = +transacaoDeValores
        .reduce((acc, transacao) => acc + transacao, 0)
        .toFixed(2)

    const valorTotalReceitas = transacaoDeValores
        .filter((value) => value > 0)
        .reduce((acc, value) => acc + value, 0)
        .toFixed(2) 

    const valorTotalDispesas = Math.abs(transacaoDeValores
        .filter((value) => value < 0)
        .reduce((acc, value) => acc + value, 0))
        .toFixed(2)

    //
    exibeSaldo.textContent = `R$ ${total}`
    exibeRenda.textContent = `R$ ${valorTotalReceitas}`
    exibeDespesa.textContent = `R$ ${valorTotalDispesas}`

}
//Função responsável por ativar todas as funcções necessárias.
const init = () => {
    transacaoDimensional.innerHTML = ''
    transferencias.forEach(addTransacaoNoDom)
    atualizaSaldoDom()
}

init()

const atualizaLocalStorage = () => {
    localStorage.setItem('transferencias', JSON.stringify(transferencias))
}

const gerandoId = () => Math.round(Math.random() * 1000)

form.addEventListener('submit', event => {
    event.preventDefault()
    
    const transacaoNome = inputNomeTransacao.value.trim()
    const transacaoValor = inputValorTransacao.value.trim()
    
    if (transacaoNome === '' || transacaoValor === '') { 
        alert('Por favor, preencha todos os campos')
        return
    }

    const transacoes = {
        id: gerandoId(), 
        name: transacaoNome, 
        quantidade: +transacaoValor
    }
    
    transferencias.push(transacoes)
    init()
    atualizaLocalStorage()

    inputNomeTransacao.value = ''
    inputValorTransacao.value = ''
})