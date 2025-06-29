const ws = new WebSocket('ws://127.0.0.1:8080');

const callbackMap = new Map<string, (info: IResultInfo<unknown>) => void>();

const wsOpenPromise = new Promise<void>((resolve) => {
  ws.onopen = () => resolve();
});

async function sendMessage(msg: string) {
  await wsOpenPromise;
  ws.send(msg);
}

function onMessage(msg: string) {
  const info = JSON.parse(msg) as IResultInfo<unknown>;
  callbackMap.get(info.Id)?.(info);
}

ws.onmessage = (ev) => onMessage(ev.data);

const getInvokeId = (() => {
  let state = 1;
  return () => (state++).toString();
})();

const getObjectId = (() => {
  let state = 1;
  return () => (state++).toString();
})();

async function invoke<TResult>(
  object: string,
  service: string,
  method: string,
  ...args: unknown[]
) {
  return new Promise<TResult>((resolve, reject) => {
    const id = getInvokeId();
    callbackMap.set(id, (info) => {
      if (info.Err) reject(info.Err);
      else resolve(info.Result as TResult);
    });
    sendMessage(JSON.stringify({ id, object, service, method, args }));
  });
}

export async function createRemoteObj<TArgs, TObject = any>(
  service: string,
  args?: TArgs,
): Promise<TObject> {
  const object = getObjectId();
  await invoke(object, service, 'constructor', args);
  const target: IRemoteObject = {
    Object: object,
    Service: service,
    Invoke: <TResult>(method: string, ...args: unknown[]) =>
      invoke<TResult>(object, service, method, ...args),
    Dispose: () => invoke(object, service, 'dispose'),
  };
  const proxy = new Proxy(target, {
    get(target: any, property: any) {
      if (target[property]) return target[property];
      if (property === 'then') return undefined;
      return (...args: any[]) => target.Invoke(property, ...args);
    },
  });
  return proxy;
}
