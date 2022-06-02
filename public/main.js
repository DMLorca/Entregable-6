const socket = io(); 

const agregarProducto = () => {
  const title = document.getElementById("title").value; 
  const price = document.getElementById("price").value; 
  const thumbnail = document.getElementById("thumbnail").value; 
  const producto = { title, price, thumbnail };                   
  socket.emit('nuevo_prod', producto);                
  document.getElementById("title").value="";
  document.getElementById("price").value="";
  document.getElementById("thumbnail").value="";
  return false;                                       
}

const enviarMensaje = () => {
  const author = document.getElementById("author").value;
  const text = document.getElementById("text").value; 
  const date = new Date();
  const objFecha = { 
      dia: date.getDate(),
      mes: date.getMonth()+1,
      anio: date.getFullYear(),
      hs: date.getHours(),
      min: date.getMinutes(),
      seg: date.getSeconds()
  }
  const mensaje = { author, text , objFecha};                   
  socket.emit('new_message', mensaje);                
  document.getElementById("author").value="";
  document.getElementById("text").value="";
  return false;                                       
}

const renderPlantilla = (producto, mensaje) => {
  
  const { title, price, thumbnail } = producto;
  const templateString = `
  {{#if producto}}
  <table class="table">
      <thead class="table-dark">
          <th>Nombre</th>
          <th>Precio</th>
          <th>Foto</th>
      </thead>
      <tbody>
          {{#each producto }}
          <tr class="table-primary">
              <td>{{./title }}</td>
              <td>{{./price }}</td>
              <td><img style="width: 50px; height:50px" src={{./thumbnail }} alt=""></td>
          </tr>
          {{/each }}
      </tbody>
  </table>
  {{else }}
  <p>No hay productos</p><br>
  {{/if }}
  <hr>
  <h2>Centro de mensajes</h2>
  `;
  const templateStringChat = `  
  <div>
    <br>
    {{#each mensaje }}
      <p style="color:blue">{{./author}}<p>
      <p style="color:red">[{{./objFecha.dia}}/{{./objFecha.mes}}/{{./objFecha.anio}} 
      {{./objFecha.hs}}:{{./objFecha.min}}:{{./objFecha.seg}}]: <p>
      <p style="color:green">{{./text}}</p>
    {{/each}}
  </div>
  `;

  const template = Handlebars.compile(templateString);
  const templateChat = Handlebars.compile(templateStringChat);

  const htmlChat = templateChat({ mensaje: mensaje});
  const html = template({producto: producto, title: title, price: price, thumbnail: thumbnail});

  document.getElementById('id_del_div').innerHTML = html;
  document.getElementById('id_del_div_chat').innerHTML = htmlChat;
}

socket.on('new_event', (productos, mensaje) => renderPlantilla(productos, mensaje));