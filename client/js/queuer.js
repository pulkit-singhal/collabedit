export default class Queuer {
  constructor(ws) {
    this.ws = ws;
    this.queue = [];
  }

  sendPacket(packet) {
    if(this.ws.readyState !== 1) {
      this.queue.push(packet);
      setTimeout(this.clearQueue, 1000);
    } else {
      this.ws.send(packet);
    }
  }

  clearQueue() {
    if(this.queue.length === 0) {
      return;
    }
    let packet = this.queue.splice(0, 1);
    sendPacket(packet);
  }
}