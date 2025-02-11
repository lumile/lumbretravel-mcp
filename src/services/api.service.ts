import fetch from 'node-fetch'
import { API_CONFIG } from '../config/index.js'
import { AuthService } from './auth.service.js'
import { convertToISOWithOffset } from '../utils/date.utils.js'

export class ApiService {
  private readonly authService: AuthService

  constructor () {
    this.authService = new AuthService()
  }

  private async getHeaders () {
    const token = await this.authService.getAccessToken()
    return {
      Authorization: `Bearer ${token}`
    }
  }

  private async handleResponse<T>(response: import('node-fetch').Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.json()
      console.error('Error response:', errorBody)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await (response.json() as Promise<T>)
  }

  async getPrograms () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getProgramsByDateRange (startDate: string, endDate: string) {
    const headers = await this.getHeaders()
    const dataToSend = new URLSearchParams({
      startDate,
      endDate
    })
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/get_programs_by_date_range`, {
      method: 'POST',
      headers,
      body: dataToSend
    })
    return await this.handleResponse<any>(response)
  }

  async getDailyActivities (date: string, hotelIdToFilter: string, leaderIdToFilter: string, vehicleIdToFilter: string, serviceIdToFilter: string) {
    const dateForDailyActivities = convertToISOWithOffset(date)
    const headers = await this.getHeaders()
    const dataToSend = new URLSearchParams({
      date: dateForDailyActivities,
      hotelIdToFilter,
      leaderIdToFilter,
      vehicleIdToFilter,
      serviceIdToFilter
    })
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/daily_activities`, {
      method: 'POST',
      headers,
      body: dataToSend
    })
    return await this.handleResponse<any>(response)
  }

  async getSeasonSummary (startYear: string, endYear: string) {
    const headers = await this.getHeaders()
    const dataToSend = new URLSearchParams({
      startYear,
      endYear
    })
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/season_summary`, {
      method: 'POST',
      headers,
      body: dataToSend
    })
    return await this.handleResponse<any>(response)
  }

  async getProgram (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/get/${id}`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async getProgramsByName (name: string) {
    const headers = await this.getHeaders()
    const dataToSend = new URLSearchParams({
      name
    })
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/get_programs_by_name`, {
      method: 'POST',
      headers,
      body: dataToSend
    })
    return await this.handleResponse<any>(response)
  }

  async createProgram (data: {
    name: string
    startDate: string
    endDate: string
    agency: { id: string }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateProgram (data: {
    id: string
    name: string
    startDate: string
    endDate: string
    agency: { id: string }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteProgram (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateProgram (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/reactivate/${id}`, {
      method: 'PUT',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async addActivities (data: {
    programId: string
    activities: Array<{
      date: string
      hour: string
      service?: {
        id: string
        name: string
      }
      hotel?: {
        id: string
        name: string
      }
      leader?: {
        id: string
        name: string
      }
      vehicle?: {
        id: string
        name: string
      }
      primaryPassenger: string
      passengers: Array<{
        id: string
        name: string
      }>
      includes?: Array<{
        id: string
        name: string
      }>
      servicelanguage?: {
        id: string
        name: string
      }
      code?: string
      itinerary?: string
      news?: string
    }>
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/activity/add`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateActivities (data: {
    programId: string
    activities: Array<{
      activityId: string
      date: string
      hour: string
      service?: {
        id: string
        name: string
      }
      hotel?: {
        id: string
        name: string
      }
      leader?: {
        id: string
        name: string
      }
      vehicle?: {
        id: string
        name: string
      }
      primaryPassenger: string
      passengers: Array<{
        id: string
        name: string
      }>
      includes?: Array<{
        id: string
        name: string
      }>
      servicelanguage?: {
        id: string
        name: string
      }
      code?: string
      itinerary?: string
      news?: string
    }>
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/activity/update`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteActivities (data: {
    programId: string
    activities: Array<{
      activityId: string
    }>
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/activity/delete`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async getPassengersByFullname (fullname: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/get_passengers_by_fullname`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname })
    })
    return await this.handleResponse<any>(response)
  }

  async getPassengersByEmail (email: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/get_passengers_by_email`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return await this.handleResponse<any>(response)
  }

  async createBulkPassengers (passengers: any[], programId: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/bulk`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengers, programId })
    })
    return await this.handleResponse<any>(response)
  }

  async createPassengers (passengers: any[], programId: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/create_passengers`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengers, programId })
    })
    return await this.handleResponse<any>(response)
  }

  async updatePassengers (passengers: any[]) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/update_passengers`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengers })
    })
    return await this.handleResponse<any>(response)
  }

  async deletePassengers (passengers: any[]) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/delete_passengers`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ passengers })
    })
    return await this.handleResponse<any>(response)
  }

  async deletePassenger (passengerId: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/delete/${passengerId}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivatePassenger (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/passengers/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async addPassengersToProgram (programId: string, passengers: any[]) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/programs/add_passengers`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId, passengers })
    })
    return await this.handleResponse<any>(response)
  }

  async getAgencies () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/agencies`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getServices () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/services`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getHotels () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/hotels`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getLeaders () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/leaders`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getVehicles () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/vehicles`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getIncludes () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/includes`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getServiceLanguages () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/servicelanguages`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async getProviders () {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/providers`, {
      method: 'GET',
      headers
    })
    return await this.handleResponse<any[]>(response)
  }

  async createAgency (data: {
    name: string
    description: string
    provider: {
      id: string
      name: string
    }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/agency/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateAgency (data: {
    id: string
    name: string
    description: string
    provider: {
      id: string
      name: string
    }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/agency/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteAgency (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/agency/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateAgency (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/agency/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getAgencyByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/agency/get_agencies_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }

  async createHotel (data: {
    name: string
    description: string
    phone: string
    email: string
    address: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/hotels/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateHotel (data: {
    id: string
    name: string
    description: string
    phone: string
    email: string
    address: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/hotels/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteHotel (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/hotels/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateHotel (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/hotels/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getHotelByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/hotels/get_hotels_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }

  async createServiceLanguage (data: {
    name: string
    description: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/servicelanguage/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateServiceLanguage (data: {
    id: string
    name: string
    description: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/servicelanguage/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteServiceLanguage (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/servicelanguage/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateServiceLanguage (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/servicelanguage/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getServiceLanguageByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/servicelanguage/get_servicelanguages_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }

  async createProvider (data: {
    name: string
    description: string
    phone: string
    email: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/provider/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateProvider (data: {
    id: string
    name: string
    description: string
    phone: string
    email: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/provider/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteProvider (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/provider/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateProvider (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/provider/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getProviderByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/provider/get_providers_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }

  async createService (data: {
    name: string
    description: string
    provider: {
      id: string
      name: string
    }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/service/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateService (data: {
    id: string
    name: string
    description: string
    provider: {
      id: string
      name: string
    }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/service/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteService (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/service/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateService (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/service/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getServiceByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/service/get_services_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }

  async createLeader (data: {
    name: string
    description: string
    phone: string
    email: string
    language: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/leader/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateLeader (data: {
    id: string
    name: string
    description: string
    phone: string
    email: string
    language: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/leader/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteLeader (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/leader/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateLeader (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/leader/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getLeaderByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/leader/get_leaders_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }

  async createVehicle (data: {
    name: string
    description: string
    brand: string
    model: string
    capacity: number
    provider: {
      id: string
      name: string
    }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/vehicle/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateVehicle (data: {
    id: string
    name: string
    description: string
    brand: string
    model: string
    capacity: number
    provider: {
      id: string
      name: string
    }
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/vehicle/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteVehicle (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/vehicle/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateVehicle (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/vehicle/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getVehicleByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/vehicle/get_vehicles_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }

  async createInclude (data: {
    name: string
    description: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/include/create`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async updateInclude (data: {
    id: string
    name: string
    description: string
  }) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/include/update`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await this.handleResponse<any>(response)
  }

  async deleteInclude (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/include/delete/${id}`, {
      method: 'DELETE',
      headers
    })
    return await this.handleResponse<any>(response)
  }

  async reactivateInclude (id: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/include/reactivate`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id })
    })
    return await this.handleResponse<any>(response)
  }

  async getIncludesByName (name: string) {
    const headers = await this.getHeaders()
    const response = await fetch(`${API_CONFIG.baseUrl}/integrations/mcp/include/get_includes_by_name`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    return await this.handleResponse<any>(response)
  }
}
