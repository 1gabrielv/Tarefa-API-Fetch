// Função para adicionar um novo produto
async function addProduct(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    console.log('Função addProduct chamada!');
    
    // Coletar os dados do formulário
    const priceString = document.getElementById('preco').value;
    const ratingValue = parseFloat(document.getElementById('avaliacao').value);
    
    console.log('Valores coletados:', {
        nome: document.getElementById('nome').value,
        preco: priceString,
        avaliacao: ratingValue
    });
    
    // Converter preço de string para número (aceita vírgula como separador decimal)
    const price = parseFloat(priceString.replace(',', '.'));
    
    // Validações
    if (!document.getElementById('nome').value.trim()) {
        alert('Nome da peça é obrigatório.');
        return;
    }
    
    if (!document.getElementById('image').value.trim()) {
        alert('URL da imagem é obrigatória.');
        return;
    }
    
    if (!document.getElementById('descricao').value.trim()) {
        alert('Descrição é obrigatória.');
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        alert('Preço deve ser um número maior que zero.');
        return;
    }
    
    if (!document.getElementById('categorias').value.trim()) {
        alert('Categoria é obrigatória.');
        return;
    }
    
    // Validar se a nota está entre 0 e 5
    if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
        alert('A avaliação deve ser um número entre 0 e 5.');
        return;
    }
    
    // Como o campo inStock foi removido, vou definir como true por padrão
    const newProduct = {
        name: document.getElementById('nome').value.trim(),
        image: document.getElementById('image').value.trim(),
        description: document.getElementById('descricao').value.trim(),
        price: price,
        category: document.getElementById('categorias').value.trim(),
        rating: ratingValue,
        inStock: true // Valor padrão já que o campo foi removido
    };

    console.log('Produto a ser enviado:', newProduct);

    try {
        // Fazer a requisição POST para adicionar o produto
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Produto adicionado com sucesso:', result);
        
        // Mostrar mensagem de sucesso
        alert('Produto adicionado com sucesso!');
        
        // Limpar o formulário
        document.querySelector('form').reset();
        
        // Redirecionar de volta para a página principal
        window.location.href = '../pagina/pagina.html';
        
    } catch (error) {
        console.error('Erro ao adicionar o produto:', error);
        alert('Erro ao adicionar o produto. Verifique se o servidor está rodando.');
    }
}

// Adicionar event listener para o formulário quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - configurando event listeners');
    
    const form = document.querySelector('form');
    const submitButton = document.getElementById('adicionar');
    
    console.log('Form encontrado:', !!form);
    console.log('Botão submit encontrado:', !!submitButton);
    
    if (form) {
        form.addEventListener('submit', function(e) {
            console.log('Submit via form detectado');
            addProduct(e);
        });
    }
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            console.log('Click no botão detectado');
            addProduct(e);
        });
    }
    
    if (!form && !submitButton) {
        console.error('Nem form nem botão foram encontrados!');
    }
});
