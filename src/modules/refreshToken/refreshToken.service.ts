import { TRefreshToken, TRefreshTokenPayload } from '@common/types';
import { RefreshTokenRepo } from './refreshToken.repo';

export class RefreshTokenService {
  private readonly refereshTokenRepo = new RefreshTokenRepo();

  public async save(data: { login: string; token: string }) {
    const savedToken = await this.refereshTokenRepo.create(data);
  }

  public async delete(data: Partial<TRefreshToken>) {
    return await this.refereshTokenRepo.findOneAndDelete(data);
  }

  public async findOneBy(data: Partial<TRefreshToken>) {
    return await this.refereshTokenRepo.findOneByLogin(data);
  }

  public async update(
    data: Partial<TRefreshToken>,
    updateData: Omit<TRefreshToken, '_id' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.refereshTokenRepo.findOneAndUpdate(data, { $set: updateData });
  }
}
