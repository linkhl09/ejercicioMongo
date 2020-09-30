const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  const html = data
    .map((item) => `<p> <b>${item.author}:</b>${item.message}</p>`)
    .join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const author = document.getElementById("author");
  const message = document.getElementById("message");
  const ts = Date.now();
  const obj = {
    message: message.value,
    author: author.value,
    ts: ts,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  };
  fetch("http://localhost:3000/chat/api/messages", options)
    .then((res) => {
      if(res.ok)
      {ws.send("Msj");
      message.value = "";
      document.getElementById("error").innerHTML = "";
      } else{
        let err = "Rellene todos los campos";
        if(obj.author !== '' && obj.message !== '')
        {
          err ='';
          if(obj.author.split(' ').length < 2) 
            err += "Debe poner por lo menos un nombre y apellido.<br>";
          if(obj.message.length <5)
            err += "El mensaje debe tener más de 5 caracteres";
        }
        document.getElementById("error").innerHTML =
        '<p style="color:red;">' + err + "</p>";
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
