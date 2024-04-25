import { CreateOutingRepositoryProtocol } from "@/application/protocols/create-outing.repository.protocol";
import EitherFactory from "@/domain/shared/either";
import { MemberDAOProtocol } from "../protocols/member.dao.protocol";
import { OutingDAOProtocol } from "../protocols/outing.dao.protocol";
import { InfraError } from "@/domain/shared/errors";

export class CreateOutingRepository implements CreateOutingRepositoryProtocol {
  constructor(
    private readonly memberDAO: MemberDAOProtocol,
    private readonly outingDAO: OutingDAOProtocol,
  ) {}

  // TODO: implement UnityOfWork pattern
  async create({
    outing,
  }: CreateOutingRepositoryProtocol.Input): CreateOutingRepositoryProtocol.Output {
    try {
      const { outingId } = await this.outingDAO.insertOne({
        outing: {
          id: outing.id,
          placeName: outing.placeName,
          serviceFee: outing.serviceFee,
          date: outing.date,
          createdAt: outing.createdAt,
          updatedAt: outing.updatedAt,
        },
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
      });
      return EitherFactory.right({ outingId: outingId });
    } catch (error) {
      console.error(error);
      return EitherFactory.left(
        new InfraError(`Error on create outing: ${error.message}`),
      );
    }
  }
}
