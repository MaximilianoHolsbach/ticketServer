const fs = require("fs");

const { promisify } = require("util"); // Convierte funciones basadas en callbacks en funciones que devuelven promesas

// Utilizamos estos modulos promisify(fs.readFile), promisify(fs.writeFile); para cambiar de funciones asincronas a funciones que devuelven promesas

const writeFileAsync = promisify(fs.writeFile);

class UserManager {
  constructor(ruta) {
    this.users = [];
    this.ruta = ruta;
    this.init(); // Metodo para inicializar la clase dependiendo de la existencia del archivo
  }
  init() {
    const file = fs.existsSync(this.ruta); // Con el modulo comprobamos la existencia del archivo
    if (file) {
      this.users = JSON.parse(fs.readFileSync(this.ruta, "utf-8")); // Asigno el contenido del archivo al array de objetos
    } else {
      fs.writeFileSync(this.ruta, JSON.stringify(this.users, null, 2)); // Creo un archivo con un array vacio
    }
  }
  async create(data) {
    try {
      if (!(data.name || data.photo || data.email)) {
        // Comprobamos la carga de los campos obligatorios
        throw new Error("Todos los campos deben ser cargados");
      }
      const user = {
        // Creamos el Usuario
        id:
          this.users.length === 0
            ? 1
            : this.users[this.users.length - 1].id + 1,
        name: data.name,
        photo: data.photo,
        email: data.email,
      };
      this.users.push(user); // Pusheamos al usario en el array
      const usersFile = JSON.stringify(this.users, null, 2); // Pasamos a texto plano el array actualizado
      await writeFileAsync(this.ruta, usersFile, "utf-8"); // Actualizamos el contenido del archivo
    } catch (error) {
      return error.message;
    }
  }

  read() {
    try {
      if (this.users.length === 0) {
        throw new Error("No existen usuarios cargados");
      } else {
        return this.users;
      }
    } catch (error) {
      return error.message;
    }
  }

  readOne(id) {
    const userById = this.users.find((user) => user.id === Number(id)); // Utilizamos el metodo .find para iterar el array y comparar el valor de la clave id con la ingresada
    try {
      if (!userById) {
        throw new Error("El id ingresado no corresponde a ningún usuario");
      } else {
        return userById;
      }
    } catch (error) {
      return error.message;
    }
  }
}

const user = new UserManager("data/userManager.json");
/*
user.create({
  name: "Andres",
  photo:
    "https://png.pngtree.com/png-vector/20190321/ourlarge/pngtree-vector-users-icon-png-image_856952.jpg",
  email: "andres@gamil.com",
});
user.create({
  name: "Lucia",
  photo:
    "https://png.pngtree.com/png-vector/20190321/ourlarge/pngtree-vector-users-icon-png-image_856952.jpg",
  email: "Lucia@gamil.com",
});
user.create({
  name: "Marcos",
  photo:
    "https://png.pngtree.com/png-vector/20190321/ourlarge/pngtree-vector-users-icon-png-image_856952.jpg",
  email: "Marcos@gamil.com",
});
user.create({
  name: "Cinthia",
  photo:
    "https://png.pngtree.com/png-vector/20190321/ourlarge/pngtree-vector-users-icon-png-image_856952.jpg",
  email: "Cinthia@gamil.com",
});
*/
console.log(user.read());

console.log(user.readOne(2));
