// Constantes para elementos do DOM
const productsContainer = document.getElementById('products-container');
const paginationContainer = document.getElementById('pagination-container');

// Variáveis para controle da paginação
const productsPerPage = 9; // Quantidade de produtos por página
let currentPage = 1;      // Página atual, começa na primeira

let allProducts = []; // Array para armazenar todos os produtos do JSON

// --- Função para buscar os produtos do JSON ---
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/products'); // Buscar do json-server
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const products = await response.json();
        allProducts = products; // O json-server retorna diretamente o array de produtos
        displayProducts(currentPage); // Exibe a primeira página
        setupPagination();            // Configura os botões de paginação
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        productsContainer.innerHTML = '<p>Erro ao carregar os produtos. Tente novamente mais tarde.</p>';
    }
}

// --- Função para exibir os produtos na página atual ---
function displayProducts(page) {
    currentPage = page; // Atualiza a página atual

    // Rola para o topo da página
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Calcula os índices de início e fim dos produtos para a página atual
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    // Pega os produtos que devem ser exibidos nesta página
    const productsToShow = allProducts.slice(startIndex, endIndex);

    // Limpa o contêiner de produtos antes de adicionar os novos
    productsContainer.innerHTML = '';

    // Cria e adiciona cada card de produto
    productsToShow.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
        <div class="card-top">
            <div class="rating-display">
                <span class="rating-number">${product.rating.toFixed(1).replace(',', '.')}</span> 
                <img src="../assets/star.png" alt="Estrela de Avaliação" class="rating-star"> 
            </div>
            <div class="card-actions">
                <button onclick="deleteProduct(${product.id})" class="action-button delete-button">
                    <img src="../assets/excluir.png" alt="Excluir Produto">
                </button>
                <a href="../editar/editar.html?id=${product.id}" class="action-button edit-button">
                    <img src="../assets/editar.png" alt="Editar Produto">
                </a>
            </div>
        </div>

        <div class="card-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
        </div>
        
        <div class="card-details">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-full-description">amet, ipsum sit leo. quam amet, sapien est. fringilla at gravida ex sapien Quisque elementum vitae varius in quam placerat </p>
            <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
            </div>
    `;
    productsContainer.appendChild(productCard);
});
}

// --- Função para configurar os botões de paginação ---
function setupPagination() {
    // Calcula o número total de páginas necessário
    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    // Limpa o contêiner de paginação
    paginationContainer.innerHTML = '';

    // Cria o botão "Anterior" (seta para esquerda)
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&#8592;'; // Seta para esquerda ←
    prevButton.classList.add('pagination-arrow');
    prevButton.disabled = currentPage === 1; // Desabilita se estiver na primeira página
    prevButton.addEventListener('click', () => {
        displayProducts(currentPage - 1);
        updatePaginationButtons(totalPages); // Atualiza o estado dos botões
    });
    paginationContainer.appendChild(prevButton);

    // Cria os círculos para cada número de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('pagination-circle');
        pageButton.classList.toggle('active', i === currentPage); // Adiciona classe 'active' se for a página atual
        pageButton.addEventListener('click', () => {
            displayProducts(i);
            updatePaginationButtons(totalPages); // Atualiza o estado dos botões
        });
        paginationContainer.appendChild(pageButton);
    }

    // Cria o botão "Próximo" (seta para direita)
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&#8594;'; // Seta para direita →
    nextButton.classList.add('pagination-arrow');
    nextButton.disabled = currentPage === totalPages; // Desabilita se estiver na última página
    nextButton.addEventListener('click', () => {
        displayProducts(currentPage + 1);
        updatePaginationButtons(totalPages); // Atualiza o estado dos botões
    });
    paginationContainer.appendChild(nextButton);
}

// --- Função para atualizar o estado dos botões de paginação (habilitar/desabilitar e classe 'active') ---
function updatePaginationButtons(totalPages) {
    const buttons = paginationContainer.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.classList.contains('pagination-arrow')) {
            // Atualiza setas
            if (button.innerHTML === '←') {
                button.disabled = currentPage === 1;
            } else if (button.innerHTML === '→') {
                button.disabled = currentPage === totalPages;
            }
        } else if (button.classList.contains('pagination-circle')) {
            // Atualiza círculos das páginas
            button.classList.toggle('active', parseInt(button.textContent) === currentPage);
        }
    });
}

// --- Função para excluir um produto ---
async function deleteProduct(productId) {
    // Confirmar se o usuário realmente quer excluir
    const confirmation = confirm('Tem certeza que deseja excluir este produto?');
    
    if (!confirmation) {
        return; // Se cancelar, não faz nada
    }

    try {
        // Fazer a requisição DELETE para o json-server
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        // Mostrar mensagem de sucesso
        alert('Produto excluído com sucesso!');
        
        // Recarregar os produtos para atualizar a página
        await fetchProducts();
        
    } catch (error) {
        console.error('Erro ao excluir o produto:', error);
        alert('Erro ao excluir o produto. Verifique se o servidor está rodando.');
    }
}

// --- Evento que inicia tudo quando a página carrega ---
document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
    
    // Adicionar event listener para o botão de adicionar
    const addButton = document.getElementById('btn-add');
    if (addButton) {
        addButton.addEventListener('click', function() {
            window.location.href = '../adicionar/adicionar.html';
        });
    }
});