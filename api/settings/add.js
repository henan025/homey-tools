const Homey = require('homey')

exports = {
  method: 'PUT',
  path: '/settings/:driver',
  fn: async (args, callback) => {
    const deviceDriver = await Homey.ManagerDrivers.getDriver(args.params.driver)
    const device = await deviceDriver.getDevice(args.body.deviceData)
    device.updateSettings(args.body)
    if (callback) {
      callback(null, device.getSettings())
    }
  }
}