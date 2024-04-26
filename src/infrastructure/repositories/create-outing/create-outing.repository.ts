import { PoolClient } from "pg";
import { CreateOutingRepositoryProtocol } from "@/application/protocols/create-outing.repository.protocol";
import EitherFactory from "@/domain/shared/either";
import { InfraError } from "@/domain/shared/errors";
import { UnityOfWorkInterface } from "@/infrastructure/database/types/uow.interface";
import { InsertManyMemberDAOProtocol } from "../protocols/member-insert.dao.protocol";
import { InsertOutingDAOProtocol } from "../protocols/outing-insert.dao.protocol";

export class CreateOutingRepository implements CreateOutingRepositoryProtocol {
  constructor(
    private readonly uow: UnityOfWorkInterface<PoolClient>,
    private readonly memberDAO: InsertManyMemberDAOProtocol,
    private readonly outingDAO: InsertOutingDAOProtocol,
  ) {}

  async create({
    outing,
  }: CreateOutingRepositoryProtocol.Input): CreateOutingRepositoryProtocol.Output {
    try {
      await this.uow.beginTransaction();
      const { outingId } = await this.outingDAO.insertOne({
        outing: {
          id: outing.id,
          placeName: outing.placeName,
          serviceFee: outing.serviceFee,
          date: outing.date,
          createdAt: outing.createdAt,
          updatedAt: outing.updatedAt,
        },
        dbContext: this.uow.getContext(),
      });
      await this.memberDAO.insertMany({
        members: outing.members.map((member) => ({
          id: member.id,
          outingId: outingId,
          userId: member.user.id,
          isGuest: member.isGuest,
          isSponsor: member.isSponsor,
          sponsorValue: member.sponsorValue,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        })),
        dbContext: this.uow.getContext(),
      });
      await this.uow.commitTransaction();
      return EitherFactory.right({ outingId: outingId });
    } catch (error) {
      await this.uow.rollbackTransaction();
      console.error(error);
      return EitherFactory.left(
        new InfraError(`Error on create outing: ${error.message}`),
      );
    }
  }
}
