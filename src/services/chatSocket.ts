export class ChatWebsocket {
    private ws: WebSocket | null = null
    private url: string

    constructor(url: string) {
        this.url = url
    }

    public onopen?: () => void
    public onclose?: () => void
    public onerror?: (err: Event) => void

    public onmessage?: (event: MessageEvent) => void

    connect() {
        const state = this.ws?.readyState;
        if (state == WebSocket.CONNECTING || state == WebSocket.OPEN) return

        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
            this.onopen?.()
        }

        this.ws.onmessage = (event: MessageEvent) => {
            this.onmessage?.(event)
        }

        this.ws.onclose = () => {
            this.onclose?.()
        }

        this.ws.onerror = (err: Event) => {
            this.onerror?.(err)
        }
    }

    disconnect() {
        this.ws?.close()
        this.ws = null
    }

    send(data: string) {
        if (this.ws?.readyState == WebSocket.OPEN) {
            this.ws.send(data)
        }
    }

    get readyState() {
        return this.ws?.readyState
    }
}