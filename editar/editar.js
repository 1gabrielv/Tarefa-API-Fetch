// Função para obter o parâmetro de query da URL (ex: id=123)
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Retorna o valor do parâmetro 'id'
}

// Função para preencher o formulário com os dados do produto
async function fillFormWithProductData() {
    const productId = getProductIdFromUrl();

    // Se não houver ID na URL, não fazemos nada (ou mostramos um erro)
    if (!productId) {
        console.error('ID do produto não encontrado na URL.');
        return;
    }

    try {
        // Fazer a requisição Fetch para o json-server
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        
        // Verificar se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        // Converter a resposta para JSON
        const product = await response.json();

        if (product) {
            // Preencher os campos do formulário
            document.getElementById('nome').value = product.name || '';
            document.getElementById('image').value = product.image || '';
            document.getElementById('descricao').value = product.description || '';
            // Converter o preço para string com vírgula para exibição
            document.getElementById('preco').value = product.price ? product.price.toString().replace('.', ',') : '';
            document.getElementById('categorias').value = product.category || '';
            document.getElementById('avaliacao').value = product.rating || '';
        } else {
            console.warn(`Produto com ID ${productId} não encontrado.`);
        }

    } catch (error) {
        console.error('Erro ao carregar os dados do produto:', error);
        alert('Erro ao carregar os dados do produto. Verifique se o servidor está rodando.');
    }
}

// Função para salvar as alterações do produto
async function saveProductChanges(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    const productId = getProductIdFromUrl();
    
    if (!productId) {
        alert('ID do produto não encontrado na URL.');
        return;
    }

    // Coletar os dados do formulário
    const priceString = document.getElementById('preco').value;
    const ratingValue = parseFloat(document.getElementById('avaliacao').value);
    
    // Converter preço de string para número (aceita vírgula como separador decimal)
    const price = parseFloat(priceString.replace(',', '.'));
    
    // Validar se a nota está entre 0 e 5
    if (ratingValue < 0 || ratingValue > 5) {
        alert('A avaliação deve estar entre 0 e 5.');
        return;
    }
    
    const updatedProduct = {
        id: parseInt(productId),
        name: document.getElementById('nome').value,
        image: document.getElementById('image').value,
        description: document.getElementById('descricao').value,
        price: price,
        category: document.getElementById('categorias').value,
        rating: ratingValue
    };

    try {
        // Fazer a requisição PUT para atualizar o produto
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Produto atualizado com sucesso:', result);
        
        // Mostrar mensagem de sucesso
        alert('Produto editado com sucesso!');
        
        // Redirecionar de volta para a página principal
        window.location.href = '../pagina/pagina.html';
        
    } catch (error) {
        console.error('Erro ao salvar as alterações:', error);
        alert('Erro ao salvar as alterações. Verifique se o servidor está rodando.');
    }
}

// Chamar a função para preencher o formulário quando a página carregar
document.addEventListener('DOMContentLoaded', fillFormWithProductData);

// Adicionar event listener para o formulário
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', saveProductChanges);
    }
});
