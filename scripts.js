// Inicializar o carrinho com dados do LocalStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Função para adicionar itens ao carrinho
function addToCart(productName, price, imageUrl) {
    // Verifica se o produto já está no carrinho
    let product = cart.find(item => item.name === productName);

    if (product) {
        // Se o produto já existe, apenas aumentamos a quantidade
        product.quantity++;
    } else {
        // Se o produto não existe, adiciona ao carrinho com quantidade 1 e imagem
        cart.push({ name: productName, price: price, quantity: 1, imageUrl: imageUrl });
    }

    // Atualiza o LocalStorage com os itens do carrinho
    localStorage.setItem('cart', JSON.stringify(cart));

    // Atualiza o número de itens no carrinho
    updateCartCount();

    // Exibe os itens no carrinho
    displayCartItems();
}

// Função para atualizar o contador de itens no carrinho
function updateCartCount() {
    // Contabiliza o número total de itens (considerando a quantidade de cada produto)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cartCount").textContent = totalItems;
}

// Função para exibir os itens do carrinho
function displayCartItems() {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = ''; // Limpa os itens atuais

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity; // Total por linha (preço * quantidade)
        total += itemTotal; // Atualiza o total do carrinho

        // Agora a ordem é: foto, nome, quantidade, preço, e o total por linha
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                <p>${item.name} - 
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-name="${item.name}"> x 
                €${item.price} = €${itemTotal.toFixed(2)}</p>
                <button class="remove-item" data-name="${item.name}">Remover</button>
            </div>
        `;
    });

    // Atualiza o total do carrinho
    document.getElementById("cartTotal").textContent = total.toFixed(2);

    // Adiciona os eventos de edição de quantidade e remoção de item
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (event) => updateQuantity(event.target));
    });

    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => removeItem(event.target));
    });
}

// Função para atualizar a quantidade de um item no carrinho
function updateQuantity(input) {
    const productName = input.getAttribute('data-name');
    const newQuantity = parseInt(input.value);

    if (newQuantity <= 0) {
        input.value = 1; // Garantir que a quantidade não seja menor que 1
        return;
    }

    // Encontra o item no carrinho e atualiza a quantidade
    let product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity = newQuantity;
    }

    // Atualiza o LocalStorage com os itens do carrinho
    localStorage.setItem('cart', JSON.stringify(cart));

    // Atualiza a contagem do carrinho e exibe os itens novamente
    updateCartCount();
    displayCartItems();
}

// Função para remover um item do carrinho
function removeItem(button) {
    const productName = button.getAttribute('data-name');

    // Remove o item do carrinho
    cart = cart.filter(item => item.name !== productName);

    // Atualiza o LocalStorage com os itens do carrinho
    localStorage.setItem('cart', JSON.stringify(cart));

    // Atualiza a contagem do carrinho e exibe os itens novamente
    updateCartCount();
    displayCartItems();
}

// Função para abrir o carrinho
function openCart() {
    document.getElementById("cartModal").style.display = "block";
}

// Função para fechar o carrinho
function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

// Configurar o clique no ícone do carrinho para abrir o modal
document.getElementById("cartIcon").addEventListener("click", openCart);

// Função para finalizar a compra (por enquanto, só um alerta)
document.getElementById("checkoutButton")?.addEventListener("click", function() {
    alert("Finalizando compra...");
    cart = []; // Limpa o carrinho
    localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza o LocalStorage
    updateCartCount(); // Atualiza o contador do carrinho
    displayCartItems(); // Atualiza os itens do carrinho
});

// Atualiza a contagem do carrinho ao carregar a página
updateCartCount();
displayCartItems();
