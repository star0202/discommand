import { Client, Collection } from 'discord.js'
import { Options } from './types/Options'
import { readdirSync } from 'fs'
import { Command, Listener } from '.'

export class BaseHandler {
  client: Client
  options: Options
  public constructor(client: Client, options: Options) {
    this.client = client
    this.options = options
  }

  public modules = new Collection()

  /**
   *
   * @private
   */
  private Register(modules: Command | Listener) {
    if (modules instanceof Command) {
      console.info(`[Command] ${modules.name} is Loaded.`)
      this.modules.set(modules.name, modules)
      this.client.once('ready', () => {
        this.client.application?.commands.create({
          name: modules.name,
          description: modules.description,
          type: modules.type,
          options: modules.options,
          defaultPermission: modules.defaultPermission,
        })
      })
    } else if (modules instanceof Listener) {
    }
  }

  public loadAll() {
    const Dir = readdirSync(this.options.directory)

    if (this.options.loadType === 'FILE') {
      for (const File of Dir) {
        const Temp = require(`${this.options.directory}/${File}`)
        const modules = new Temp()
        this.Register(modules)
      }
    }
  }
}
