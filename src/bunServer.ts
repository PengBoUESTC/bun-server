export type Handler = (req: Request, res?: Response) => Response

export class BunServer {
  private handlerMap: Map<string, Handler[]>
  private globalKey: string

  constructor() {
    this.globalKey = '__global_key__'
    this.handlerMap = new Map()
  }

  use(handler: Handler) {
    const handlers = this.handlerMap.get(this.globalKey) || []
    if(handlers.includes(handler)) return
    handlers.push(handler)
    this.handlerMap.set(this.globalKey, handlers)
  }

  listen(port: number) {
    const handlers = this.handlerMap.get(this.globalKey) || []
    Bun.serve({
      fetch(req: Request){
        return handlers.reduce((res, handler) => {
          return handler(req, res)
        }, new Response('gg'))
      },
      port,
    })
  }
}


new BunServer().listen(8080)