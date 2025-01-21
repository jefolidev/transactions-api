import { env } from './env'
import { app } from './app'

/* 
  * Unitário => unidade da aplicação 
  *   Ex.: Uma função de formatação de datas, em que eu passo o parametro da dada e testo ela isoladamente.
  
  * Integração => comunicação entre duas ou mais unidades 
  *   Ex.: Quando testamos uma função que chama outra função, que possa chamar outra função.
  
  * E2E => ponta a ponta 
  *   Ex.: Quando testamos a aplicação simulando um usuário, utilizando todos os recursos que à eles são atribuídos.
*/

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('🔥 HTTP Server Running!'))
