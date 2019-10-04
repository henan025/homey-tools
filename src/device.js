const Homey = require('homey')

const utils = require('./utils')

module.exports = class Device extends Homey.Device {
  onInit () {}

  debug (args) {
    this.log('Debugging device')
    this.log('Name:', this.getName())
    this.log('Class:', this.getClass())
    this.log('Settings: ', this.getSettings())
    if (args) {
      this.log(args)
    }
  }

  reload () {
    console.log(`[${this.getClass()}]: Has not implemented reload`)
  }

  onSettings (oldSettings, newSettings, changedKeys, callback) {
    callback(null, true)
  }

  async getDevice(deviceId) {
    try {
      return await Homey.app.getDevice(deviceId)
    } catch (e) {
      if (e.name === 'device_not_found') {
        this.log(`[${this.getName()}] Could not get device: |${deviceId}]: device no longer exists.`)
      }
      this.error(e)
      return false
    }
  }

  async _setCapability(cap, value, opts) {
    // console.log(`${cap} called: ${value}`, opts)
    const { devices } = this.getSettings()
    for (let idx in devices) {
      let device = await this.getDevice(devices[idx])
      try {
        let result = await device.setCapabilityValue(cap, value)
        // console.log(result)
        await utils.sleep(0.5)
      } catch (e) {
        throw new Error(`Switching the device [${this.name}] failed!`, e)
      }
    }
  }
}