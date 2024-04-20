export type UserProps = {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export interface UserDAOProtocol {
  inList<T extends keyof UserProps>(
    field: T,
    list: UserProps[T][],
  ): Promise<UserProps[]>;
}
