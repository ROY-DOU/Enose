interface IInvokeInfo<TArgs> {
  Id: string;
  Object?: string;
  Service: string;
  Method: string;
  Args: TArgs;
}

interface IResultInfo<TResult> {
  Id: string;
  Result?: TResult;
  Err?: Error;
}

interface IRemoteObject {
  Object: string;
  Service: string;
  Invoke: <TResult>(method: string, ...args: unknown[]) => Promise<TResult>;
  Dispose: () => Promise<void>
}
