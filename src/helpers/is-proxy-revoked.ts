const isProxyRevoked = (proxy: any) => {
  try {
    new Proxy(proxy, proxy)

    proxy.prop

    return false
  } catch (err) {
    return Object(proxy) === proxy
  }
}

export default isProxyRevoked
