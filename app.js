const app = Vue.createApp({

    data() {
        return {
            produtos: [],
            produto: false,
            carrinho: [],
            mensagemAlerta: "item adicionado ao carrinho",
            alertaAtivo: false,
            carrinhoAtivo: false,
            checkout: {
                nome: "",
                email: "",
                endereco: ""
            },
            finalizarCompraAtivo: false
        }
    },

    filters: {
        numeroPreco(valor){
            return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
        }
    },

    computed: {
        carrinhoTotal() {
            let total = 0;
            if (this.carrinho.length > 0){
                this.carrinho.forEach(item => {
                    total += item.preco;
                });
            }
            return total;
        }       
    },

    methods: {
        fetchProdutos() {
            fetch('api/produtos.json')
                .then(r => r.json())
                .then(r => {
                    this.produtos = r;
                });
        },

        fetchProduto(id){
            fetch(`api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r =>{
                    this.produto = r;
                })
        },

        abrirModal(id){
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });  
        },

        fechar_produto({target, currentTarget}){
            if (target === currentTarget){
                this.produto = false;
            }
        },

        clickForaCarrinho({target, currentTarget}){
            if (target === currentTarget){
                this.carrinhoAtivo = false;
            }
        },

        adicionarItem(){
            this.produto.estoque--;
            const {id, nome, preco} = this.produto;
            this.carrinho.push({ id, nome, preco});
            this.alerta(`${nome} adicionado ao carrinho`);
        },

        removerItem(index){
            this.carrinho.splice(index, 1)
        },

        checarLocalStorage(){
            if(window.localStorage.carrinho){
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },

        compararEstoque(){
            const items = this.carrinho.filter(({id}) => id === this.produto.id);
            this.produto.estoque -= items.length;
        },


        alerta(mensagem){
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 3000);
        },

        router(){
            const hash = document.location.hash;
            if (hash){
                this.fetchProduto(hash.replace("#", ""));
            }
        },

        fecharModal({target, currentTarget}){ // renamed from fechar_produto
            if (target === currentTarget){
                this.produto = false;
            }
        },

        abrirFinalizarCompra() {
            this.carrinhoAtivo = false;       // Close the cart immediately
            // Remove the delay to make the response immediate
            this.finalizarCompraAtivo = true; // Open checkout immediately
        },
        
        clickForaFinalizarCompra({target, currentTarget}) {
            console.log("Clicked outside checkout modal");
            if (target === currentTarget) {
                this.finalizarCompraAtivo = false;
                console.log("Closed modal, finalizarCompraAtivo:", this.finalizarCompraAtivo);
            }
        },
        
        confirmarCompra() {
            if (this.checkout.nome && this.checkout.email && this.checkout.endereco) {
                this.alerta("Compra finalizada com sucesso!");
                this.carrinho = [];
                this.finalizarCompraAtivo = false;
                this.checkout.nome = "";
                this.checkout.email = "";
                this.checkout.endereco = "";
            } else {
                this.alerta("Por favor, preencha todos os campos.");
            }
        }
    },  

    watch: {
        produto(){
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || ""; 
            history.pushState(null, null, `#${hash}`);
            if(this.produto){
                this.compararEstoque();
            }
        },
        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },   

    created() {
        this.fetchProdutos();
        this.router();
        this.checarLocalStorage();
        this.finalizarCompraAtivo = false;
    }
}).mount('#app');
