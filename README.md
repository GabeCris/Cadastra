# Teste Técnico Gabriel Crisanto

## Rodando o repositório

Considerando que o repositório já possui um setup inicial preparado para conseguir rodá-lo com o auxílio do gulp, é necessário fazer utilização do node em versões igual ou superior a 14.

Para instalar as dependências do projeto, pode se executar o comando `yarn`

Logo em seguida podemos startar nosso server para desenvolvimento com o comando `yarn start`

Ele irá abrir dois servidores necessários para funcionamento do projeto:

- o primeiro abrirá uma porta padrão para desenvolvimento local com a url http://localhost:3000
- o segundo é um json server que utilizamos dentro do nosso ambiente front end para emularmos uma banco de dados que pode ser acessado através de requisição no localhost de porta 5000

## Metodologia 

Embora não fique muito claro no código o uso de uma metodologia específica, temos algumas possibilidades listadas a seguir, que cooperaram para o desenvolvimento da página de categoria utilizando somente o TS, sem o auxílio de um framework como React, que facilitaria muito nossa escalabilidade e também escrita de código, por estarmos falando de uma ferramenta extremamente poderosa.
Porém, isso não nos impediu de tentar utilizar algumas metodologias em alguns trechos de código, como:
- **Programação Orientada a Objetos**: Com a utilização  de várias classes, como Product, usando objetos para representar entidades e funcionalidades relacionadas ao carrinho de compras, prateleira de produtos, filtros e utilitários DOM.
- **Single Responsibility Principle**: Cada função ou método considera ter uma responsabilidade única e específica, como criar elementos HTML, formatar moeda brasileira, gerenciar o carrinho de compras, construir a prateleira de produtos, aplicar filtros, entre outros.
- **Factory**: O método createHTMLElement do objeto DOMUtils pode ser considerado um padrão de fábrica, pois é responsável por criar e configurar elementos HTML com base em parâmetros fornecidos.
- **Observer**: A lógica de atualização do carrinho de compras e da prateleira de produtos em resposta a eventos (como adição ou remoção de itens do carrinho) pode ser comparada ao padrão Observer, onde as mudanças em um objeto (o carrinho de compras) são refletidas em outros objetos (a prateleira de produtos).

## Considerações finais

  Algumas decisões tomadas em código sobre a utilização de alguma metologia ou técnica de desenvolvimento para esse projeto, tem muita relação com minha rotina profissional como desenvolvedor Front End com VTEX CMS, em que muitas das coisas que pude utilizar nesse código são frutos de aprendizados que tive tomando a frente de alguns grandes clientes do mercado de Ecommerce, como por exemplo a marca de máquinas de bebidas da Brastemp, a B.Blend, sendo ela um case que agrega muito ao meu conhecimento rotineiro, além das atribuições que são minhas responsabilidades mais comuns como Front End, já tive oportunidades de estar somando desde modificações feitas em NODE, além de possuir um certo domínio prático do checkout da loja, assim como outras vertentes da VTEX como Master Data, Admin e até mesmo o Firebase.

- [Link da Loja B.Blend;](https://loja.bblend.com.br/)

Para entrar em contato comigo:

<div>
  <a href="https://www.linkedin.com/in/gabriel-crisanto" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
  <a href="https://api.whatsapp.com/send/?phone=%2B5541984818428&text&app_absent=0" target="_blank"><img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" target="_blank"></a>
  <a href = "mailto:gabrecrisanto@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
  <a href="https://www.instagram.com/gabecris_/" target="_blank"><img src="https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white" target="_blank"></a>
</div>
<br>


