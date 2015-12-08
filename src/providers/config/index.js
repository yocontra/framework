import { Provider } from '../../container/provider'
import { Config } from './config'

class ConfigProvider extends Provider {
  register () {
    this.instance('config', new Config)
  }
}

module.exports = ConfigProvider
