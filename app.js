const app = new Vue({
    el: '#app',
    data: {
        produtos: [],
        produto: false,
    },

    filters: {
        numeroPreco(valor){
            return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
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

        fechar_produto({target, currentTarget}){
            if (target === currentTarget){
                this.produto = false;
            }
        },

        abrirModal(id){
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
        }
    },  



    created() {
        this.fetchProdutos();
    },

});