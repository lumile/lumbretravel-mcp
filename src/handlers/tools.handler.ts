import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js'
import { ApiService } from '../services/api.service.js'
import { formatDate } from '../utils/date.utils.js'
import { type Server } from '@modelcontextprotocol/sdk/server/index.js'

export class ToolsHandler {
  private readonly apiService: ApiService

  constructor () {
    this.apiService = new ApiService()
  }

  listTools () {
    return {
      tools: [
        {
          name: 'get_program',
          description: 'Obtiene un programa de viajes de LumbreTravel por ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'ID del programa'
              }
            },
            required: ['id']
          }
        },
        {
          name: 'get_programs_by_name',
          description: 'Busca programas de viajes de LumbreTravel por nombre',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Nombre del programa'
              }
            },
            required: ['name']
          }
        },
        {
          name: 'get_programs_by_date_range',
          description: 'Obtiene programas de viajes de LumbreTravel por rango de fechas',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Fecha de inicio del programa (DD-MM-YYYY)'
              },
              endDate: {
                type: 'string',
                description: 'Fecha de fin del programa (DD-MM-YYYY)'
              }
            }
          }
        },
        {
          name: 'daily_activities',
          description: "Obtiene las actividades diarias en LumbreTravel.  Retorna un objeto JSON con un array de actividaes en la propiedad 'activities' con las actividades del día buscado.  En la propiedad 'monthlyTotals' se encuentra el total de actividades de cada día del mes",
          inputSchema: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                description: 'Fecha en la que buscar las actividades (DD-MM-YYYY)'
              },
              hotelIdToFilter: {
                type: 'string',
                description: 'ID del hotel a filtrar las actividades, si no se especifica se obtienen todas las actividades'
              },
              leaderIdToFilter: {
                type: 'string',
                description: 'ID del guía a filtrar las actividades, si no se especifica se obtienen todas las actividades'
              },
              serviceIdToFilter: {
                type: 'string',
                description: 'ID del servicio a filtrar las actividades, si no se especifica se obtienen todas las actividades'
              },
              vehicleIdToFilter: {
                type: 'string',
                description: 'ID del vehículo a filtrar las actividades, si no se especifica se obtienen todas las actividades'
              }
            },
            required: ['date']
          }
        },
        {
          name: 'season_summary',
          description: "Obtiene un resumen de pasajeros a lo largo de una temporada.  Retorna un objeto JSON que contiene un array por cada año de la temporada.  En cada item del array la propiedad 'yearTotal' contiene el total de pasajeros del año.  En la propiedad 'agencies' se encuentra un resumen por mes de los pasajeros del año asociados a cada agencia.  Y en el array 'monthlyTotals' se encuentra el total de pasajeros de cada mes.  Esta tool es muy útil para obtener el total de pasajeros de una temporada y ver como se distribuye por agencias.  Siempre que se quiera obtener información estadistica de pasajeros se debe usar esta tool.  Al ser una solucion para agencias de viaje los analisis estadísticos pueden ser muy útiles para tomar decisiones de negocio.  Se pueden usar estos datos para armar graficos e indicadores.  Ademas es normal que las fechas de analisis sean en el futuro.",
          inputSchema: {
            type: 'object',
            properties: {
              startYear: { type: 'string', description: 'Año de inicio de la temporada (YYYY)' },
              endYear: { type: 'string', description: 'Año de fin de la temporada (YYYY)' }
            },
            required: ['startYear', 'endYear']
          }
        },
        {
          name: 'create_program',
          description: 'Crea un nuevo programa de viajes en LumbreTravel.  Antes de crear un nuevo programa se debe preguntar al si quiere que primero se busque el programa a ver si existe. Si no se especifica la fecha de inicio o fin del programa, no la asumas, pide al usuario que la especifique. Si no se especifica el ID de la agencia, pide al usuario que la especifique.',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Nombre del programa'
              },
              startDate: {
                type: 'string',
                description: 'Fecha de inicio del programa (DD-MM-YYYY), salvo que el usuario lo indique las fechas siempre deben ser en el futuro'
              },
              endDate: {
                type: 'string',
                description: 'Fecha de fin del programa (DD-MM-YYYY), salvo que el usuario lo indique las fechas siempre deben ser en el futuro.  Y la fecha de fin debe ser mayor que la fecha de inicio'
              },
              agencyId: {
                type: 'string',
                description: 'ID de la agencia a asociar con este programa'
              }
            },
            required: ['name', 'startDate', 'endDate', 'agencyId']
          }
        },
        {
          name: 'update_program',
          description: 'Actualiza un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'ID del programa'
              },
              name: {
                type: 'string',
                description: 'Nombre del programa'
              },
              startDate: {
                type: 'string',
                description: 'Fecha de inicio del programa (DD-MM-YYYY), salvo que el usuario lo indique las fechas siempre deben ser en el futuro'
              },
              endDate: {
                type: 'string',
                description: 'Fecha de fin del programa (DD-MM-YYYY), salvo que el usuario lo indique las fechas siempre deben ser en el futuro.  Y la fecha de fin debe ser mayor que la fecha de inicio'
              },
              agencyId: {
                type: 'string',
                description: 'ID de la agencia a asociar con este programa'
              }
            },
            required: ['id', 'name', 'startDate', 'endDate', 'agencyId']
          }
        },
        {
          name: 'delete_program',
          description: 'Elimina un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            },
            required: ['id']
          }
        },
        {
          name: 'reactivate_program',
          description: 'Reactiva un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            },
            required: ['id']
          }
        },
        {
          name: 'list_agencies',
          description: 'Obtiene todas las agencias disponibles para asociar a un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_services',
          description: 'Obtiene todos los servicios disponibles para asociar a una actividad en un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_hotels',
          description: 'Obtiene todos los hoteles disponibles para asociar a una actividad en un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_leaders',
          description: 'Obtiene todos los guías disponibles para asociar a una actividad en un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_vehicles',
          description: 'Obtiene todos los vehículos disponibles para asociar a una actividad en un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_includes',
          description: 'Obtiene todos los incluye o extras disponibles para asociar a una actividad en un programa de viajes en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_service_languages',
          description: 'Obtiene todos los idiomas en los que se pueden prestar los servicios para asociar a una actividad en un programa de viajes en LumbreTravel.  Estos idiomas solo se pueden usar para asociar a un servicio.  Estos idiomas solo pueden ser asociados a un servicio',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_providers',
          description: 'Obtiene todos los proveedores disponibles en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'get_passengers_by_fullname',
          description: 'Obtiene pasajeros por nombre completo en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {
              fullname: { type: 'string', description: 'Nombre completo del pasajero' }
            },
            required: ['fullname']
          }
        },
        {
          name: 'get_passengers_by_email',
          description: 'Obtiene pasajeros por email en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: {
              email: { type: 'string', description: 'Email del pasajero' }
            },
            required: ['email']
          }
        },
        // {
        //   name: "create_bulk_passengers",
        //   description: "Crea pasajeros en LumbreTravel desde datos estructurados, esta tool esta pensada para usarla cuando se extraen los datos de un archivo",
        //   inputSchema: {
        //     type: "object",
        //     properties: {
        //       programId: {
        //         type: "string",
        //         description: "ID del programa"
        //       },
        //       passengers: {
        //         type: "array",
        //         items: {
        //           type: "object",
        //           properties: {
        //             firstname: { type: "string" },
        //             lastname: { type: "string" },
        //             birthdate: { type: "string" },
        //             documenttype: { type: "string" },
        //             passport: { type: "string" },
        //             gender: { type: "string" },
        //             nationality: { type: "string" }
        //           }
        //         }
        //       }
        //     },
        //     required: ["passengers"]
        //   }
        // },
        {
          name: 'create_passengers',
          description: 'Crea pasajeros en LumbreTravel, usa esta tool cuando el asistente recibe los datos de los pasajeros como parte del pedido del usuario',
          inputSchema: {
            type: 'object',
            properties: {
              passengers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    birthdate: { type: 'string', description: "Fecha de nacimiento del pasajero (DD-MM-YYYY), si no se especifica usa el valor 'No conocemos'" },
                    documenttype: { type: 'string', description: 'Tipo de documento, opciones válidas son DNI, Pasaporte, Licencia de Conducir o ID.  Si no se especifica el valor por defecto es ID.' },
                    document: { type: 'string', description: "Numero de documento, si no se especifica usa el valor 'No conocemos'" },
                    gender: { type: 'string', description: 'Género del pasajero, puede ser male, female,non_binary, prefer_not_to_say, other.  Si no se especifica deducilo del nombre y apellido' },
                    nationality: {
                      type: 'string',
                      description: 'Nacionalidad del pasajero de acuerdo a ISO 3166-1.  Si no se especifica deducilo del nombre y apellido'
                    },
                    language: {
                      type: 'string',
                      description: "Idioma del pasajero de acuerdo a ISO 639-1.  Si no se especifica deducilo del nombre y apellido.  No intentes usar las tools 'list_service_languages' ni 'get_service_language_by_name' para obtener el idioma del pasajero.  El idioma del pasajero es simplemente un string en formato ISO 639-1."
                    },
                    email: { type: 'string', description: "Email del pasajero, si no se especifica usa el valor 'No conocemos'" },
                    phone: { type: 'string', description: "Telefono del pasajero, si no se especifica usa el valor 'No conocemos'" }
                  },
                  required: ['firstname', 'lastname', 'birthdate', 'documenttype', 'document', 'gender', 'nationality', 'language', 'email', 'phone']
                }
              }
            },
            required: ['passengers']
          }
        },
        {
          name: 'update_passengers',
          description: 'Edita pasajeros en LumbreTravel teniendo en cuenta que se conoce el ID del pasajero.  Si el id no se conoce entonces se puede usar la tool get_passengers_by_fullname o get_passengers_by_email para obtener el id del pasajero.  Retorna el pasajero editado.',
          inputSchema: {
            type: 'object',
            properties: {
              passengers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    passengerId: { type: 'string' },
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    birthdate: { type: 'string', description: "Fecha de nacimiento del pasajero (DD-MM-YYYY), si no se especifica usa el valor 'No conocemos'" },
                    documenttype: { type: 'string', description: 'Tipo de documento, opciones válidas son DNI, Pasaporte, Licencia de Conducir o ID' },
                    document: { type: 'string', description: "Numero de documento, si no se especifica usa el valor 'No conocemos'" },
                    gender: { type: 'string', description: 'Género del pasajero, puede ser male, female,non_binary, prefer_not_to_say, other.  Si no se especifica deducilo del nombre y apellido' },
                    nationality: {
                      type: 'string',
                      description: 'Nacionalidad del pasajero de acuerdo a ISO 3166-1.  Si no se especifica deducilo del nombre y apellido'
                    },
                    language: {
                      type: 'string',
                      description: "Idioma del pasajero de acuerdo a ISO 639-1.  Si no se especifica deducilo del nombre y apellido.  No intentes usar las tools 'list_service_languages' ni 'get_service_language_by_name' para obtener el idioma del pasajero.  El idioma del pasajero es simplemente un string en formato ISO 639-1."
                    },
                    email: { type: 'string', description: "Email del pasajero, si no se especifica usa el valor 'No conocemos'" },
                    phone: { type: 'string', description: "Telefono del pasajero, si no se especifica usa el valor 'No conocemos'" }
                  },
                  required: ['passengerId', 'firstname', 'lastname', 'birthdate', 'documenttype', 'document', 'gender', 'nationality', 'language', 'email', 'phone']
                }
              }
            },
            required: ['passengers']
          }
        },
        {
          name: 'delete_passengers',
          description: 'Elimina pasajeros en LumbreTravel teniendo en cuenta que se conoce el ID del pasajero.  Si el id no se conoce entonces se puede usar la tool get_passengers_by_fullname o get_passengers_by_email para obtener el id del pasajero.  Retorna el pasajero eliminado.',
          inputSchema: {
            type: 'object',
            properties: {
              passengers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'ID del pasajero a eliminar'
                    }
                  },
                  required: ['id']
                }
              }
            },
            required: ['passengers']
          }
        },
        {
          name: 'delete_passenger',
          description: 'Elimina un pasajero en LumbreTravel teniendo en cuenta que se conoce el ID del pasajero.  Si el id no se conoce entonces se puede usar la tool get_passengers_by_fullname o get_passengers_by_email para obtener el id del pasajero.  Retorna el pasajero eliminado.',
          inputSchema: {
            type: 'object',
            properties: {
              passengerId: { type: 'string' }
            },
            required: ['passengerId']
          }
        },
        {
          name: 'reactivate_passenger',
          description: 'Reactiva un pasajero en LumbreTravel teniendo en cuenta que se conoce el ID del pasajero.  Si el id no se conoce entonces se puede usar la tool get_passengers_by_fullname o get_passengers_by_email para obtener el id del pasajero.  Retorna el pasajero reactivado.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string' }
            },
            required: ['id']
          }
        },
        {
          name: 'add_passengers_to_program',
          description: 'Agrega pasajeros a un programa en LumbreTravel.  Es importante que los pasajeros ya existan en LumbreTravel, si no existen se puede usar la tool create_passengers para crearlos.  O si existen se puede usar la tool get_passengers_by_fullname o get_passengers_by_email para obtener el id de cada pasajero.',
          inputSchema: {
            type: 'object',
            properties: {
              programId: { type: 'string', description: 'ID del programa' },
              passengers: {
                type: 'array',
                description: 'Lista de pasajeros',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' }
                  },
                  required: ['id', 'name']
                }
              }
            },
            required: ['programId', 'passengers']
          }
        },
        {
          name: 'add_activities',
          description: 'Crea actividades asociadas a un programa en LumbreTravel.  Es importante que los servicios, hoteles, guías, vehículos y extras ya existan en LumbreTravel, si no existen se puede usar las tools create_service, create_hotel, create_leader, create_vehicle y create_include para crearlos.  O si existen se puede usar las tools get_services_by_name, get_hotel_by_name, get_leader_by_name, get_vehicle_by_name y get_include_by_name para obtener el id de cada servicio, hotel, guía, vehículo y extra.',
          inputSchema: {
            type: 'object',
            properties: {
              programId: {
                type: 'string',
                description: 'ID del programa'
              },
              activities: {
                type: 'array',
                description: 'Lista de actividades a agregar',
                items: {
                  type: 'object',
                  properties: {
                    primaryPassenger: {
                      type: 'string',
                      description: 'ID del pasajero principal, si no se especifica se asume que el primer pasajero es el principal.  Siempre se debe especificar el pasajero principal.'
                    },
                    passengers: {
                      type: 'array',
                      description: 'Lista de pasajeros a asociar a la actividad, es importante que los pasajeros ya existan en LumbreTravel, si no existen se puede usar la tool create_passengers para crearlos.  O si existen se puede usar la tool get_passengers_by_fullname o get_passengers_by_email para obtener el id de cada pasajero.',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        },
                        required: ['id', 'name']
                      }
                    },
                    date: {
                      type: 'string',
                      description: 'Fecha de la actividad (DD-MM-YYYY), debe ser una fecha entre la fecha de inicio y fin del programa'
                    },
                    hour: {
                      type: 'string',
                      description: 'Hora de la actividad (HH:mm)'
                    },
                    service: {
                      type: 'object',
                      description: 'Servicio a asociar a la actividad, es importante que el servicio ya exista en LumbreTravel, si no existe se puede usar la tool create_service para crearlo.  O si existe se puede usar la tool get_services_by_name para obtener el id del servicio.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    hotel: {
                      type: 'object',
                      description: 'Hotel a asociar a la actividad, es importante que el hotel ya exista en LumbreTravel, si no existe se puede usar la tool create_hotel para crearlo.  O si existe se puede usar la tool get_hotel_by_name para obtener el id del hotel.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    leader: {
                      type: 'object',
                      description: 'Guía a asociar a la actividad, es importante que el guía ya exista en LumbreTravel, si no existe se puede usar la tool create_leader para crearlo.  O si existe se puede usar la tool get_leader_by_name para obtener el id del guía.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    vehicle: {
                      type: 'object',
                      description: 'Vehículo a asociar a la actividad, es importante que el vehículo ya exista en LumbreTravel, si no existe se puede usar la tool create_vehicle para crearlo.  O si existe se puede usar la tool get_vehicle_by_name para obtener el id del vehículo.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    includes: {
                      type: 'array',
                      description: 'Lista de extras o incluídos a asociar a la actividad, es importante que los extras ya existan en LumbreTravel, si no existen se puede usar la tool create_include para crearlos.  O si existen se puede usar la tool get_include_by_name para obtener el id de cada extra.',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        }
                      }
                    },
                    servicelanguage: {
                      type: 'object',
                      description: 'Idioma en el que se va a prestar el servicio, si no se especifica se mantiene el idioma actual. Es importante que el idioma ya exista en LumbreTravel, si no existe se puede usar la tool create_service_language para crearlo.  O si existe se puede usar la tool get_service_language_by_name para obtener el id del idioma.  Este idioma solo se puede usar para asociar a un servicio.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    code: {
                      type: 'string',
                      description: 'Código de la actividad, es de carga libre, se puede usar para identificar la actividad en el programa'
                    },
                    itinerary: {
                      type: 'string',
                      description: 'Itinerario de la actividad, es de carga libre, se puede usar para describir la actividad en el programa'
                    },
                    news: {
                      type: 'string',
                      description: 'Noticias de la actividad, es de carga libre, se puede usar para describir noticias o novedades de la actividad en el programa'
                    }
                  },
                  required: ['date', 'hour', 'primaryPassenger']
                }
              }
            },
            required: ['programId', 'activities']
          }
        },
        {
          name: 'update_activities',
          description: 'Actualizar múltiples actividades asociadas a un programa',
          inputSchema: {
            type: 'object',
            properties: {
              programId: {
                type: 'string',
                description: 'ID del programa'
              },
              activities: {
                type: 'array',
                description: 'Lista de actividades a actualizar, es importante que las actividades ya existan en LumbreTravel, si no existen se puede usar la tool add_activities para crearlas.  O si existen se puede usar la tool get_program_by_name para obtener la lista de todas las actividades del programa.',
                items: {
                  type: 'object',
                  properties: {
                    activityId: {
                      type: 'string',
                      description: 'ID de la actividad a actualizar, es importante que la actividad ya exista en LumbreTravel, si no existe se puede usar la tool add_activities para crearla.  O si existe se puede usar la tool get_program_by_name para obtener la lista de todas las actividades del programa.'
                    },
                    primaryPassenger: {
                      type: 'string',
                      description: 'ID del pasajero principal, si no se especifica se mantiene el pasajero principal actual.  Siempre se debe especificar el pasajero principal.'
                    },
                    passengers: {
                      type: 'array',
                      description: 'Lista de pasajeros a asociar a la actividad, es importante que los pasajeros ya existan en LumbreTravel, si no existen se puede usar la tool create_passengers para crearlos.  O si existen se puede usar la tool get_passengers_by_fullname o get_passengers_by_email para obtener el id de cada pasajero.',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        },
                        required: ['id', 'name']
                      }
                    },
                    date: {
                      type: 'string',
                      description: 'Fecha de la actividad (DD-MM-YYYY), debe ser una fecha entre la fecha de inicio y fin del programa'
                    },
                    hour: {
                      type: 'string',
                      description: 'Hora de la actividad (HH:mm)'
                    },
                    service: {
                      type: 'object',
                      description: 'Servicio a asociar a la actividad, es importante que el servicio ya exista en LumbreTravel, si no existe se puede usar la tool create_service para crearlo.  O si existe se puede usar la tool get_services_by_name para obtener el id del servicio.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    hotel: {
                      type: 'object',
                      description: 'Hotel a asociar a la actividad, es importante que el hotel ya exista en LumbreTravel, si no existe se puede usar la tool create_hotel para crearlo.  O si existe se puede usar la tool get_hotel_by_name para obtener el id del hotel.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    leader: {
                      type: 'object',
                      description: 'Guía a asociar a la actividad, es importante que el guía ya exista en LumbreTravel, si no existe se puede usar la tool create_leader para crearlo.  O si existe se puede usar la tool get_leader_by_name para obtener el id del guía.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    vehicle: {
                      type: 'object',
                      description: 'Vehículo a asociar a la actividad, es importante que el vehículo ya exista en LumbreTravel, si no existe se puede usar la tool create_vehicle para crearlo.  O si existe se puede usar la tool get_vehicle_by_name para obtener el id del vehículo.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    includes: {
                      type: 'array',
                      description: 'Lista de extras o incluídos a asociar a la actividad, es importante que los extras ya existan en LumbreTravel, si no existen se puede usar la tool create_include para crearlos.  O si existen se puede usar la tool get_include_by_name para obtener el id de cada extra.',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' }
                        }
                      }
                    },
                    servicelanguage: {
                      type: 'object',
                      description: 'Idioma en el que se va a prestar el servicio, si no se especifica se mantiene el idioma actual. Es importante que el idioma ya exista en LumbreTravel, si no existe se puede usar la tool create_service_language para crearlo.  O si existe se puede usar la tool get_service_language_by_name para obtener el id del idioma.',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' }
                      },
                      required: ['id', 'name']
                    },
                    code: {
                      type: 'string',
                      description: 'Código de la actividad, es de carga libre, se puede usar para identificar la actividad en el programa'
                    },
                    itinerary: {
                      type: 'string',
                      description: 'Itinerario de la actividad, es de carga libre, se puede usar para describir la actividad en el programa'
                    },
                    news: {
                      type: 'string',
                      description: 'Noticias de la actividad, es de carga libre, se puede usar para describir noticias o novedades de la actividad en el programa'
                    }
                  },
                  required: ['date', 'hour', 'primaryPassenger']
                }
              }
            },
            required: ['programId', 'activities']
          }
        },
        {
          name: 'delete_activities',
          description: 'Eliminar múltiples actividades asociadas a un programa',
          inputSchema: {
            type: 'object',
            properties: {
              programId: { type: 'string', description: 'ID del programa' },
              activities: {
                type: 'array',
                description: 'Lista de actividades a eliminar.  Para poder eliminar una actividad se debe especificar el ID de la actividad.  Se puede usar la tool get_program_by_name para obtener la lista de todas las actividades del programa.  Es importante avisarle al usuario que esta acción es irreversible y que se debe tener cuidado al eliminar actividades.',
                items: {
                  type: 'object',
                  properties: {
                    activityId: { type: 'string', description: 'ID de la actividad a eliminar' }
                  },
                  required: ['activityId']
                }
              }
            },
            required: ['programId', 'activities']
          }
        },
        {
          name: 'create_agency',
          description: 'Crear una agencia en LumbreTravel, retorna la agencia creada.  Antes de crear una nueva agencia se debe preguntar al si quiere que primero se busque la agencia a ver si existe.  La agencia creada se puede usar para asociarle programas en LumbreTravel.  Es importante que el proveedor de la agencia tenga un ID de proveedor en LumbreTravel.  Si el proveedor no tiene un ID de proveedor en LumbreTravel, se puede usar la tool create_provider para crear un proveedor y luego usar el ID de proveedor creado para crear la agencia.  Si el proveedor ya tiene un ID de proveedor en LumbreTravel, se puede usar el ID de proveedor para crear la agencia. Para buscar un proveedor por nombre se puede usar la tool get_provider_by_name.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre de la agencia' },
              description: { type: 'string', description: 'Descripción de la agencia' },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'ID del proveedor de la agencia.  Si el proveedor no tiene un ID de proveedor en LumbreTravel, se puede usar la tool create_provider para crear un proveedor y luego usar el ID de proveedor creado para crear la agencia.  Si el proveedor ya tiene un ID de proveedor en LumbreTravel, se puede usar el ID de proveedor para crear la agencia. Para buscar un proveedor por nombre se puede usar la tool get_provider_by_name.' },
                  name: { type: 'string', description: 'Nombre del proveedor de la agencia' }
                }
              }
            },
            required: ['name', 'description', 'provider']
          }
        },
        {
          name: 'update_agency',
          description: 'Actualizar una agencia en LumbreTravel, retorna la agencia actualizada.  La agencia actualizada se puede usar para asociarle programas en LumbreTravel.  Es importante que el proveedor de la agencia tenga un ID de proveedor en LumbreTravel.  Si el proveedor no tiene un ID de proveedor en LumbreTravel, se puede usar la tool create_provider para crear un proveedor y luego usar el ID de proveedor creado para crear la agencia.  Si el proveedor ya tiene un ID de proveedor en LumbreTravel, se puede usar el ID de proveedor para crear la agencia. Para buscar un proveedor por nombre se puede usar la tool get_provider_by_name.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID de la agencia a actualizar, es importante que la agencia ya exista en LumbreTravel, si no existe se puede usar la tool create_agency para crearla.  O si existe se puede usar la tool get_agency_by_name para obtener el id de la agencia.' },
              name: { type: 'string', description: 'Nombre de la agencia' },
              description: { type: 'string', description: 'Descripción de la agencia' },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'ID del proveedor de la agencia.  Si el proveedor no tiene un ID de proveedor en LumbreTravel, se puede usar la tool create_provider para crear un proveedor y luego usar el ID de proveedor creado para crear la agencia.  Si el proveedor ya tiene un ID de proveedor en LumbreTravel, se puede usar el ID de proveedor para crear la agencia. Para buscar un proveedor por nombre se puede usar la tool get_provider_by_name.' },
                  name: { type: 'string', description: 'Nombre del proveedor de la agencia' }
                }
              }
            },
            required: ['id', 'name', 'description', 'provider']
          }
        },
        {
          name: 'delete_agency',
          description: 'Eliminar una agencia en LumbreTravel.  La agencia eliminada no se puede usar para asociarle programas en LumbreTravel.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID de la agencia a eliminar' }
            },
            required: ['id']
          }
        },
        {
          name: 'reactivate_agency',
          description: 'Reactivar una agencia en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: { id: { type: 'string', description: 'ID de la agencia a reactivar' } },
            required: ['id']
          }
        },
        {
          name: 'get_agency_by_name',
          description: 'Obtener una agencia por nombre, retorna la agencia encontrada.',
          inputSchema: {
            type: 'object',
            properties: { name: { type: 'string', description: 'Nombre de la agencia' } },
            required: ['name']
          }
        },
        {
          name: 'create_hotel',
          description: 'Crear un hotel en LumbreTravel, retorna el hotel creado.  Antes de crear un nuevo hotel se debe preguntar al si quiere que primero se busque el hotel a ver si existe.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre del hotel' },
              description: { type: 'string', description: 'Descripción del hotel' },
              phone: { type: 'string', description: 'Teléfono del hotel' },
              email: { type: 'string', description: 'Email del hotel' },
              address: { type: 'string', description: 'Dirección del hotel' }
            },
            required: ['name', 'description', 'phone', 'email', 'address']
          }
        },
        {
          name: 'update_hotel',
          description: 'Actualizar un hotel en LumbreTravel, retorna el hotel actualizado.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del hotel a actualizar' },
              name: { type: 'string', description: 'Nombre del hotel' },
              description: { type: 'string', description: 'Descripción del hotel' },
              phone: { type: 'string', description: 'Teléfono del hotel' },
              email: { type: 'string', description: 'Email del hotel' },
              address: { type: 'string', description: 'Dirección del hotel' }
            },
            required: ['id', 'name', 'description', 'phone', 'email', 'address']
          }
        },
        {
          name: 'delete_hotel',
          description: 'Eliminar un hotel en LumbreTravel.',
          inputSchema: {
            type: 'object',
            properties: { id: { type: 'string', description: 'ID del hotel a eliminar' } },
            required: ['id']
          }
        },
        {
          name: 'reactivate_hotel',
          description: 'Reactivar un hotel en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del hotel a reactivar' } }, required: ['id'] }
        },
        {
          name: 'get_hotel_by_name',
          description: 'Buscar hoteles por su nombre, retorna la lista de hoteles encontrados.',
          inputSchema: {
            type: 'object',
            properties: { name: { type: 'string', description: 'Nombre del hotel' } },
            required: ['name']
          }
        },
        {
          name: 'create_leader',
          description: 'Crear un guía en LumbreTravel.  Antes de crear un nuevo guía se debe preguntar al si quiere que primero se busque el guía a ver si existe.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre del guía' },
              description: { type: 'string', description: 'Descripción del guía' },
              phone: { type: 'string', description: 'Teléfono del guía' },
              language: {
                type: 'string',
                description: "Idioma del guía de acuerdo a ISO 639-1.  No intentes usar 'list_service_languages' ni 'get_service_language_by_name' para obtener el idioma del guía."
              },
              email: { type: 'string', description: 'Email del guía' }
            },
            required: ['name']
          }
        },
        {
          name: 'update_leader',
          description: 'Actualizar un guía en LumbreTravel, retorna el guía actualizado.  Es importante que el guía ya exista en LumbreTravel, si no existe se puede usar la tool create_leader para crearlo.  O si existe se puede usar la tool get_leader_by_name para obtener el id del guía.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del guía a actualizar' },
              name: { type: 'string', description: 'Nombre del guía' },
              description: { type: 'string', description: 'Descripción del guía' },
              phone: { type: 'string', description: 'Teléfono del guía' },
              language: {
                type: 'string',
                description: "Idioma del guía de acuerdo a ISO 639-1.  NO intentes usar 'list_service_languages' ni 'get_service_language_by_name' para obtener el idioma del guía."
              },
              email: { type: 'string', description: 'Email del guía' }
            },
            required: ['id', 'name', 'description', 'phone', 'email', 'language']
          }
        },
        {
          name: 'delete_leader',
          description: 'Eliminar un guía en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del guía a eliminar' } }, required: ['id'] }
        },
        {
          name: 'reactivate_leader',
          description: 'Reactivar un guía en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del guía a reactivar' } }, required: ['id'] }
        },
        {
          name: 'get_leader_by_name',
          description: 'Buscar guías por su nombre, retorna la lista de guías encontrados.',
          inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Nombre del guía' } }, required: ['name'] }
        },
        {
          name: 'create_vehicle',
          description: 'Crear un vehículo en LumbreTravel.  Antes de crear un nuevo vehículo se debe preguntar al si quiere que primero se busque el vehículo a ver si existe.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre del vehículo' },
              description: { type: 'string', description: 'Descripción del vehículo' },
              brand: { type: 'string', description: 'Marca del vehículo' },
              model: { type: 'string', description: 'Modelo del vehículo' },
              capacity: { type: 'number', description: 'Capacidad del vehículo' },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'ID del proveedor del vehículo.  Si el proveedor no tiene un ID de proveedor en LumbreTravel, se puede usar la tool create_provider para crear un proveedor y luego usar el ID de proveedor creado para crear el vehículo.  Si el proveedor ya tiene un ID de proveedor en LumbreTravel, se puede usar el ID de proveedor para crear el vehículo. Para buscar un proveedor por nombre se puede usar la tool get_provider_by_name.' },
                  name: { type: 'string', description: 'Nombre del proveedor del vehículo' }
                }
              }
            },
            required: ['name', 'description', 'provider']
          }
        },
        {
          name: 'update_vehicle',
          description: 'Actualizar un vehículo en LumbreTravel, retorna el vehículo actualizado.  Es importante que el vehículo ya exista en LumbreTravel, si no existe se puede usar la tool create_vehicle para crearlo.  O si existe se puede usar la tool get_vehicle_by_name para obtener el id del vehículo.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del vehículo a actualizar' },
              name: { type: 'string', description: 'Nombre del vehículo' },
              description: { type: 'string', description: 'Descripción del vehículo' },
              brand: { type: 'string', description: 'Marca del vehículo' },
              model: { type: 'string', description: 'Modelo del vehículo' },
              capacity: { type: 'number', description: 'Capacidad del vehículo' },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'ID del proveedor del vehículo.  Si el proveedor no tiene un ID de proveedor en LumbreTravel, se puede usar la tool create_provider para crear un proveedor y luego usar el ID de proveedor creado para crear el vehículo.  Si el proveedor ya tiene un ID de proveedor en LumbreTravel, se puede usar el ID de proveedor para crear el vehículo. Para buscar un proveedor por nombre se puede usar la tool get_provider_by_name.' },
                  name: { type: 'string', description: 'Nombre del proveedor del vehículo' }
                }
              }
            },
            required: ['id', 'name', 'description', 'brand', 'model', 'capacity', 'provider']
          }
        },
        {
          name: 'delete_vehicle',
          description: 'Eliminar un vehículo en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del vehículo a eliminar' } }, required: ['id'] }
        },
        {
          name: 'reactivate_vehicle',
          description: 'Reactivar un vehículo en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del vehículo a reactivar' } }, required: ['id'] }
        },
        {
          name: 'get_vehicle_by_name',
          description: 'Buscar vehículos por su nombre, retorna la lista de vehículos encontrados.',
          inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Nombre del vehículo' } }, required: ['name'] }
        },
        {
          name: 'create_include',
          description: 'Crear un extra o incluído en LumbreTravel.  Antes de crear un nuevo extra o incluído se debe preguntar al si quiere que primero se busque el extra o incluído a ver si existe.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre' },
              description: { type: 'string', description: 'Descripción' }
            },
            required: ['name', 'description']
          }
        },
        {
          name: 'update_include',
          description: 'Actualizar un extra o incluído en LumbreTravel, retorna el extra o incluído actualizado.  Es importante que el extra o incluído ya exista en LumbreTravel, si no existe se puede usar la tool create_include para crearlo.  O si existe se puede usar la tool get_include_by_name para obtener el id del extra o incluído.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del include a actualizar' },
              name: { type: 'string', description: 'Nombre' },
              description: { type: 'string', description: 'Descripción' }
            },
            required: ['id', 'name', 'description']
          }
        },
        {
          name: 'delete_include',
          description: 'Eliminar un extra o incluído en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: { id: { type: 'string', description: 'ID del include a eliminar' } },
            required: ['id']
          }
        },
        {
          name: 'reactivate_include',
          description: 'Reactivar un extra o incluído en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del include a reactivar' } }, required: ['id'] }
        },
        {
          name: 'get_includes_by_name',
          description: 'Buscar extras o incluídos por su nombre, retorna la lista de extras o incluídos encontrados.',
          inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Nombre del include' } }, required: ['name'] }
        },
        {
          name: 'create_service_language',
          description: 'Crear un idioma de servicio en LumbreTravel.  Antes de crear un nuevo idioma de servicio se debe preguntar al si quiere que primero se busque el idioma de servicio a ver si existe.  Este idioma solo se puede usar para asociar a un servicio.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre del idioma de servicio' }
            },
            required: ['name']
          }
        },
        {
          name: 'update_service_language',
          description: 'Actualizar un idioma de servicio en LumbreTravel, retorna el idioma de servicio actualizado.  Es importante que el idioma de servicio ya exista en LumbreTravel, si no existe se puede usar la tool create_service_language para crearlo.  O si existe se puede usar la tool get_service_language_by_name para obtener el id del idioma de servicio.  Este idioma solo se puede usar para asociar a un servicio.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del idioma de servicio a actualizar' },
              name: { type: 'string', description: 'Nombre del idioma de servicio' }
            },
            required: ['id', 'name']
          }
        },
        {
          name: 'delete_service_language',
          description: 'Eliminar un idioma de servicio en LumbreTravel',
          inputSchema: {
            type: 'object',
            properties: { id: { type: 'string', description: 'ID del idioma de servicio a eliminar' } },
            required: ['id']
          }
        },
        {
          name: 'reactivate_service_language',
          description: 'Reactivar un idioma de servicio en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del idioma de servicio a reactivar' } }, required: ['id'] }
        },
        {
          name: 'get_service_language_by_name',
          description: 'Buscar idiomas de servicio por su nombre, retorna la lista de idiomas de servicio encontrados.',
          inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Nombre del idioma de servicio' } }, required: ['name'] }
        },
        {
          name: 'create_provider',
          description: 'Crear un proveedor en LumbreTravel.  Antes de crear un nuevo proveedor se debe preguntar al si quiere que primero se busque el proveedor a ver si existe.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre del proveedor' },
              description: { type: 'string', description: 'Descripción del proveedor' },
              email: { type: 'string', description: 'Email del proveedor, si no tiene email se puede dejar en blanco' },
              phone: { type: 'string', description: 'Teléfono del proveedor, si no tiene teléfono se puede dejar en blanco' }
            },
            required: ['name', 'description']
          }
        },
        {
          name: 'update_provider',
          description: 'Actualizar un proveedor en LumbreTravel, retorna el proveedor actualizado.  Es importante que el proveedor ya exista en LumbreTravel, si no existe se puede usar la tool create_provider para crearlo.  O si existe se puede usar la tool get_provider_by_name para obtener el id del proveedor.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del proveedor a actualizar' },
              name: { type: 'string', description: 'Nombre del proveedor' },
              description: { type: 'string', description: 'Descripción del proveedor' },
              email: { type: 'string', description: 'Email del proveedor, si no tiene email se puede dejar en blanco' },
              phone: { type: 'string', description: 'Teléfono del proveedor, si no tiene teléfono se puede dejar en blanco' }
            },
            required: ['id', 'name', 'description']
          }
        },
        {
          name: 'delete_provider',
          description: 'Eliminar un proveedor en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del proveedor a eliminar' } }, required: ['id'] }
        },
        {
          name: 'reactivate_provider',
          description: 'Reactivar un proveedor en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del proveedor a reactivar' } }, required: ['id'] }
        },
        {
          name: 'get_provider_by_name',
          description: 'Buscar proveedores por su nombre, retorna la lista de proveedores encontrados.',
          inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Nombre del proveedor' } }, required: ['name'] }
        },
        {
          name: 'create_service',
          description: 'Crear un servicio en LumbreTravel.  Antes de crear un nuevo servicio se debe preguntar al si quiere que primero se busque el servicio a ver si existe.',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Nombre del servicio' },
              description: { type: 'string', description: 'Descripción del servicio' },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'ID del proveedor.  El proveedor debe existir en LumbreTravel.  Si el proveedor no existe se puede usar la tool create_provider para crearlo.  O si existe se puede usar la tool get_provider_by_name para obtener el id del proveedor.' },
                  name: { type: 'string', description: 'Nombre del proveedor' }
                }
              }
            },
            required: ['name', 'description', 'provider']
          }
        },
        {
          name: 'update_service',
          description: 'Actualizar un servicio en LumbreTravel, retorna el servicio actualizado.  Es importante que el servicio ya exista en LumbreTravel, si no existe se puede usar la tool create_service para crearlo.  O si existe se puede usar la tool get_services_by_name para obtener el id del servicio.',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'ID del servicio a actualizar' },
              name: { type: 'string', description: 'Nombre del servicio' },
              description: { type: 'string', description: 'Descripción del servicio' },
              provider: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'ID del proveedor.  El proveedor debe existir en LumbreTravel.  Si el proveedor no existe se puede usar la tool create_provider para crearlo.  O si existe se puede usar la tool get_provider_by_name para obtener el id del proveedor.' },
                  name: { type: 'string', description: 'Nombre del proveedor' }
                }
              }
            },
            required: ['id', 'name', 'description', 'provider']
          }
        },
        {
          name: 'delete_service',
          description: 'Eliminar un servicio en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del servicio a eliminar' } }, required: ['id'] }
        },
        {
          name: 'reactivate_service',
          description: 'Reactivar un servicio en LumbreTravel',
          inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'ID del servicio a reactivar' } }, required: ['id'] }
        },
        {
          name: 'get_services_by_name',
          description: 'Buscar servicios por su nombre, retorna la lista de servicios encontrados.',
          inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Nombre del servicio' } }, required: ['name'] }
        }
      ]
    }
  }

  async callTool (name: string, args: any, server: Server) {
    try {
      switch (name) {
        case 'get_program': {
          const { id } = args as { id: string }
          const program = await this.apiService.getProgram(id)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(program, null, 2)
            }]
          }
        }

        case 'get_programs_by_name': {
          const { name } = args as { name: string }
          const program = await this.apiService.getProgramsByName(name)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(program, null, 2)
            }]
          }
        }

        case 'get_programs_by_date_range': {
          const { startDate, endDate } = args
          const programs = await this.apiService.getProgramsByDateRange(
            formatDate(startDate),
            formatDate(endDate)
          )
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(programs, null, 2)
            }]
          }
        }

        case 'daily_activities': {
          const { date, hotelIdToFilter, leaderIdToFilter, vehicleIdToFilter, serviceIdToFilter } = args as { date: string, hotelIdToFilter: string, leaderIdToFilter: string, vehicleIdToFilter: string, serviceIdToFilter: string }
          const activities = await this.apiService.getDailyActivities(date, hotelIdToFilter, leaderIdToFilter, vehicleIdToFilter, serviceIdToFilter)
          return {
            content: [{ type: 'text', text: JSON.stringify(activities, null, 2) }]
          }
        }

        case 'season_summary': {
          const { startYear, endYear } = args as { startYear: string, endYear: string }
          const seasonSummary = await this.apiService.getSeasonSummary(startYear, endYear)
          return {
            content: [{ type: 'text', text: JSON.stringify(seasonSummary, null, 2) }]
          }
        }

        case 'create_program': {
          const {
            name,
            startDate,
            endDate,
            agencyId
          } = args

          const program = await this.apiService.createProgram({
            name,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            agency: { id: agencyId }
          })

          return {
            content: [{
              type: 'text',
              text: `Programa "${name}" creado exitosamente.\n\nDetalles del programa:\n${JSON.stringify(program, null, 2)}`
            }]
          }
        }

        case 'update_program': {
          const { id, name, startDate, endDate, agencyId } = args
          const program = await this.apiService.updateProgram({
            id,
            name,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            agency: { id: agencyId }
          })

          return {
            content: [{
              type: 'text',
              text: `Programa "${name}" actualizado exitosamente.\n\nDetalles del programa:\n${JSON.stringify(program, null, 2)}`
            }]
          }
        }

        case 'delete_program': {
          const { id } = args as { id: string }
          const program = await this.apiService.deleteProgram(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(program, null, 2) }]
          }
        }

        case 'reactivate_program': {
          const { id } = args as { id: string }
          const program = await this.apiService.reactivateProgram(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(program, null, 2) }]
          }
        }

        case 'list_agencies': {
          const agencies = await this.apiService.getAgencies()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(agencies, null, 2)
            }]
          }
        }

        case 'list_services': {
          const services = await this.apiService.getServices()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(services, null, 2)
            }]
          }
        }

        case 'list_hotels': {
          const hotels = await this.apiService.getHotels()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(hotels, null, 2)
            }]
          }
        }

        case 'list_leaders': {
          const leaders = await this.apiService.getLeaders()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(leaders, null, 2)
            }]
          }
        }

        case 'list_vehicles': {
          const vehicles = await this.apiService.getVehicles()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(vehicles, null, 2)
            }]
          }
        }

        case 'list_includes': {
          const includes = await this.apiService.getIncludes()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(includes, null, 2)
            }]
          }
        }

        case 'list_service_languages': {
          const serviceLanguages = await this.apiService.getServiceLanguages()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(serviceLanguages, null, 2)
            }]
          }
        }

        case 'list_providers': {
          const providers = await this.apiService.getProviders()
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(providers, null, 2)
            }]
          }
        }

        case 'get_passengers_by_fullname': {
          const { fullname } = args as { fullname: string }
          const passengers = await this.apiService.getPassengersByFullname(fullname)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(passengers, null, 2)
            }]
          }
        }

        case 'get_passengers_by_email': {
          const { email } = args as { email: string }
          const passengers = await this.apiService.getPassengersByEmail(email)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(passengers, null, 2)
            }]
          }
        }

        case 'create_bulk_passengers': {
          const { programId, passengers } = args as { programId: string, passengers: any[] }
          const createdPassengers = await this.apiService.createBulkPassengers(passengers, programId)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(createdPassengers, null, 2)
            }]
          }
        }

        case 'create_passengers': {
          const { passengers, programId } = args as { passengers: any[], programId: string }
          const createdPassengers = await this.apiService.createPassengers(passengers, programId)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(createdPassengers, null, 2)
            }]
          }
        }

        case 'update_passengers': {
          const { passengers } = args as { passengers: any[] }
          const updatedPassengers = await this.apiService.updatePassengers(passengers)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(updatedPassengers, null, 2)
            }]
          }
        }

        case 'delete_passengers': {
          const { passengers } = args as { passengers: any[] }
          const deletedPassengers = await this.apiService.deletePassengers(passengers)
          return {
            content: [{ type: 'text', text: JSON.stringify(deletedPassengers, null, 2) }]
          }
        }

        case 'delete_passenger': {
          const { passengerId } = args as { passengerId: string }
          const deletedPassenger = await this.apiService.deletePassenger(passengerId)
          return {
            content: [{ type: 'text', text: JSON.stringify(deletedPassenger, null, 2) }]
          }
        }

        case 'reactivate_passenger': {
          const { id } = args as { id: string }
          const reactivatedPassenger = await this.apiService.reactivatePassenger(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(reactivatedPassenger, null, 2) }]
          }
        }

        case 'add_passengers_to_program': {
          const { programId, passengers } = args as { programId: string, passengers: any[] }
          const addedPassengers = await this.apiService.addPassengersToProgram(programId, passengers)
          return {
            content: [{ type: 'text', text: JSON.stringify(addedPassengers, null, 2) }]
          }
        }

        case 'add_activities': {
          const { programId, activities } = args
          activities.forEach((activity: any) => {
            activity.date = formatDate(activity.date)
          })
          const program = await this.apiService.addActivities({ programId, activities })

          return {
            content: [{
              type: 'text',
              text: `Actividades agregadas exitosamente al programa.\n\nDetalles del programa actualizado:\n${JSON.stringify(program, null, 2)}`
            }]
          }
        }

        case 'update_activities': {
          const { programId, activities } = args
          activities.forEach((activity: any) => {
            activity.date = formatDate(activity.date)
          })
          const program = await this.apiService.updateActivities({ programId, activities })
          return {
            content: [{
              type: 'text',
              text: `Actividades actualizadas exitosamente al programa.\n\nDetalles del programa actualizado:\n${JSON.stringify(program, null, 2)}`
            }]
          }
        }

        case 'delete_activities': {
          const { programId, activities } = args
          const deletedActivities = await this.apiService.deleteActivities({ programId, activities })
          return {
            content: [{ type: 'text', text: JSON.stringify(deletedActivities, null, 2) }]
          }
        }

        case 'create_agency': {
          const { name, description, provider } = args
          const agency = await this.apiService.createAgency({ name, description, provider })
          return {
            content: [{ type: 'text', text: JSON.stringify(agency, null, 2) }]
          }
        }

        case 'update_agency': {
          const { id, name, description, provider } = args
          const agency = await this.apiService.updateAgency({ id, name, description, provider })
          return {
            content: [{ type: 'text', text: JSON.stringify(agency, null, 2) }]
          }
        }

        case 'delete_agency': {
          const { id } = args as { id: string }
          const agency = await this.apiService.deleteAgency(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(agency, null, 2) }]
          }
        }

        case 'reactivate_agency': {
          const { id } = args as { id: string }
          const agency = await this.apiService.reactivateAgency(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(agency, null, 2) }]
          }
        }

        case 'get_agency_by_name': {
          const { name } = args as { name: string }
          const agency = await this.apiService.getAgencyByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(agency, null, 2) }]
          }
        }

        case 'create_hotel': {
          const { name, description, phone, email, address } = args
          const hotel = await this.apiService.createHotel({ name, description, phone, email, address })
          return {
            content: [{ type: 'text', text: JSON.stringify(hotel, null, 2) }]
          }
        }

        case 'update_hotel': {
          const { id, name, description, phone, email, address } = args
          const hotel = await this.apiService.updateHotel({ id, name, description, phone, email, address })
          return {
            content: [{ type: 'text', text: JSON.stringify(hotel, null, 2) }]
          }
        }

        case 'delete_hotel': {
          const { id } = args as { id: string }
          const hotel = await this.apiService.deleteHotel(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(hotel, null, 2) }]
          }
        }

        case 'reactivate_hotel': {
          const { id } = args as { id: string }
          const hotel = await this.apiService.reactivateHotel(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(hotel, null, 2) }]
          }
        }

        case 'get_hotel_by_name': {
          const { name } = args as { name: string }
          const hotel = await this.apiService.getHotelByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(hotel, null, 2) }]
          }
        }

        case 'create_service': {
          const { name, description, provider } = args
          const service = await this.apiService.createService({ name, description, provider })
          return {
            content: [{ type: 'text', text: JSON.stringify(service, null, 2) }]
          }
        }

        case 'update_service': {
          const { id, name, description, provider } = args
          const service = await this.apiService.updateService({ id, name, description, provider })
          return {
            content: [{ type: 'text', text: JSON.stringify(service, null, 2) }]
          }
        }

        case 'delete_service': {
          const { id } = args as { id: string }
          const service = await this.apiService.deleteService(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(service, null, 2) }]
          }
        }

        case 'reactivate_service': {
          const { id } = args as { id: string }
          const service = await this.apiService.reactivateService(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(service, null, 2) }]
          }
        }

        case 'get_services_by_name': {
          const { name } = args as { name: string }
          const service = await this.apiService.getServicesByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(service, null, 2) }]
          }
        }

        case 'create_leader': {
          const { name, description, phone, email, language } = args
          const leader = await this.apiService.createLeader({ name, description, phone, email, language })
          return {
            content: [{ type: 'text', text: JSON.stringify(leader, null, 2) }]
          }
        }

        case 'update_leader': {
          const { id, name, description, phone, email, language } = args
          const leader = await this.apiService.updateLeader({ id, name, description, phone, email, language })
          return {
            content: [{ type: 'text', text: JSON.stringify(leader, null, 2) }]
          }
        }

        case 'delete_leader': {
          const { id } = args as { id: string }
          const leader = await this.apiService.deleteLeader(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(leader, null, 2) }]
          }
        }

        case 'reactivate_leader': {
          const { id } = args as { id: string }
          const leader = await this.apiService.reactivateLeader(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(leader, null, 2) }]
          }
        }

        case 'get_leader_by_name': {
          const { name } = args as { name: string }
          const leader = await this.apiService.getLeaderByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(leader, null, 2) }]
          }
        }

        case 'create_vehicle': {
          const { name, description, brand, model, capacity, provider } = args
          const vehicle = await this.apiService.createVehicle({ name, description, brand, model, capacity, provider })
          return {
            content: [{ type: 'text', text: JSON.stringify(vehicle, null, 2) }]
          }
        }

        case 'update_vehicle': {
          const { id, name, description, brand, model, capacity, provider } = args
          const vehicle = await this.apiService.updateVehicle({ id, name, description, brand, model, capacity, provider })
          return {
            content: [{ type: 'text', text: JSON.stringify(vehicle, null, 2) }]
          }
        }

        case 'delete_vehicle': {
          const { id } = args as { id: string }
          const vehicle = await this.apiService.deleteVehicle(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(vehicle, null, 2) }]
          }
        }

        case 'reactivate_vehicle': {
          const { id } = args as { id: string }
          const vehicle = await this.apiService.reactivateVehicle(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(vehicle, null, 2) }]
          }
        }

        case 'get_vehicle_by_name': {
          const { name } = args as { name: string }
          const vehicle = await this.apiService.getVehicleByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(vehicle, null, 2) }]
          }
        }

        case 'create_provider': {
          const { name, description, phone, email } = args
          const provider = await this.apiService.createProvider({ name, description, phone, email })
          return {
            content: [{ type: 'text', text: JSON.stringify(provider, null, 2) }]
          }
        }

        case 'update_provider': {
          const { id, name, description, phone, email } = args
          const provider = await this.apiService.updateProvider({ id, name, description, phone, email })
          return {
            content: [{ type: 'text', text: JSON.stringify(provider, null, 2) }]
          }
        }

        case 'delete_provider': {
          const { id } = args as { id: string }
          const provider = await this.apiService.deleteProvider(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(provider, null, 2) }]
          }
        }

        case 'reactivate_provider': {
          const { id } = args as { id: string }
          const provider = await this.apiService.reactivateProvider(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(provider, null, 2) }]
          }
        }

        case 'get_provider_by_name': {
          const { name } = args as { name: string }
          const provider = await this.apiService.getProviderByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(provider, null, 2) }]
          }
        }

        case 'create_include': {
          const { name, description } = args
          const include = await this.apiService.createInclude({ name, description })
          return {
            content: [{ type: 'text', text: JSON.stringify(include, null, 2) }]
          }
        }

        case 'update_include': {
          const { id, name, description } = args
          const include = await this.apiService.updateInclude({ id, name, description })
          return {
            content: [{ type: 'text', text: JSON.stringify(include, null, 2) }]
          }
        }

        case 'delete_include': {
          const { id } = args as { id: string }
          const include = await this.apiService.deleteInclude(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(include, null, 2) }]
          }
        }

        case 'reactivate_include': {
          const { id } = args as { id: string }
          const include = await this.apiService.reactivateInclude(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(include, null, 2) }]
          }
        }

        case 'get_includes_by_name': {
          const { name } = args as { name: string }
          const includes = await this.apiService.getIncludesByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(includes, null, 2) }]
          }
        }

        case 'create_service_language': {
          const { name, description } = args
          const serviceLanguage = await this.apiService.createServiceLanguage({ name, description })
          return {
            content: [{ type: 'text', text: JSON.stringify(serviceLanguage, null, 2) }]
          }
        }

        case 'update_service_language': {
          const { id, name, description } = args
          const serviceLanguage = await this.apiService.updateServiceLanguage({ id, name, description })
          return {
            content: [{ type: 'text', text: JSON.stringify(serviceLanguage, null, 2) }]
          }
        }

        case 'delete_service_language': {
          const { id } = args as { id: string }
          const serviceLanguage = await this.apiService.deleteServiceLanguage(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(serviceLanguage, null, 2) }]
          }
        }

        case 'reactivate_service_language': {
          const { id } = args
          const serviceLanguage = await this.apiService.reactivateServiceLanguage(id)
          return {
            content: [{ type: 'text', text: JSON.stringify(serviceLanguage, null, 2) }]
          }
        }

        case 'get_service_language_by_name': {
          const { name } = args
          const serviceLanguage = await this.apiService.getServiceLanguageByName(name)
          return {
            content: [{ type: 'text', text: JSON.stringify(serviceLanguage, null, 2) }]
          }
        }

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          )
      }
    } catch (error) {
      if (error instanceof Response) {
        const errorData = await error.json()
        return {
          content: [{
            type: 'text',
            text: `LumbreTravel Tool API error: ${errorData.message ?? error.statusText}`
          }],
          isError: true
        }
      } else {
        return {
          content: [{
            type: 'text',
            text: `LumbreTravel Tool API error: ${error instanceof Error ? error.message : JSON.stringify(error, null, 2)}`
          }],
          isError: true
        }
      }
    }
  }
}
