const preguntas = [
    {
      enunciado: `Dado el código: 
          <pre>
          int a, p=0;
          cin>>a ;
          while (CONDICION){
              cout<<"Hola"<<endl;
          }
          cout<< p;
          </pre>
          Cuál es la condición correspondiente para que el
          siguiente requerimiento:
          Mostrar todos los números de una secuencia que
          finaliza con -1, pero si la misma tiene más de 100
          elementos solo mostrar los primeros 100, y al final la
          cantidad de números mostrados.`,
      opciones: [
        "A) (a != -1)|| (p<= 100)",
        "B) (a!= -1) && (p<=100)",
        "C) (a== -1)|| (p>100)",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "B"
    },
    {
      enunciado: "2. Para trabajar con funciones en C++ se requiere:",
      opciones: [
        "A) Prototipo, definición y acción",
        "B) Prototipo, activación y llamada",
        "C) Prototipo, definición y llamada",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "C"
    },
    {
      enunciado: "3. ¿Cuál es la salida al ejecutar el siguiente código con doble for (i+=2 y j++)?",
      opciones: [
        "A) 0 2 3 4 4 5 6 7 8",
        "B) 2 3 4 4 5 6 7 8",
        "C) 0 2 3 5 6 7 8",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "D"
    },
    {
      enunciado: "4. Las únicas estructuras de control que requieren condición son:",
      opciones: [
        "A) while y for",
        "B) if y while",
        "C) while, for y switch",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "A"
    },
    {
      enunciado: "5. La clasificación de las variables según su ámbito se define como:",
      opciones: [
        "A) locales y generales",
        "B) estáticas y dinámicas",
        "C) globales y locales",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "C"
    },
    {
      enunciado: "6. ¿Cuál es un prototipo válido para la función Sep que separa 4560 en 45 y 60?",
      opciones: [
        "A) Void Sep (int, int, int)",
        "B) void Sep (int, int &, int &)",
        "C) int Sep (int, int, int)",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "B"
    },
    {
      enunciado: "7. La Programación Estructurada establece que hay 3 estructuras básicas de control. Estas son:",
      opciones: [
        "A) if - else - switch",
        "B) while - do while - for",
        "C) secuencia - selección - función",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "C"
    },
    {
      enunciado: "8. En C++, las líneas entre { } se llaman:",
      opciones: [
        "A) función",
        "B) bloque",
        "C) estructura de control",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "B"
    },
    {
      enunciado: "9. ¿Cuál es el valor de m al finalizar el siguiente código con if anidados?",
      opciones: [
        "A) 8",
        "B) 1",
        "C) 6",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "A"
    },
    {
      enunciado: "10. Una característica esencial de los algoritmos es:",
      opciones: [
        "A) Estructurado",
        "B) Finito",
        "C) Iterativo",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "B"
    },
    {
      enunciado: "11. ¿Cuál de las siguientes líneas NO declara correctamente una variable?",
      opciones: [
        "A) bool variable_1",
        "B) float variable-1",
        "C) char VaRiAbLe1",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "B"
    },
    {
      enunciado: "12. Toda variable debe:",
      opciones: [
        "A) Tener un identificador válido, un tipo",
        "B) Ser utilizada como argumento en al menos una función.",
        "C) Estar declarada en main para poder accederla en cualquier momento de la ejecución.",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "A"
    },
    {
      enunciado: "13. Las estructuras repetitivas while y for:",
      opciones: [
        "A) Se pueden anidar un máximo de 2 niveles",
        "B) Se pueden anidar un máximo de 8 niveles",
        "C) Se pueden anidar la cantidad de veces que sea necesario.",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "C"
    },
    {
      enunciado: "14. ¿Cuál de las siguientes afirmaciones es Falsa:",
      opciones: [
        "A) Una variable char puede ser asignada a una variable int",
        "B) Una variable int puede ser asignada a una variable long",
        "C) Una variable float puede ser asignada a una variable int",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "C"
    },
    {
      enunciado: "15. ¿Cuántas veces se imprime \"hola\" en el siguiente código con while y condición booleana falsa al inicio?",
      opciones: [
        "A) 7",
        "B) 8",
        "C) 2",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "D"
    },
    {
      enunciado: "16. Para obtener el i-ésimo elemento de una secuencia es necesario haber obtenido los (i-1)-ésimos anteriores; este acceso se denomina:",
      opciones: [
        "A) Directo",
        "B) Aleatorio",
        "C) Secuencial",
        "D) NINGUNA DE LAS ANTERIORES"
      ],
      correcta: "C"
    },
    // Las siguientes preguntas del PDF también pueden ser agregadas aquí siguiendo el mismo formato.
  ];
  