declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_CONNECTION_STRING?: string;
    }
  }
}

export {};
