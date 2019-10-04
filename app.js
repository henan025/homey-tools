'use strict'
const Homey = require('homey')
const { HomeyAPI  } = require('athom-api')

class HomeyToolsApp extends Homey.App {

  onInit() {
    this.devices = {}
    this.api = null
  }

  resetApi () {
    this.api = null
    return this.api
  }

  async getApi () {
    if (!this.api) {
      this.api = await HomeyAPI.forCurrentHomey()
      this.api.devices.on('device.create', async (device) => {
        this.log(`Device CREATED: [${device.id}][${device.name}]`)
        this.resetApi()
      })
      this.api.devices.on('device.update', async (device) => {
        this.log(`Device Updated: [${device.name}]`)
      })
      this.api.devices.on('device.delete', async (device) => {
        this.log(`Device DELETED: [${device.id}]`)
        delete this.devices[device.id]
        this.resetApi()
      })
    }
    return this.api
  }

  async getDevices () {
    const api = await this.getApi()
    return await api.devices.getDevices()
  }

  async getDevice (id) {
    if (!this.devices[id]) {
      this.devices = await this.getDevices()
    }
    return this.devices[id]
  }

  async registerDeviceCapabilityChangedListener (deviceId, cap, listener) {
    const device = await this.getDevice(id)
    device.registerCapabilityListener(cap, listener)
  }
	
}

module.exports = HomeyToolsApp
