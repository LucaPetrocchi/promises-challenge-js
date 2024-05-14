// Función para obtener los jugadores del localStorage
const obtenerJugadoresLocalStorage = () => {
  const jugadoresString = localStorage.getItem('jugadores');
  return jugadoresString ? JSON.parse(jugadoresString) : [];
};

// Función para guardar los jugadores en el localStorage
const guardarJugadoresLocalStorage = (jugadores) => {
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
};

const getJugadorIndex = (jugadorNombre, jugadores) => {
  const index = jugadores.findIndex(jugador => jugador.nombre === jugadorNombre)
  if (index === -1) {
    throw new Error('Jugador no existe')
  }

  return index
}

// Función asíncrona para agregar un nuevo jugador al equipo usando un prompt de HTML
const agregarJugador = async () => {
  try {
    // Solicitar al usuario que ingrese los datos del jugador
    const nombre = prompt("Ingrese el nombre del jugador:");
    const edad = parseInt(prompt("Ingrese la edad del jugador:"));
    const posicion = prompt("Ingrese la posición del jugador:");
    const titular = prompt("Es titular o suplente?")

    if (isNaN(edad)) {
      throw new Error('La edad no es un número')
    }

    // Obtener los jugadores del localStorage
    let jugadores = obtenerJugadoresLocalStorage();

    // Verificar si el jugador ya existe en el equipo
    const jugadorExistente = jugadores.find(jugador => jugador.nombre === nombre);
    if (jugadorExistente) {
      throw new Error('El jugador ya está en el equipo.');
    }

    // Agregar el nuevo jugador al array de jugadores
    jugadores.push({ nombre, edad, posicion, titular });

    // Guardar los jugadores actualizados en el localStorage
    guardarJugadoresLocalStorage(jugadores);

    // Simular una demora de 1 segundo para la operación asíncrona
    await new Promise(resolve => setTimeout(resolve, 1000));

    main('listarJugadores')

    // Mostrar un mensaje de éxito
    alert('Jugador agregado correctamente.');
  } catch (error) {
    console.error('Error:', error.message);
  }
};


// Función asíncrona para listar todos los jugadores del equipo
const listarJugadores = async () => {
  try {
    const jugadores = await obtenerJugadoresLocalStorage()
    const seccionLista = document.getElementById('listaJugadores')

    seccionLista.innerHTML = ''

    jugadores.forEach((jugador) => {
      let div = document.createElement('div')
      let nombre = document.createElement('h1')
      let posicion = document.createElement('p')
      let titular = document.createElement('p')
      let anios = document.createElement('p')
      let botonPosicion = document.createElement('button')
      let botonCambio = document.createElement('button')

      seccionLista.appendChild(div)
      div.appendChild(nombre)
      div.appendChild(posicion)
      div.appendChild(titular)
      div.appendChild(anios)
      div.appendChild(botonPosicion)
      div.appendChild(botonCambio)

      nombre.innerHTML = `${jugador.nombre}`
      posicion.innerHTML = `${jugador.posicion}`
      titular.innerHTML = `${jugador.titular}`
      anios.innerHTML = `${jugador.edad}`

      botonPosicion.innerHTML = "Asignar posición"
      botonPosicion.onclick = async () => {
        let jug = nombre.innerHTML
        let pos = prompt('Ingrese posición nueva')

        if (pos)
          await asignarPosicion(jug, pos, jugadores)
      }

      let reemPrompt = ""
      switch (jugador.titular) {
        case 'titular':
          botonCambio.innerHTML = 'Suplantar'
          reemPrompt = "entrante"
          break;
        case 'suplente':
          botonCambio.innerHTML = 'Ingresar'
          reemPrompt = "a reemplazar"
          break;
        case 'reemplazado':
          botonCambio.remove()
          break;
      }
      botonCambio.onclick = async () => {
        let reemp = prompt(`Ingrese nombre del jugador ${reemPrompt}`)

        if (reemp)
          (jugador.titular === "titular")
            ? await realizarCambio(reemp, jugador.nombre, jugadores)
            : await realizarCambio(jugador.nombre, reemp, jugadores)

      }

    })
  } catch (error) {
    console.error('Error:', error.message)
  }
};

// Función asíncrona para asignar una nueva posición a un jugador
const asignarPosicion = async (nombreJugador, nuevaPosicion, jugadores) => {
  try {
    const index = getJugadorIndex(nombreJugador, jugadores)

    jugadores[index].posicion = nuevaPosicion

    guardarJugadoresLocalStorage(jugadores)

    await new Promise(resolve => setTimeout(resolve, 1000))

    main('listarJugadores')

    alert('Posicion cambiada')
  } catch (error) {
    console.error('Error', error.message)
  }
};

// Función asíncrona para realizar un cambio durante un partido
const realizarCambio = async (nombreEntrante, nombreSaliente, jugadores) => {
  try {
    const entranteIndex = getJugadorIndex(nombreEntrante, jugadores)
    const salienteIndex = getJugadorIndex(nombreSaliente, jugadores)

    let entranteTitular = jugadores[entranteIndex].titular
    let salienteTitular = jugadores[salienteIndex].titular
    let test = (entranteTitular === 'suplente' && salienteTitular === 'titular')
    if (!test) {
      throw new Error(`El entrante es ${entranteTitular} y el suplente es ${salienteTitular}`)
    }

    jugadores[entranteIndex].titular = 'titular'
    jugadores[salienteIndex].titular = 'reemplazado'

    guardarJugadoresLocalStorage(jugadores)

    await new Promise(resolve => setTimeout(resolve, 1000))

    main('listarJugadores')

    alert('Jugadores cambiados')
  } catch (error) {
    console.error('Error', error.message)
  }

};

// Función principal asíncrona que interactúa con el usuario
const main = async (param) => {
  try {
    if (param === undefined ||  param === "listarJugadores") {
      listarJugadores()
    }
    if (param === "agregarJugador") {
      agregarJugador()
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Llamar a la función principal para iniciar la aplicación
main();
