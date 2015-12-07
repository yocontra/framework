import { Provider } from '../../container/provider'
import { Config } from './config'

export class ConfigProvider extends Provider {
  register () {
    this.instance('config', new Config)
  }
}
