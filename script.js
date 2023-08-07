let modalKey = 0

// variavel para controlar a quantidade inicial de pizzas na modal
let quantPizzas = 1

let cart = [] // carrinho

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0 // transparente
    seleciona('.pizzaWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.pizzaWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.pizzaWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
   //forEach: para cada 
    selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

//Passar pizzaItem e item como parâmetros permite que a função saiba em qual elemento HTML deve preencher as informações (o pizzaItem) e quais informações específicas da pizza devem ser preenchidas (o item)
const preencheDadosDasPizzas = (pizzaItem, item, index) => {
    // setar um atributo para identificar qual elemento foi clicado
	pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = formatoReal(item.price[2])
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.pizzaBig img').src = item.img
    seleciona('.pizzaInfo h1').innerHTML = item.name
    seleciona('.pizzaInfo--desc').innerHTML = item.description
    seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

// aula 05
const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .pizza-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.pizza-item').getAttribute('data-key')
    console.log('Pizza clicada ' + key)
    console.log(pizzaJson[key])

    // garantir que a quantidade inicial de pizzas é 1
    quantPizzas = 1

    // Para manter a informação de qual pizza foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.pizzaInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            //marca o item clicado
            //tira a selecao de tamanho atual e seleciona o tamanho grande
            seleciona('.pizzaInfo--size.selected').classList.remove('selected')
            //adiciona o selected ao elemento clicado
            size.classList.add('selected')

                                                                        //a pizza id. o preco da pizza id
            seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(pizzaJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
        quantPizzas++
        seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
    })

    seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
        if(quantPizzas > 1) {
            quantPizzas--
            seleciona('.pizzaInfo--qt').innerHTML = quantPizzas	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    	console.log("Pizza " + modalKey)
        
    	//getAttribute é usado para obter o valor de um atributo específico de um elemento HTML
	    let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	
    	console.log("Quant. " + quantPizzas)

         //O método replace é usado para substituir parte de uma string por outra. Ele recebe dois argumentos: 
        //o primeiro é o padrão de busca (que pode ser uma expressão regular ou uma string simples) e o segundo 
        //é a string que será usada para a substituição.
        let price = seleciona('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        //  identificador que junte id e tamanho
	    let identificador = pizzaJson[modalKey].id+'t'+size

        //key é definida para verificar se a pizza selecionada já existe 
        //O método findIndex é usado para procurar no array cart por um item cujo identificador seja igual ao identificador da pizza selecionada.
        //Se a pizza já estiver no carrinho, o método findIndex retornará o índice da primeira ocorrência da pizza no carrinho. Caso contrário, retornará -1.
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)


        //se a pizza ja existe nio carrinho
        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantPizzas
        } else {
            // adicionar objeto pizza no carrinho
            let pizza = {
                identificador,
                id: pizzaJson[modalKey].id,
                size, // size: size
                qt: quantPizzas,
                price: parseFloat(price) // price: price
            }
            //add pizza ao final do cart
            cart.push(pizza)
            console.log(pizza)
            console.log('Sub total R$ ' + (pizza.qt * pizza.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    //so abre o carrinho se tiver itens
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// o find para pegar o item por id
			let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id )
			console.log(pizzaItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let pizzaSizeName = cart[i].size

			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = pizzaItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} 
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}


const formasDePagamento = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        seleciona('aside.payment').classList.add('show')
        seleciona('aside').classList.remove('show')
        seleciona('header').style.display = 'flex'
        
        
    })
}



const finalizarCompra = () => {
    seleciona('.cart--finalizarCompra').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside.payment').classList.remove('show')
        seleciona('aside.payment').style.left = '100vw'
        seleciona('header').style.display = 'flex'
       
        seleciona('.window').style.display = 'flex';
    })
}

const fecharJanela = () => {
    const cancelMobileButton = document.querySelector('.cancelMobileButton');
    const windowElement = document.querySelector('.window');
  
    cancelMobileButton.addEventListener('click', () => {
      windowElement.style.display = 'none';
    });
  };
  
  fecharJanela();
  

  




// MAPEAR pizzaJson para gerar lista de pizzas
pizzaJson.map((item, index ) => {
    //console.log(item) lista todos do json
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true)//clonemode copia os elementos html, true copia todos os elementos HTML dentro do elemento .pizza-item
    //console.log(pizzaItem) apresenta a clonagem do codigo html
    seleciona('.pizza-area').append(pizzaItem)//adiciona a pizza ao pizza area

    // preencher os dados de cada pizza
    preencheDadosDasPizzas(pizzaItem, item, index)
    
    // pizza clicada
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na pizza')

        let chave = pegarKey(e)

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.pizzaInfo--qt').innerHTML = quantPizzas

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)

    })

    botoesFechar()

}) 


mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
formasDePagamento()
finalizarCompra()
pagamento()
forma()
fecharJanela()



