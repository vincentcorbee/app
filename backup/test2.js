// if (parent) {
    //   const mutationObserver = new MutationObserver(mutations =>
    //     mutations.forEach(({ removedNodes }) => {
    //       for (const removed of removedNodes) {
    //         if (
    //           removed === node &&
    //           !self.isDetached &&
    //           (self.toBeRemoved || !parent.node.contains(node))
    //         ) {
    //           mutationObserver.disconnect()

    //           if (parent) {
    //             parent.removeChild(self)
    //           } else {
    //             const { children } = self

    //             self.detach()

    //             if (children) {
    //               children.forEach(child => self.removeChild(child))
    //             }
    //           }

    //           break
    //         }
    //       }
    //     })
    //   )

    //   mutationObserver.observe(parent.node, {
    //     childList: true,
    //     subtree: true
    //   })
    // }

    // console.log(self)
    // console.log(__id__)
    // console.log(__count__)

    class Collector extends Emitter {
      constructor() {
        super()
        this.count = 0
        // this.interval = null
        this.isCollecting = false
      }

      start() {
        if (this.isCollecting) return

        this.isCollecting = true

        setZeroTimeout(() => {
          // console.log(this.count)
          if (this.count !== __count__) {
            this.count = __count__

            this.emit('collect')

            this.isCollecting = false

            return this.start()
          }

          this.isCollecting = false
        })
        // this.interval =
        //   this.interval ||
        //   setInterval(() => {
        //     // console.log(this.count)

        //     if (this.count !== __count__) {
        //       this.count = __count__

        //       return this.emit('collect')
        //     }

        //     return this.stop()
        //   }, 1000)
      }

      // stop() {
      //   clearInterval(this.interval)

      //   this.interval = null
      // }
    }